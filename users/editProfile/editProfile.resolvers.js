import client from "../../client";
import bcrypt from "bcryptjs";
import { protectResolver } from "../user.util";
const saltRounds = 10;

// user profile changing process
// context에 입력하는 정보는 어느 resolver에서나 접근이 가능해진다.
// 그러므로 token 정보를 context에 입력
const resolverFnc = async (
  _,
  { firstName, lastName, userName, password: newPassword, email, bio, avatar },
  { loggedInUser }
) => {
  // protect the resolver by checking context info(token)
  // hash the PWD if user input newPWD and return it
  let hashedPWD = null;
  if (newPassword) {
    hashedPWD = await bcrypt.hash(newPassword, saltRounds);
  }
  // update할 내용들을 client를 통해서 db에 전송 및 수정
  const checkUpdate = await client.user.update({
    where: { id: loggedInUser.id },
    data: {
      firstName,
      lastName,
      userName,
      email,
      bio,
      avatar,
      ...(hashedPWD && { password: hashedPWD }),
      // es6 ... 문법 note
      // same as if (hashedPWD){return password:hashedPWD}
    },
  });
  if (checkUpdate.id) {
    return { ok: true };
  } else {
    return { ok: false, error: "cant update your profile" };
  }
};
// check update id가 있다 === token verification passed

// prodectResolver를 통해서 resolverFnc를 실행
// 토큰이 없으면 return {false & error}
export default {
  Mutation: {
    editProfile: protectResolver(resolverFnc),
  },
};
