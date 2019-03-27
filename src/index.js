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

const posts = [
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

const comments = [
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

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    posts(query: String): [Post!]!
    post: Post!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

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
      const emailTaken = users.some(user => user.email === args.email);

      if (emailTaken) {
        throw new Error('Email already in use.');
      }

      const user = {
        id: uuidv4(),
        ...args
      };

      users.push(user);

      return user;
    },
    createPost(_, args) {
      const userExists = users.some(user => user.id === args.author);

      if (!userExists) {
        throw new Error('Specified user ID not found.');
      }

      const post = {
        id: uuidv4(),
        ...args
      };

      posts.push(post);

      return post;
    },
    createComment(_, args) {
      const userExists = users.some(user => user.id === args.author);
      const publishedPostExists = posts.some(post => post.id === args.post && post.published);

      // this is a useless error, 3 things could be wrong and the client would have to perform 3 bad requests to find that out
      if (!userExists || !publishedPostExists) {
        throw new Error('Specified user ID or published post with specified ID not found.');
      }

      const comment = {
        id: uuidv4(),
        ...args
      };

      comments.push(comment);

      return comment;
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
  typeDefs,
  resolvers
});

server.start(() => console.log('GraphQL server is up...'));
