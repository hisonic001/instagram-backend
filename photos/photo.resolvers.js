import client from "../client";

export default {
  Photo: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: (
      { id } // id의 주체는 root인 photo
    ) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: { id },
          },
        },
      }),
  },

  Hashtag: {
    photos: (
      { id } // id의 주체는 root인 hashtag
    ) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: { id },
          },
        },
      }),
  },
};
