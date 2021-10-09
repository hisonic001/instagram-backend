// 아폴로 파일 서버 코드 작성
// nodemon으로 코드가 수정될 때마다 자동으로 서버 재시작
// nodemon 설치는 npm install --save-dev로 dependency가 아닌 devDepenenecies 객체에 추가
// json package 파일에서 dependency와 script(nodemon --exec node server.js) 수정
require("dotenv").config();
import { ApolloServer } from "apollo-server"; // babel로 js 문법을 구버전 브라우저에서 인식하도록 compiling(변환) 다만 테스트 단계에서만 사용(성능저하)
import schema from "./schema";

// import한 tyDefs와 resolvers로 new ApploServer 시작
const server = new ApolloServer({
  schema,
});

const PORT = process.env.PORT; //env에서 PORT 가져오기

// 서버를 시작하면 콘솔로그를 출력해준다.
server
  .listen(PORT)
  .then(() => console.log(`⚡Server is running on http://localhost:${PORT}/`));
