import client from "../../client";
import { protectResolver } from "../../users/users.util";

const resolverFnc = async (_, { file, caption }, { loggedInUser }) => {
  //   parse caption and create hashtag
  //  extract hashtag from caption with regex
  let hashtagObj = [];
  if (caption) {
    const hashtags = caption.match(/#[\w]+/g); // regex활용 #words만 추출
    // map => connectOrCreate에 활용 가능한 형식으로 hashtags 가공
    hashtagObj = hashtags.map((hashtag) => ({
      where: { hashtag },
      create: { hashtag },
    }));
  }
  return client.photo.create({
    data: {
      file,
      caption,
      user: {
        connect: {
          id: loggedInUser.id,
        },
      },
      ...(hashtagObj.length > 0 && {
        hashtags: {
          connectOrCreate: hashtagObj,
        },
      }),
      // connectOrCreate 활용
      // hashtag exist => connect to hashtag
      // hashtag not exit => create hashtag
    },
  });

  // save the photo /w parsed hashtags
  // add photo to the hashtag
};

export default {
  Mutation: {
    uploadPhoto: protectResolver(resolverFnc),
  },
};
