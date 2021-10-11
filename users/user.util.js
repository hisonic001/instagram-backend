import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (authorization) => {
  try {
    if (!authorization) {
      return null;
    } else {
      // token에 들어있는 id를 바로 const 상수로 가져오기
      // login시에 발행했던 토큰을 바탕으로 토큰을 verify and decode
      // es6 문법 const{id} = {id:1, iat:1516151} // object 안의 id를 바로 꺼내서 적용
      const { id } = await jwt.verify(authorization, process.env.PRIVATE_KEY);
      const user = await client.user.findUnique({ where: { id } });
      if (user) {
        return user;
      } else {
        return null;
      }
    }
  } catch {
    return null;
  }
};
