import client from "../../client";
import { protectResolver } from "../../users/users.util";

const queryFnc = async (_, __, { loggedInUser }) =>
  client.room.findMany({
    where: {
      users: { some: { id: loggedInUser.id } },
    },
  });

export default {
  Query: {
    seeRooms: protectResolver(queryFnc),
  },
};
