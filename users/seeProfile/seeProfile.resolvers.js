import client from "../../client";

export default {
  Query: {
    // user profile lookup by username
    seeProfile: (_, { userName }) =>
      client.user.findUnique({ where: { userName } }),
  },
};
