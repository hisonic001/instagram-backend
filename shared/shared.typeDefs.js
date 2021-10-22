import { gql } from "apollo-server";

// Mutation Result를 gql에 등록시켜
// 전체 프로젝트의 result, error 확인 type들을 치환
export default gql`
  type MutationResult {
    ok: Boolean!
    error: String
  }
`;
