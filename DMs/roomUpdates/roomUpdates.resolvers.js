import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_DM } from "../../constants";
import pubsub from "../../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      // subcribe function 생성
      // return pubsub engine

      subscribe: async (root, args, context, info) => {
        // room id 확인 + user가 room에 속해있는지 까지 확인
        const checkRoom = await client.room.findFirst({
          where: {
            id: args.id,
            users: { some: { id: context.loggedInUser.id } },
          },
          select: { id: true },
        });

        // room이 없거나 user가 room에 속해있지 않으면 error throw
        if (!checkRoom) {
          throw new Error("roomUpdate error");
        }
        return withFilter(
          // asyncIterator는 trigger listener
          // NEW_DM을 trigger로 설정
          () => pubsub.asyncIterator(NEW_DM),

          // 두번째 function으로 filtering
          // ({payload}-roomUpdate와 받은 DM값,{variables}-roomUpdate typedef argument값,{context})
          async ({ roomUpdates }, { id }, { loggedInUser }) => {
            // DM에서 받아온 roomId와 입력한 id값이 다르면
            if (roomUpdates.roomId === id) {
              // double check 이전 room check과 같음
              const checkRoom = await client.room.findFirst({
                where: {
                  id,
                  users: { some: { id: loggedInUser.id } },
                },
                select: { id: true },
              });
              // return 값이 true일 때만 payload값 return
              if (!checkRoom) {
                return false;
              }
              return true;
            }
          }
        )(root, args, context, info); // wihtFIlter가 resolver가 되므로 필요
      },
    },
  },
};
