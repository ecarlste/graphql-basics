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

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
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
    post() {
      return {
        id: 'xyz',
        title: 'first post',
        body: 'best post NA... duh...',
        published: false
      };
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log('GraphQL server is up...'));
