import client from "../../client";

export default {
  Query: {
    seeHashtags: (_, { hashtag }) =>
      client.hashtag.findUnique({
        where: {
          hashtag,
        },
      }),
  },
};
