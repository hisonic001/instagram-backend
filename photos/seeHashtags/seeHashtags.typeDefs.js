import { gql } from "apollo-server";

export default gql`
  type Query {
    seeHashtags(hashtag: String!): Hashtag
  }
`;
