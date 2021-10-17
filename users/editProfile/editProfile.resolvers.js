import client from "../../client";
import bcrypt from "bcryptjs";
import { protectResolver } from "../users.util";
import { createWriteStream } from "fs";

const saltRounds = 10;

// user profile changing process
// context에 입력하는 정보는 어느 resolver에서나 접근이 가능해진다.
// 그러므로 token 정보를 context에 입력
const resolverFnc = async (
  _,
  { firstName, lastName, userName, password: newPassword, email, bio, avatar },
  { loggedInUser }
) => {
  // url 변수 설정
  let avatarUrl = null;
  if (avatar) {
    const { filename, createReadStream } = await avatar;
    const newFilename = `${loggedInUser.id}-${Date.now}-${filename}`;
    // avatar 안에 createReadStream 함수가 포함되어 있음
    const readStream = createReadStream();
    // process.cwd() => path argument로 current workign directory + 경로 + filename을 입력
    const writeStream = createWriteStream(
      process.cwd() + "/uploads/" + newFilename
    ); // unique한 파일 이름을 만들기 위해 user.id와 date를 추가
    // pipe 연결. 실제로는 AWS 를 활용
    readStream.pipe(writeStream);
    // newFilename을 바탕으로 한 URL을 변수에 저장
    avatarUrl = `http://localhost:4000/static/${newFilename}`; // just to check url is saved in DB
  }
  // protect the resolver by checking context info(token)
  // hash the PWD if user input newPWD and return it
  let hashedPWD = null;
  if (newPassword) {
    hashedPWD = await bcrypt.hash(newPassword, saltRounds);
  }
  // update할 내용들을 client를 통해서 db에 전송 및 수정
  const checkUpdate = await client.user.update({
    where: { id: loggedInUser.id },
    data: {
      firstName,
      lastName,
      userName,
      email,
      bio,
      ...(avatarUrl && { avatar: avatarUrl }),
      ...(hashedPWD && { password: hashedPWD }),
      // es6 ... 문법 note
      // same as if (hashedPWD){return password:hashedPWD}
    },
  });
  if (checkUpdate.id) {
    return { ok: true };
  } else {
    return { ok: false, error: "cant update your profile" };
  }
};
// check update id가 있다 === token verification passed

// prodectResolver를 통해서 resolverFnc를 실행
// 토큰이 없으면 return {false & error}
export default {
  Mutation: {
    editProfile: protectResolver(resolverFnc),
  },
};
