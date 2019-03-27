import uuidv4 from 'uuid/v4';

export default {
  createUser(_, args, { db }) {
    const emailTaken = db.users.some(user => user.email === args.input.email);

    if (emailTaken) {
      throw new Error('Email already in use.');
    }

    const user = {
      id: uuidv4(),
      ...args.input
    };

    db.users.push(user);

    return user;
  },
  deleteUser(_, args, { db }) {
    const index = db.users.findIndex(user => user.id === args.id);

    if (index === -1) {
      throw new Error('User with specified ID does not exist.');
    }

    const user = db.users.splice(index, 1)[0];

    db.setPosts(
      db.posts.filter(post => {
        const isMatch = post.author === args.id;

        if (isMatch) {
          db.setComments(db.comments.filter(comment => comment.post !== post.id));
        }

        return !isMatch;
      })
    );

    db.setComments(db.comments.filter(comment => comment.author !== args.id));

    return user;
  },
  createPost(_, args, { db }) {
    const userExists = db.users.some(user => user.id === args.input.author);

    if (!userExists) {
      throw new Error('Specified user ID not found.');
    }

    const post = {
      id: uuidv4(),
      ...args.input
    };

    db.posts.push(post);

    return post;
  },
  deletePost(_, args, { db }) {
    const index = db.posts.findIndex(post => post.id === args.id);

    if (index === -1) {
      throw new Error('Post with specified ID does not exist.');
    }

    const post = db.posts.splice(index, 1)[0];
    db.setComments(db.comments.filter(comment => comment.post !== args.id));

    return post;
  },
  createComment(_, args, { db }) {
    const userExists = db.users.some(user => user.id === args.input.author);
    const publishedPostExists = db.posts.some(
      post => post.id === args.input.post && post.published
    );

    // this is a useless error, 3 things could be wrong and the client would have to perform 3 bad requests to find that out
    if (!userExists || !publishedPostExists) {
      throw new Error('Specified user ID or published post with specified ID not found.');
    }

    const comment = {
      id: uuidv4(),
      ...args.input
    };

    db.comments.push(comment);

    return comment;
  },
  deleteComment(_, args, { db }) {
    const index = db.comments.findIndex(comment => comment.id === args.id);

    if (index === -1) {
      throw new Error('Comment with specified ID does not exist.');
    }

    return db.comments.splice(index, 1)[0];
  }
};