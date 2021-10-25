import client from "../client";

export default {
  Room: {
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
    DMs: ({ id }, { lastRecord }) =>
      client.dM.findMany({
        where: { roomId: id },
        take: 5,
        skip: lastRecord ? 1 : 0,
        ...(lastRecord && { cursor: { id: lastRecord } }),
      }),

    // 안읽은 메시지 카운트
    totalUnSeen: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.dM.count({
        where: {
          isSeen: false,
          roomId: id,
          userId: { not: loggedInUser.id },
          // 내가 생성하지 않은 메시지만 카운트
        },
      });
    },
  },
  DM: {
    user: ({ id }) => client.dM.findUnique({ where: { id } }).user(),
  },
};
