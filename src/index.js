import { GraphQLServer } from 'graphql-yoga';
import database from './db';
import Comment from './resolvers/Comment.resolver';
import Mutation from './resolvers/Mutation.resolver';
import Post from './resolvers/Post.resolver';
import Query from './resolvers/Query.resolver';
import User from './resolvers/User.resolver';

const resolvers = {
  Query,
  Mutation,
  Post,
  User,
  Comment
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db: database
  }
});

server.start(() => console.log('GraphQL server is up...'));
