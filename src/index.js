import { GraphQLServer } from 'graphql-yoga';

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
    text: 'wonderful idea'
  },
  {
    id: '2',
    text: 'thanks for the info!'
  },
  {
    id: '3',
    text: 'you are definitely ready, go for it!!!'
  },
  {
    id: '4',
    text: 'What is love?'
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

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }

  type Comment {
    id: ID!
    text: String!
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
  Post: {
    author(parent) {
      return users.find(user => user.id === parent.author);
    }
  },
  User: {
    posts(parent) {
      return posts.filter(post => post.author === parent.id);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log('GraphQL server is up...'));
