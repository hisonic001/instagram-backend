import client from "../../client";
import { protectResolver } from "../../users/users.util";
import { composeHashtag } from "../photos.util";

const resolverFnc = async (_, { id, caption }, { loggedInUser }) => {
  // 사진의 id로 특정 photo 호출 후 logged in user id로 확인
  const prevPhoto = await client.photo.findFirst({
    where: { id, userId: loggedInUser.id },
    include: { hashtags: { select: { hashtag: true } } },
  });

  // 호출된 photo 값이 null 이면 error
  if (!prevPhoto) {
    return {
      ok: false,
      error: "This photo is not yours",
    };
  }
  await client.photo.update({
    where: { id },
    data: {
      caption,
      hashtags: {
        disconnect: prevPhoto.hashtags, // 기존의 hashtag들은 disconnect
        connectOrCreate: composeHashtag(caption), // 새로운 hashtag들은 connect or Create
        // composeHashtag(caption)으로 caption에서 추출한 hashtag들을 array 형태로 반환
      },
    },
  });

  return {
    ok: true,
  };
};

export default {
  Mutation: {
    editPhoto: protectResolver(resolverFnc),
  },
};
