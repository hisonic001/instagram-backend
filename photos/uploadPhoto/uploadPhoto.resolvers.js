import client from "../../client";
import { protectResolver } from "../../users/users.util";
import { composeHashtag } from "../photos.util";
import { uploadAWS } from "../../shared/shared.util";

const resolverFnc = async (_, { file, caption }, { loggedInUser }) => {
  //   parse caption and create hashtag
  //  extract hashtag from caption with regex
  let hashtagObj = [];
  const folder = "uploadPhotos";

  if (caption) {
    hashtagObj = composeHashtag(caption);
  }

  const fileURL = await uploadAWS(file, loggedInUser.id, folder);
  return client.photo.create({
    data: {
      file: fileURL,
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
