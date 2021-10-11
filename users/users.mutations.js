import client from "../client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

    //
    login: async (_, { userName, password }) => {
      // find User with userName
      const user = await client.user.findUnique({ where: { userName } });
      // user가 db에서 확인되지 않으면 -> error massage
      if (!user) {
        return { ok: false, error: "User is not Found" };
      }
      // user가 db에서 확인되면 check password with hashed password
      else {
        const checkPassword = await bcrypt.compare(password, user.password);
        // password incorrect -> error massage
        if (!checkPassword) {
          return { ok: false, error: "Incorrect Password" };
        }
        // password correct -> ssue a token and send it to user
        else {
          const token = await jwt.sign(
            { id: user.id },
            process.env.PRIVATE_KEY //.pocess.env는 전역함수로 어디서든 사용가능
          );
          return {
            ok: true,
            token,
          };
        }
      }
    },
  },
};
