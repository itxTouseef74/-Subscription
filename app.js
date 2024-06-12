const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { typeDefs } = require('./schema/schema.gql');
const resolvers = require('./resolvers/resolver.js');

const app = express();
const uri = 'mongodb://localhost:27017/graphql';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    db: mongoose.connection,
  }),
  introspection: true,
  playground: true,
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(9000, () => {
    console.log(`🚀 Server ready at http://localhost:9000${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error('Error starting server:', error);
});
