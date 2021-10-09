import client from "../client";

export default {
  Mutation: {
    // mutation:(root,args,context,info) => "",
    // 4가지의 매개변수를 가질 수 있다.
    // Create => title,year,genre를 가진 type:movie를 만들어 database에 저장
    createMovie: (_, { title, year, genre }) =>
      client.movie.create({
        data: {
          title,
          year,
          genre,
        },
      }),
    // Delete => id를 통해서 database의 movie delete
    deleteMovie: (_, { id }) => client.movie.delete({ where: { id } }),
    // Update => id값으로 특정 data를 업데이트해주기)
    updateMovie: (_, { id, title, year, genre }) =>
      client.movie.update({ where: { id }, data: { title, year, genre } }),
  },
};
