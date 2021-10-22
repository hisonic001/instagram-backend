import client from "../../client";
import { protectResolver } from "../../users/users.util";

const resolverFnc = async (_, { id }, { loggedInUser }) => {
  const checkPhoto = await client.photo.findUnique({
    where: { id },
  });

  // id로 사진이 있는지 확인
  // 없다면 error
  if (!checkPhoto) {
    ok: false;
    error: "Photo not found";
  }
  const likeWhere = {
    photoId_userId: {
      userId: loggedInUser.id,
      photoId: id,
    },
  };

  // loggedInUser가 해당 사진을 like하고 있는지 확인
  const like = await client.like.findUnique({
    where: likeWhere,
  });

  // 이미 like하고 있다면 like 지우기
  // -> toggle 기능으로 향후 like를 눌러 like 생성과 해제 가능
  if (like) {
    await client.like.delete({
      where: likeWhere,
    });
  }
  // 아니라면 like 생성
  else {
    await client.like.create({
      data: {
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        photo: { connect: { id: checkPhoto.id } },
      },
    });
  }
  return {
    ok: true,
  };
};

// protect Resolver로 token 소지 확인
export default {
  Mutation: {
    toggleLike: protectResolver(resolverFnc),
  },
};
