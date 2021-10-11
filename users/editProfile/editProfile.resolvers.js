import client from "../../client";
import bcrypt from "bcryptjs";
const saltRounds = 10;

export default {
  Mutation: {
    // user profile changing process
    // context에 입력하는 정보는 어느 resolver에서나 접근이 가능해진다.
    // 그러므로 token 정보를 context에 입력
    editProfile: async (
      _,
      { firstName, lastName, userName, password: newPassword, email },
      { loggedInUser }
    ) => {
      // hash the PWD if user input newPWD and return it
      console.log(loggedInUser);
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
          ...(hashedPWD && { password: hashedPWD }),
          // es6 ... 문법 note
          // same as if (hashedPWD){return password:hashedPWD}
        },
      });

      // update할 내용들이 있는지 없는지 확인하고 return
      if (checkUpdate) {
        // update 성공
        return { ok: true };
      } else {
        // update 실패
        return { ok: false, error: "could't update profile" };
      }
    },
  },
};
