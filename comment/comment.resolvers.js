export default {
  Comment: {
    isMine: ({ userId }, __, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
  },
};
