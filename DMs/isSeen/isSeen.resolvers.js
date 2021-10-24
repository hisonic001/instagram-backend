import client from "../../client";
import { protectResolver } from "../../users/users.util";

const resolverFnc = async (_, { id }, { loggedInUser }) => {
  const checkDM = await client.dM.findFirst({
    where: {
      id, // dm이 같은 id인지 확인
      userId: { not: loggedInUser.id }, // 나 이외의 사람이 작성한 DM
      room: { users: { some: { id: loggedInUser.id } } }, // 로그인 한 유저가 속한 room인가?
    },
    select: { id },
  });
  // DM이 조건에 안맞으면 error
  if (!checkDM) {
    return {
      ok: false,
      error: "DM not available",
    };
  }
  // DM이 확인되면 읽음으로 바꿔줌
  await client.dM.update({
    where: { id },
    data: { isSeen: true },
  });

  return { ok: true };
};

export default {
  Mutation: {
    isSeen: protectResolver(resolverFnc),
  },
};
