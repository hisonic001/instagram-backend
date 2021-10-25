// schema file => gql로 db에서 data를 가져오기 위한 query 생성, typedefs, resolvers..
// gql-tools로 필요한 파일들 merge
// gql-tools update로 인해서 merge,load,schema 따로 설치해줘야함 npm i @graph-tools/merge...
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

// typedefs load 후에 merge로 합쳐주기
const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
export const typeDefs = mergeTypeDefs(loadedTypes);

// resolvers load 후에 merge로 합쳐주기
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);
export const resolvers = mergeResolvers(loadedResolvers);
// schema를 apollo server가 만들게 하여 upload file schema가 사용가능하게 한다.
