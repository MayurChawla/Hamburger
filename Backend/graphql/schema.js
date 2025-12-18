const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const resolvers = require('./resolvers');

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: resolvers.Query,
});

// Root Mutation
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: resolvers.Mutation,
});

// Create and export schema
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = schema;

