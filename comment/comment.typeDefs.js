import { gql } from "apollo-server";
export default gql`
  type Comment {
    id: Int!
    user: User!
    photo: Photo!
    isMine: Boolean!
    text: String!
    createdAt: String!
    updatedAt: String!
  }
`;
