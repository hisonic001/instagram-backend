import { gql } from "apollo-server";

export default gql`
  type Mutation {
    createAccount(
      firstName: String!
      lastName: String
      userName: String!
      password: String!
      email: String!
    ): MutationResult!
  }
`;
