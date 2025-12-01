const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');

// Sample data (in a real app, this would come from a database)
let users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
];

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Get all users
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return users;
      },
    },
    // Get user by ID
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return users.find(user => user.id === args.id);
      },
    },
    // Hello world query
    hello: {
      type: GraphQLString,
      resolve() {
        return 'Hello from GraphQL API!';
      },
    },
  },
});

// Root Mutation
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Create user
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const newUser = {
          id: String(users.length + 1),
          name: args.name,
          email: args.email,
          age: args.age || null,
        };
        users.push(newUser);
        return newUser;
      },
    },
    // Update user
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const user = users.find(u => u.id === args.id);
        if (!user) {
          throw new Error('User not found');
        }
        if (args.name) user.name = args.name;
        if (args.email) user.email = args.email;
        if (args.age !== undefined) user.age = args.age;
        return user;
      },
    },
    // Delete user
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const userIndex = users.findIndex(u => u.id === args.id);
        if (userIndex === -1) {
          throw new Error('User not found');
        }
        const deletedUser = users[userIndex];
        users.splice(userIndex, 1);
        return deletedUser;
      },
    },
  },
});

// Create and export schema
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = schema;

