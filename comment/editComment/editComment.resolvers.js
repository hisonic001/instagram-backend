import client from "../../client";
import { protectResolver } from "../../users/users.util";

const resolverFnc = async (_, { id, newText }, { loggedInUser }) => {
  const checkComment = await client.comment.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!checkComment) {
    return {
      ok: false,
      error: "Comment not found",
    };
  } else if (checkComment.userId !== loggedInUser.id) {
    return {
      ok: false,
      error: "You are authorized to change comment",
    };
  } else {
    await client.comment.update({
      where: { id },
      data: { text: newText },
    });
  }
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    editComment: protectResolver(resolverFnc),
  },
};
