import client from "../../client";

export default {
  // keyword를 통해서 photo 검색
  Query: {
    searchPhoto: (_, { keyword }) =>
      client.photo.findMany({
        where: { caption: { mode: "insensitive", startsWith: keyword } },
      }),
  },
};
