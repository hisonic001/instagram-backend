import { gql } from "apollo-server-core";

export default gql`
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
