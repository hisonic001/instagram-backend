import { gql } from "apollo-server";

export default gql`
  type seeFollowingResult {
    ok: Boolean!
    error: String
    following: [User]
  }

  type Query {
    seeFollowing(userName: String!, lastRecord: Int): seeFollowingResult!
  }
`;
