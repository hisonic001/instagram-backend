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

// resolver가 실행되기 전에 user가 login되어 있는지 context(token)의 유무로 확인
// function oriented programming -> function을 받고 function을 return
// OurResolver function을 받아서 다시 OurResolver fuction을 return
// ex) protectResolver(OurResolver(root,args,context,info))와 비슷하게 동작
export const protectResolver = (ourResolver) => (root, args, context, info) => {
  if (!context.loggedInUser) {
    return {
      ok: false,
      error: "you are not logged in",
    };
  }
  return ourResolver(root, args, context, info);
};
