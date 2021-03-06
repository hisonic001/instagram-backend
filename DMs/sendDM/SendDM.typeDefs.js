import { gql } from "apollo-server";

export default gql`
  type Mutation {
    sendDM(text: String!, roomId: Int, userId: Int): MutationResult!
  }
`;
