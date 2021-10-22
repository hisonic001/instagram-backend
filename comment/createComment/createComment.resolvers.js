import client from "../../client";
import { protectResolver } from "../../users/users.util";

const resolverFnc = async (_, { photoId, text }, { loggedInUser }) => {
  const checkComment = await client.photo.findUnique({
    where: { id: photoId },
    select: { id: true },
  });

  if (!checkComment) {
    return {
      ok: false,
      error: "can't find photo",
    };
  }

  await client.comment.create({
    data: {
      user: { connect: { id: loggedInUser.id } },
      text,
      photo: { connect: { id: photoId } },
    },
  });

  return {
    ok: true,
  };
};

export default {
  Mutation: {
    createComment: protectResolver(resolverFnc),
  },
};
