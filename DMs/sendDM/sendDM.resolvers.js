import client from "../../client";
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
        users: { connect: { id: loggedInUser.id, id: loggedInUser.id } },
      },
    });
  } else if (roomId) {
    // 기존의 룸 id를 활용,  룸 찾기
    room = await client.room.findUnique({
      where: { id: roomId },
      select: { roomId: true },
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
  await client.dM.create({
    data: {
      user: { connect: { id: loggedInUser.id } },
      text,
      room: { connect: { id: room.id } },
    },
  });

  return {
    ok: true,
  };
};

export default {
  Mutation: {
    sendDM: protectResolver(resolverFnc),
  },
};
