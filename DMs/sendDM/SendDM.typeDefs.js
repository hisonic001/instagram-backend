import { gql } from "apollo-server";

export default gql`
  type Mutation {
    CreateRoom(text: String!, roomId: Int, userId: Int): MutationResult!
  }
`;
