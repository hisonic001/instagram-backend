// prisma client 파일 => db를 제어하는 클라이언트 생성 및 export

import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export default client;
