const employeeResolvers = require('./employee');
const authResolvers = require('./auth');

module.exports = {
  Query: {
    ...employeeResolvers.Query,
    ...authResolvers.Query,
  },
  Mutation: {
    ...employeeResolvers.Mutation,
    ...authResolvers.Mutation,
  },
};

