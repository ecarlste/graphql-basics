export default {
  author(parent, _, { db }) {
    return db.users.find(user => user.id === parent.author);
  },
  post(parent, _, { db }) {
    return db.posts.find(post => post.id === parent.post);
  }
};
