import client from "../../client";
import { protectResolver } from "../user.util";

const resolverFnc = async (_, { userName }, { loggedInUser }) => {
  // username이 user 중에 있는지 확인
  const checkUserName = await client.user.findUnique({ where: { userName } });
  if (!checkUserName) {
    return {
      ok: false,
      error: "User is not existing",
    };
  }

  // loggeduser의 followuser 중에 {userName}이 없으면 error
  const checkFollower = await client.user.count({
    where: {
      id: loggedInUser.id,
      following: { some: { userName } },
    },
  });

  if (!Boolean(checkFollower)) {
    return {
      ok: false,
      error: "you are not following this user",
    };
  }

  // db 업데이트
  await client.user.update({
    where: { id: loggedInUser.id },
    data: { following: { disconnect: { userName } } },
  }); // disconnect는 following follower 관계를 끊고 지운다.
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    unFollowUser: protectResolver(resolverFnc), //login 확인절차
  },
};
