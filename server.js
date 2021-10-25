// 아폴로 파일 서버 코드 작성
// nodemon으로 코드가 수정될 때마다 자동으로 서버 재시작
// nodemon 설치는 npm install --save-dev로 dependency가 아닌 devDepenenecies 객체에 추가
// json package 파일에서 dependency와 script(nodemon --exec node server.js) 수정
require("dotenv").config();
import http from "http";
import express from "express"; // express 서버
import { ApolloServer } from "apollo-server-express"; // babel로 js 문법을 구버전 브라우저에서 인식하도록 compiling(변환) 다만 테스트 단계에서만 사용(성능저하)
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.util";
import logger from "morgan";
import { ConnectContactLens } from "aws-sdk";

const PORT = process.env.PORT; //env에서 PORT 가져오기
// import한 tyDefs와 resolvers로 new ApploServer 시작
const server = new ApolloServer({
  // gql이 아닌 apolloserver에서 직접 schema create
  // to use Upload scalar type built in apollo server
  typeDefs,
  resolvers,
  context: async (ctx) => {
    // 1. http 방식으로 request의 header에서 token값을 가져와 user 정보 return
    if (ctx.req) {
      return {
        loggedInUser: await getUser(ctx.req.headers.authorization),
      };
    }
    // 2. http protocol이 아닌 web-socket 방식으로 접근시 request가 존재하지 않음
    // onConnect에서 전달된 user 정보 꺼내기
    else {
      const authorization = ctx.connection.context.authorization;
      return {
        loggedInUser: await getUser(authorization),
      };
    }
  },
  // subsription resolver의 onConnect를 통해서 http header를 바로 받아볼 수 있다.
  subscriptions: {
    // 바로 token을 header에서 추출
    onConnect: ({ authorization }) => {
      // header가 없으면 throw error
      if (!authorization) {
        throw new Error("You can't listen");
      }
      return {
        authorization,
      };
    },
  },
});

const app = express();
app.use(logger("tiny"));
// 정적파일 제공하기 express의 static 메서드를 미들웨어로 로드
// static({폴더이름})으로 자체적으로 파일을 export
app.use("/static", express.static("uploads")); // {/static로 주소에 /static 경로 추가}
server.applyMiddleware({ app }); // apollo-server에 middleware로 express 끼얹기

//http 서버 생성
const httpServer = http.createServer(app);
//http server에 subscription(websocket) 정보를 설치
server.installSubscriptionHandlers(httpServer);

// 서버를 시작하면 콘솔로그를 출력해준다.
// server.listen(port, hostname, backlog, callback);

httpServer.listen(PORT, () => {
  console.log(
    `    ┊         ┊       ┊   ┊    ┊        ┊ ┊.⋆˚
    ┊         ┊       ┊   ┊    ┊        ┊ ˚✧
    ┊         ┊       ┊   ┊   ˚➶ ｡˚   ☁
    ┊         ┊       ┊    ☁
    ⁭⁭┊         ┊       ☪.      ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭
    ⁭┊         ✱ ⁭ ⁭ ⁭ ⁭ ⁭ ⋆˚ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭
    ┊         ★   ✧                             ⁭ ⁭ ⁭ ⁭ ⁭
    ✧ ⋆    . ┊ .  ✱˚ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭ ⁭     ⁭
    ★

    Server is running on http://localhost:${PORT}/graphql`
  );
});
