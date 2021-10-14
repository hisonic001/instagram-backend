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

  ////   미완성.. loggeduser의 followuser 중에 {userName}이 없으면 error
  //   const checkFollower = await client.user
  //     .findUnique({
  //       where: { id: loggedInUser.id },
  //     })
  //     .follower({ select: { userName: true } });

  //   console.log(checkFollower);

  //   if (!checkFollower) {
  //     return {
  //       ok: false,
  //       error: "you are not following is user",
  //     };
  //   }

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
    unFollowUser: protectResolver(resolverFnc),
  },
};
