import AWS from "aws-sdk";

// AWS SDK(Software Development Kit)
// npm을 통해 설치 후
// config 설정으로 env 파일에서 accesskey와 secretkey 가져오기
// AWS storage S3를 사용하여 photo 파일 업로드
AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const uploadAWS = async (file, userId, folder) => {
  const { fileName, createReadStream } = await file;
  const readStream = createReadStream();
  const newFileName = `${folder}/${userId}-${Date.now}-${fileName}`;
  //file 이름 앞에 경로를 적어주면 폴더까지 생성해줌
  // AWS에서 return한 정보중 Location에 URL 정보
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "insta-clone-upload-bucket", // bucket 이름
      Key: newFileName, // upload file name
      ACL: "public-read", // object privacy
      Body: readStream, // stream 입력
    })
    .promise();
  return Location;
};
