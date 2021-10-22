import { gql } from "apollo-server";

export default gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    hashtags: [Hashtag]
    totalLikes: Int
    createdAt: String!
    updatedAt: String!
  }

  type Hashtag {
    id: Int!
    hashtag: String!
    photos(page: Int): [Photo]
    ${/*type에서 직접적으로 page와 같은 argument 설정이 가능*/ ""}
    totalPhotos: Int
    createdAt: String!
    updatedAt: String!
  }

  type Like{
    id: Int!
    photo: Photo!
    createdAt: String!
    updatedAt: String!
  }
`;
