// hashtag를 caption으로 부터 만들어주는 함수
export const composeHashtag = (caption) => {
  const hashtags = caption.match(/#[\w]+/g) || [];
  // if 추출한 값이 null 이면 [] empty array return => null 값 return 방지
  // regex활용 #words만 추출
  // map => connectOrCreate에 활용 가능한 형식으로 hashtags 가공
  return hashtags.map((hashtag) => ({
    where: { hashtag },
    create: { hashtag },
  }));
};
