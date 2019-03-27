import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

const users = [
  {
    id: '1',
    name: 'Erik',
    email: 'erik@test.com',
    age: 39
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@test.com'
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@test.com'
  }
];

let posts = [
  {
    id: '1',
    title: 'foo',
    body: 'subtle art of foo',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'bar',
    body: 'closely related to foo',
    published: false,
    author: '1'
  },
  {
    id: '3',
    title: 'baz',
    body: 'quite similar to bar almost...',
    published: true,
    author: '2'
  }
];

let comments = [
  {
    id: '1',
    text: 'wonderful idea',
    author: '3',
    post: '1'
  },
  {
    id: '2',
    text: 'thanks for the info!',
    author: '2',
    post: '1'
  },
  {
    id: '3',
    text: 'you are definitely ready, go for it!!!',
    author: '1',
    post: '3'
  },
  {
    id: '4',
    text: 'What is love?',
    author: '3',
    post: '2'
  }
];

const resolvers = {
  Query: {
    users(_, args) {
      if (!args.query) {
        return users;
      }

      return users.filter(user => {
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
    posts(_, args) {
      if (!args.query) {
        return posts;
      }

      return posts.filter(
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
    comments() {
      return comments;
    }
  },
  Mutation: {
    createUser(_, args) {
      const emailTaken = users.some(user => user.email === args.input.email);

      if (emailTaken) {
        throw new Error('Email already in use.');
      }

      const user = {
        id: uuidv4(),
        ...args.input
      };

      users.push(user);

      return user;
    },
    deleteUser(_, args) {
      const index = users.findIndex(user => user.id === args.id);

      if (index === -1) {
        throw new Error('User with specified ID does not exist.');
      }

      const user = users.splice(index, 1)[0];

      posts = posts.filter(post => {
        const isMatch = post.author === args.id;

        if (isMatch) {
          comments = comments.filter(comment => comment.post !== post.id);
        }

        return !isMatch;
      });

      comments = comments.filter(comment => comment.author !== args.id);

      return user;
    },
    createPost(_, args) {
      const userExists = users.some(user => user.id === args.input.author);

      if (!userExists) {
        throw new Error('Specified user ID not found.');
      }

      const post = {
        id: uuidv4(),
        ...args.input
      };

      posts.push(post);

      return post;
    },
    deletePost(_, args) {
      const index = posts.findIndex(post => post.id === args.id);

      if (index === -1) {
        throw new Error('Post with specified ID does not exist.');
      }

      const post = posts.splice(index, 1)[0];
      comments = comments.filter(comment => comment.post !== args.id);

      return post;
    },
    createComment(_, args) {
      const userExists = users.some(user => user.id === args.input.author);
      const publishedPostExists = posts.some(post => post.id === args.input.post && post.published);

      // this is a useless error, 3 things could be wrong and the client would have to perform 3 bad requests to find that out
      if (!userExists || !publishedPostExists) {
        throw new Error('Specified user ID or published post with specified ID not found.');
      }

      const comment = {
        id: uuidv4(),
        ...args.input
      };

      comments.push(comment);

      return comment;
    },
    deleteComment(_, args) {
      const index = comments.findIndex(comment => comment.id === args.id);

      if (index === -1) {
        throw new Error('Comment with specified ID does not exist.');
      }

      return comments.splice(index, 1)[0];
    }
  },
  Post: {
    author(parent) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent) {
      return comments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent) {
      return users.find(user => user.id === parent.author);
    },
    post(parent) {
      return posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start(() => console.log('GraphQL server is up...'));
