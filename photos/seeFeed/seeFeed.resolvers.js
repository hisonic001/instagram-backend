import { protectResolver } from "../../users/users.util";
import client from "../../client";

const resolverFnc = (_, __, { loggedInUser }) =>
  client.photo.findMany({
    where: {
      OR: [
        { user: { follower: { some: { id: loggedInUser.id } } } },
        { userId: loggedInUser.id },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

export default {
  Query: {
    seeFeed: protectResolver(resolverFnc),
  },
};
