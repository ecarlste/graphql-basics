import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import Comment from './resolvers/Comment.resolver';
import Mutation from './resolvers/Mutation.resolver';
import Post from './resolvers/Post.resolver';
import Query from './resolvers/Query.resolver';
import Subscription from './resolvers/Subscription.resolver';
import User from './resolvers/User.resolver';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Post,
    User,
    Comment
  },
  context: {
    db,
    pubsub
  }
});

server.start(() => console.log('GraphQL server is up...'));
