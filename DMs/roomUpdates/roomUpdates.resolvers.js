import { withFilter } from "graphql-subscriptions";
import { NEW_DM } from "../../constants";
import pubsub from "../../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      // subcribe function 생성
      // return pubsub engine
      // asyncIterator는 trigger listener
      // NEW_DM을 trigger로 설정
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_DM),
        // 두번째 function으로 filtering
        // ({payload}-roomUpdate와 받은 DM값,{variables}-roomUpdate typedef argument값)
        ({ roomUpdates }, { id }) => {
          // return 값이 true일 때만 payload값 return
          return roomUpdates.roomId === id;
        }
      ),
    },
  },
};
