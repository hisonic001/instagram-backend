import client from "../../client";

export default {
  Query: {
    seePhotoLikes: async (_, { id }) => {
      const likes = await client.like.findMany({
        where: { photoId: id },
        select: { user: true },
      });
      // select는 하나의 data set만 가져오는 것
      // include는 추가로 가져오는 것 특히 집합체 user{}
      return likes.map((like) => like.user);
    },
  },
};
