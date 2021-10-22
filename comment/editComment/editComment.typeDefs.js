import { gql } from "apollo-server";

export default gql`
  type Mutation {
    editComment(id: Int!, newText: String!): MutationResult!
  }
`;
