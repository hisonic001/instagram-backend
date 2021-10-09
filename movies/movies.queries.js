import client from "../client";
export default {
  Query: {
    movies: () => client.movie.findMany(), // Read => client를 사용해 movie data 검색
    movie: (_, { id }) => client.movie.findUnique({ where: { id } }), // es6 문법 {id} == {id:id}
  },
};
