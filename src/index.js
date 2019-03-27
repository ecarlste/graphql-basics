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
