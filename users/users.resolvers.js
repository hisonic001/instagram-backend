import client from "../client";

// 전체 팔로워 팔로잉 수 카운트
// type User도 mutation이나 Query 같이 resolver를 만들어 줄 수 있다.
export default {
  User: {
    // 역으로 follower를 셀때는 그 user의 following 하는 사람의 수를 카운트
    totalFollower: (
      { id } // root 활용
    ) =>
      // (root,_,_,_) 여기서 root는 type User의 주체인 user
      // 그러므로 root의 아이디를 바로 {id}로 꺼내서 받아옴
      client.user.count({
        where: { following: { some: { id } } },
      }),

    totalFollowing: ({ id }) =>
      client.user.count({
        where: { follower: { some: { id } } },
      }),

    isMySelf: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      return loggedInUser.id === id; // log인 id와 현재 type User의 주체가 같으면 true
    },

    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      const checkFollowing = await client.user.count({
        where: {
          id: loggedInUser.id,
          following: { some: { id } },
        },
      });

      return Boolean(checkFollowing);
      // id = loggin user && following에 Usertype 주체의 id가 있는지 확인하여
      // count한 숫자를 주면 0이 아닐시 Boolean 함수로 true를 return
    },

    photos: ({ id }) => client.user.findUnique({ where: { id } }).photos(),
  },
};
