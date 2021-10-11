import client from "../../client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
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
