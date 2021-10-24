import { gql } from "apollo-server";

export default gql`
  type DM {
    id: Int!
    text: String!
    user: User!
    room: Room!
    createdAt: String!
    updatedAt: String!
  }

  type Room {
    id: Int!
    users: [User]
    DMs: [DM]
    createdAt: String!
    updatedAt: String!
  }
`;
