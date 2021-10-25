import { gql } from "apollo-server";

export default gql`
  type DM {
    id: Int!
    text: String!
    user: User!
    room: Room!
    isSeen: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Room {
    id: Int!
    totalUnSeen: Int!
    users: [User]
    DMs(lastRecord: Int): [DM]
    createdAt: String!
    updatedAt: String!
  }
`;
