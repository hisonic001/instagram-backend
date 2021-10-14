import { UserInputError } from "apollo-server";
import client from "../../client";
import { protectResolver } from "../user.util";

const resolverFnc = async (_, { userName }, { loggedInUser }) => {
  const checkUserName = await client.user.findUnique({ where: { userName } });
  if (!checkUserName) {
    return {
      ok: false,
      error: "User is not existing",
    };
  }

  await client.user.update({
    where: { id: loggedInUser.id },
    data: { following: { connect: { userName } } },
  });
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    followUser: protectResolver(resolverFnc),
  },
};
