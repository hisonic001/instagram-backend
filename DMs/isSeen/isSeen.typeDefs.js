import { gql } from "apollo-server";

export default gql`
  type Mutation {
    isSeen(id: Int!): MutationResult!
  }
`;
