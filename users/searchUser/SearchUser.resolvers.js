import client from "../../client";

export default {
  Query: {
    // 키워드를 통해서 user 검색
    // startWith filter를 통해서 키워드로 시작하는 username 검색
    searchUser: async (_, { keyword }) =>
      client.user.findMany({
        where: {
          userName: {
            mode: "insensitive",
            startsWith: keyword, // 혹시나 대문자로 쓸 경우 대비
          },
        },
      }),
  },
};
