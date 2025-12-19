const { GraphQLString, GraphQLNonNull } = require('graphql');
const { UserType, AuthResponseType } = require('../types');
const AuthService = require('../../services/authService');

const Query = {
  // Hello world query
  hello: {
    type: GraphQLString,
    resolve: () => {
      return 'Hello from GraphQL API!';
    },
  },

  // Get current user
  me: {
    type: UserType,
    resolve: async (parent, args, context) => {
      if (!context.user) {
        console.log('[me query] No user in context');
        return null;
      }
      try {
        console.log('[me query] Looking up user:', context.user.id);
        const user = await AuthService.getCurrentUser(context.user.id);
        console.log('[me query] User found:', user ? user.username : 'null');
        return user;
      } catch (error) {
        console.error('[me query] Error getting user:', error.message);
        return null;
      }
    },
  },
};

const Mutation = {
  // Login mutation
  login: {
    type: AuthResponseType,
    args: {
      usernameOrEmail: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args) => {
      return await AuthService.login(args.usernameOrEmail, args.password);
    },
  },

  // Register mutation
  register: {
    type: AuthResponseType,
    args: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      role: { type: GraphQLString },
      employeeId: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      return await AuthService.register({
        username: args.username,
        email: args.email,
        password: args.password,
        role: args.role,
        employeeId: args.employeeId,
      });
    },
  },
};

module.exports = { Query, Mutation };

