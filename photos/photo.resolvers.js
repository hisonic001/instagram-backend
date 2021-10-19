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
    // id의 주체는 root인 hashtag
    photos: ({ id }, { page }) =>
      client.hashtag
        .findUnique({
          where: { id },
        })
        .photos({ take: 5, skip: (page - 1) * 5 }),

    totalPhotos: ({ id }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: { id },
          },
        },
      }),
  },
};
