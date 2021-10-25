import { gql } from "apollo-server";

// subscribtion type 사용
export default gql`
  type Subscription {
    roomUpdates(id: Int!): DM
  }
`;
