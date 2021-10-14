import client from "../../client";

export default {
  Query: {
    // user profile lookup by username
    seeProfile: (_, { userName }) =>
      client.user.findUnique({
        where: { userName },
        include: { following: true, follower: true },
      }), // include 통해서 realationship을 불러올 수 있다
  },
};
