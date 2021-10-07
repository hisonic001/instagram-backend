// 아폴로 파일 서버 코드 작성
// nodemon으로 코드가 수정될 때마다 자동으로 서버 재시작
// nodemon 설치는 npm install --save-dev로 dependency가 아닌 devDepenenecies 객체에 추가
// json package 파일에서 dependency와 script(nodemon --exec node server.js) 수정

// Apollo server와 grapQL을 import
// ApolloServer는 서버 인스턴스 생성자
import {ApolloServer, gql} from "apollo-server";    // babel로 js 문법을 구버전 브라우저에서 인식하도록 compiling(변환) 다만 테스트 단계에서만 사용(성능저하)


// gql은 js로 스키마 정의를 위한 'template literal tag' 백팁(`) 이용
// 템플릿 리터럴에서 String Interpolation: ${}로 표현, 변수 삽입 가능, 마치 python의 f-string과 비슷
// 이후에는 숫자든지간에 강제로 String type으로 변환된다.
const typeDefs = gql`
    type Query {
        ${/*주석쓰기가 좀 까다롭다..*/''}
        hey: String${/*string을 응답하는 hey이라는 쿼리를 정의*/''}

    }
`;

const resolvers = {
    Query: {
        hey : () => "restarted!!" // hey를 요청하면 항상 "im coming" 문자열 응답
    },
};


/* 마지막으로 typeDefs와 resolvers를 ApolloServer 
생성 인스턴스에 넘겨서 GQL 서버 인스턴스 생성하고 서버 시작*/
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// 서버를 listen 했으면 콘솔로그를 출력해준다.
server.listen().then(() => console.log("Server is running on http://localhost:4000/"))
