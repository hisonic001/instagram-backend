import { gql } from "apollo-server";

export default gql`
  type Query {
    seeRooms: [Room]
  }
`;
// loggedInUser의 대화방이라 argument가 필요치 않다
