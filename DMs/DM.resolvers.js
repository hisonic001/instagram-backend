import client from "../client";

export default {
  Room: {
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
    DMs: ({ id }, { page }) =>
      client.dM.findMany({
        where: { roomId: id },
        skip: (page - 1) * 5,
        take: 5,
      }),

    // 안읽은 메시지 카운트
    totalUnSeen: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      client.dM.count({
        where: {
          isSeen: false,
          roomId: id,
          userId: { not: loggedInUser.id },
          // 내가 생성하지 않은 메시지만 카운트
        },
      });
    },
  },
};
