import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
import db from './db';

const resolvers = {
  Query: {
    users(_, args, ctx) {
      if (!args.query) {
        return ctx.db.users;
      }

      return ctx.db.users.filter(user => {
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
    posts(_, args, ctx) {
      if (!args.query) {
        return ctx.db.posts;
      }

      return ctx.db.posts.filter(
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
    comments(_, _1, ctx) {
      return ctx.db.comments;
    }
  },
  Mutation: {
    createUser(_, args, ctx) {
      const emailTaken = ctx.db.users.some(user => user.email === args.input.email);

      if (emailTaken) {
        throw new Error('Email already in use.');
      }

      const user = {
        id: uuidv4(),
        ...args.input
      };

      ctx.db.users.push(user);

      return user;
    },
    deleteUser(_, args, ctx) {
      const index = ctx.db.users.findIndex(user => user.id === args.id);

      if (index === -1) {
        throw new Error('User with specified ID does not exist.');
      }

      const user = ctx.db.users.splice(index, 1)[0];

      ctx.db.posts = ctx.db.posts.filter(post => {
        const isMatch = post.author === args.id;

        if (isMatch) {
          ctx.db.comments = ctx.db.comments.filter(comment => comment.post !== post.id);
        }

        return !isMatch;
      });

      ctx.db.comments = ctx.db.comments.filter(comment => comment.author !== args.id);

      return user;
    },
    createPost(_, args, ctx) {
      const userExists = ctx.db.users.some(user => user.id === args.input.author);

      if (!userExists) {
        throw new Error('Specified user ID not found.');
      }

      const post = {
        id: uuidv4(),
        ...args.input
      };

      ctx.db.posts.push(post);

      return post;
    },
    deletePost(_, args, ctx) {
      const index = ctx.db.posts.findIndex(post => post.id === args.id);

      if (index === -1) {
        throw new Error('Post with specified ID does not exist.');
      }

      const post = ctx.db.posts.splice(index, 1)[0];
      ctx.db.comments = ctx.db.comments.filter(comment => comment.post !== args.id);

      return post;
    },
    createComment(_, args, ctx) {
      const userExists = ctx.db.users.some(user => user.id === args.input.author);
      const publishedPostExists = ctx.db.posts.some(
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

      ctx.db.comments.push(comment);

      return comment;
    },
    deleteComment(_, args, ctx) {
      const index = ctx.db.comments.findIndex(comment => comment.id === args.id);

      if (index === -1) {
        throw new Error('Comment with specified ID does not exist.');
      }

      return ctx.db.comments.splice(index, 1)[0];
    }
  },
  Post: {
    author(parent, _, ctx) {
      return ctx.db.users.find(user => user.id === parent.author);
    },
    comments(parent, _, ctx) {
      return ctx.db.comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, _, ctx) {
      return ctx.db.posts.filter(post => post.author === parent.id);
    },
    comments(parent, _, ctx) {
      return ctx.db.comments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent, _, ctx) {
      return ctx.db.users.find(user => user.id === parent.author);
    },
    post(parent, _, ctx) {
      return ctx.db.posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db
  }
});

server.start(() => console.log('GraphQL server is up...'));
