import { extendResolversFromInterfaces } from "apollo-server-core/node_modules/graphql-tools";
import { syntaxError } from "graphql";
import client from "../../client";
import { protectResolver } from "../../users/users.util";

const resolverFnc = (_, { id }, { loggedInUser }) =>
  // 내가 현재 있는 룸 찾기
  client.room.findFirst({
    where: {
      id,
      users: { some: { id: loggedInUser.id } },
    },
  });

export default {
  Query: {
    seeRoom: protectResolver(resolverFnc),
  },
};
