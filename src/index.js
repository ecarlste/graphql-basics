import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

const resolvers = {
  Query: {
    hello() {
      return 'this is my first query';
    },
    name() {
      return 'Erik';
    },
    location() {
      return 'Boulder, CO';
    },
    bio() {
      return 'Definitely one bad maammaa jamma!?';
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log('GraphQL server is up...'));
