import client from "../../client";

// pagination 추가하기
export default {
  Query: {
    seePhotoComments: (_, { id }) =>
      client.comment.findMany({
        where: { photoId: id },
        orderBy: { createdAt: "desc" },
      }),
  },
};
