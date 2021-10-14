import client from "../../client";
export default {
  Query: {
    seeFollowers: async (_, { userName }, { page }) => {
      const checkFollower = await client.user.findUnique({
        where: { userName },
        select: { id: true }, // select를 통해서 특정 필드만 확인 가능
      });

      // follower를 확인하려는 user가 있는지 여부를 확인
      if (!checkFollower) {
        return {
          ok: false,
          error: "User not found",
        };
      }

      const followerList = await client.user
        .findUnique({
          where: { userName },
        })
        .follower({ take: 5, skip: (page - 1) * 5 }); // findUnique 뒤에 .을 표기하여 특정 user의 relation list 불러오기 가능
      // folower를 한페이지당 5명만(take) 보여주고
      // skip은 (page-1)*5명씩 스킵한다. 즉 page수에 따라 5명씩 스킵

      const totalPages = await client.user.count({
        where: { following: { some: { userName } } },
      }); // relation filter(some,every,none)

      return {
        ok: true,
        follower: followerList,
        totalPages,
      };
    },
  },
};
