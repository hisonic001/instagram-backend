import client from "../../client";
import { protectResolver } from "../../users/users.util";

const resolverFnc = async (_, { photoId }, { loggedInUser }) => {
  const checkComment = await client.comment.findUnique({
    where: { photoId },
    select: { userId: true },
  });
  if (!checkComment) {
    return {
      ok: false,
      error: "Comment is not found",
    };
  } else if (checkComment.userId !== loggedInUser.id) {
    return {
      ok: false,
      error: "You are not authorized",
    };
  } else {
    await client.comment.delete({ where: { photoId } });
  }
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    deleteComment: protectResolver(resolverFnc),
  },
};
