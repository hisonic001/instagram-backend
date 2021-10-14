import client from "../../client";

export default {
  Query: {
    seeFollowing: async (_, { userName, lastRecord }) => {
      const checkUser = await client.user.findUnique({
        where: { userName },
        select: { id: true },
      });

      if (!checkUser) {
        return {
          ok: false,
          error: "User not found",
        };
      }

      const following = await client.user
        .findUnique({ where: { userName } })
        .following({
          take: 5,
          skip: lastRecord ? 1 : 0, // if lastId exist skip 1, else skip 0
          ...(lastRecord && { cursor: { id: lastRecord } }),
          // cursor => specifies the position of the list
          // lastRecord의 유무를 확인해 cursor가 첫페이지에서 없을 수도 있는 것을 대비하기
          // id:lastId(마지막 presenting id)를 cursor로 택하기
        });
      return {
        ok: true,
        following,
      };
    },
  },
};
