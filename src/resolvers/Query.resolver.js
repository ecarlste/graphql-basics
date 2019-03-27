export default {
  users(_, args, { db }) {
    if (!args.query) {
      return db.users;
    }

    return db.users.filter(user => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  me() {
    return {
      id: '123',
      name: 'Erik',
      email: 'ecarlste@gmail.com',
      age: null
    };
  },
  posts(_, args, { db }) {
    if (!args.query) {
      return db.posts;
    }

    return db.posts.filter(
      post =>
        post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase())
    );
  },
  post() {
    return {
      id: 'xyz',
      title: 'first post',
      body: 'best post NA... duh...',
      published: false
    };
  },
  comments(_, _1, { db }) {
    return db.comments;
  }
};
