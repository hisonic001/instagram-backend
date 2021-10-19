import { gql } from "apollo-server";

export default gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String
    userName: String!
    email: String!
    bio: String
    avatar: String
    photos: [Photo]
    createdAt: String!
    updatedAt: String!
    follower: [User]${/*array of User*/ ""}
    following: [User]
    isFollowing: Boolean
    isMySelf: Boolean
    totalFollower: Int
    totalFollowing: Int
  }
`;
