import { gql } from "apollo-server";

export default gql`
  type Mutation {
    editProfile(
      firstName: String
      lastName: String
      userName: String
      password: String
      email: String
      bio: String
      avatar: Upload
    ): MutationResult!
  }
`;
