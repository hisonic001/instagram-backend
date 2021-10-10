import client from "../client";
import bcrypt from "bcryptjs";
const saltRounds = 10;

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, userName, email, password }
    ) => {
      // await과 함께 자주 사용 try{} catch{}로 error 발생시  catch의 코드 실행
      try {
        // check if username or email is already existing
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ userName }, { email }],
          },
        });

        if (existingUser) {
          throw new Error("This username/password is already taken");
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // save and return the user
        return client.user.create({
          data: {
            userName,
            email,
            firstName,
            lastName,
            password: hashPassword,
          },
        });
      } catch (e) {
        return e;
      }
    },
  },
};
