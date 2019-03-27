export default {
  author(parent, _, { db }) {
    return db.users.find(user => user.id === parent.author);
  },
  comments(parent, _, { db }) {
    return db.comments.filter(comment => comment.post === parent.id);
  }
};
