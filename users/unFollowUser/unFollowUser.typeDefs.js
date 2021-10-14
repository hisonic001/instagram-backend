import { gql } from "apollo-server";

export default gql`
  type unFollowUserResult {
    ok: Boolean!
    error: String
  }

  type Mutation {
    unFollowUser(userName: String!): unFollowUserResult!
  }
`;
