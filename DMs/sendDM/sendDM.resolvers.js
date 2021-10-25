import client from "../../client";
import pubsub from "../../pubsub";
import { protectResolver } from "../../users/users.util";

const resolverFnc = async (_, { userId, roomId, text }, { loggedInUser }) => {
  let room = null;
  // user id 입력시
  if (userId) {
    const user = await client.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    // user id의 user가 없으면 error
    if (!user) {
      return {
        ok: false,
        error: "This user is not exist",
      };
    }
    // user id를 바탕으로 새로운 room 개설
    // 처음으로 새로운 DM을 보낼때 새로운 room을 만들면서 보내기
    // 새로운 room에 본인과 메세지를 보내는 대상을 connect
    room = await client.room.create({
      data: {
        users: { connect: [{ id: userId }, { id: loggedInUser.id }] },
      }, // 2개를 connect 할때는 []로 묶어주기
    });
  } else if (roomId) {
    // 기존의 룸 id를 활용,  룸 찾기
    room = await client.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });
    // roomID 기반의 room이 없으면 error
    if (!room) {
      return {
        ok: false,
        error: "This room is not exist",
      };
    }
  }
  // 새로운 DM 생성
  const createdDM = await client.dM.create({
    data: {
      user: { connect: { id: loggedInUser.id } },
      text,
      room: { connect: { id: room.id } },
    },
  });
  // pubsub를 통해서 event publish
  // publish 하는 event는 listening하는 것과 같은 형식의 roomupdates이며
  // createdDM을 ...으로 열어서 안의 내용이 publish될 수 있도록 한다.
  pubsub.publish("NEW_DM", { roomUpdates: { ...createdDM } });

  return {
    ok: true,
  };
};

export default {
  Mutation: {
    sendDM: protectResolver(resolverFnc),
  },
};
