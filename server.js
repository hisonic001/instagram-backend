// 아폴로 파일 서버 코드 작성
// nodemon으로 코드가 수정될 때마다 자동으로 서버 재시작
// nodemon 설치는 npm install --save-dev로 dependency가 아닌 devDepenenecies 객체에 추가
// json package 파일에서 dependency와 script(nodemon --exec node server.js) 수정

// Apollo server와 grapQL을 import
// ApolloServer는 서버 인스턴스 생성자
import { ApolloServer, gql } from "apollo-server"; // babel로 js 문법을 구버전 브라우저에서 인식하도록 compiling(변환) 다만 테스트 단계에서만 사용(성능저하)
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient(); // database와 소통하기 위한 prismaclient 생성하기
// gql은 js로 스키마 정의를 위한 'template literal tag' 백팁(`) 이용
// 템플릿 리터럴에서 String Interpolation: ${}로 표현, 변수 삽입 가능, 마치 python의 f-string과 비슷
// 이후에는 숫자든지간에 강제로 String type으로 변환된다.
const typeDefs = gql`
  type Movie {
    id: Int!${/*!로 field가 non-nullable임을 의미*/ ""}
    title: String!
    year: Int!
    genre: String
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    movies: [Movie]
    movie(id: Int!): Movie
  }
  type Mutation {
    createMovie(title: String!, year: Int!, genre: String): Movie
    deleteMovie(id: Int!): Movie
    updateMovie(id: Int!, title: String, year: Int, genre: String): Movie
  }
`;

const resolvers = {
  Query: {
    movies: () => client.movie.findMany(), // Read => client를 사용해 movie data 검색
    movie: (_, { id }) => client.movie.findUnique({ where: { id } }), // es6 문법 {id} == {id:id}
  },

  Mutation: {
    // mutation:(root,args,context,info) => "",
    // 4가지의 매개변수를 가질 수 있다.
    // Create => title,year,genre를 가진 type:movie를 만들어 database에 저장
    createMovie: (_, { title, year, genre }) =>
      client.movie.create({
        data: {
          title,
          year,
          genre,
        },
      }),
    // Delete => id를 통해서 database의 movie delete
    deleteMovie: (_, { id }) => client.movie.delete({ where: { id } }),
    // Update => id값으로 특정 data를 업데이트해주기)
    updateMovie: (_, { id, title, year, genre }) =>
      client.movie.update({ where: { id }, data: { title, year, genre } }),
  },
};

/* 마지막으로 typeDefs와 resolvers를 ApolloServer 
생성 인스턴스에 넘겨서 GQL 서버 인스턴스 생성하고 서버 시작*/
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 서버를 listen 했으면 콘솔로그를 출력해준다.
server
  .listen()
  .then(() => console.log("Server is running on http://localhost:4000/"));
