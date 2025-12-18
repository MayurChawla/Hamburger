const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLList, GraphQLNonNull } = require('graphql');
const { SortOrderEnum } = require('../types');

// Sort Input Type
const SortInput = new GraphQLInputObjectType({
  name: 'SortInput',
  fields: {
    field: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Field to sort by',
    },
    order: {
      type: SortOrderEnum,
      defaultValue: 'ASC',
      description: 'Sort order (ASC or DESC)',
    },
  },
});

// Pagination Input Type
const PaginationInput = new GraphQLInputObjectType({
  name: 'PaginationInput',
  fields: {
    page: {
      type: GraphQLInt,
      defaultValue: 1,
      description: 'Page number (1-indexed)',
    },
    limit: {
      type: GraphQLInt,
      defaultValue: 10,
      description: 'Number of items per page',
    },
    offset: {
      type: GraphQLInt,
      description: 'Number of items to skip (alternative to page)',
    },
  },
});

// Filter Input Type
const EmployeeFilterInput = new GraphQLInputObjectType({
  name: 'EmployeeFilterInput',
  fields: {
    name: { type: GraphQLString, description: 'Filter by name (partial match)' },
    department: { type: GraphQLString, description: 'Filter by department' },
    position: { type: GraphQLString, description: 'Filter by position' },
    status: { type: GraphQLString, description: 'Filter by status' },
    location: { type: GraphQLString, description: 'Filter by location' },
    class: { type: GraphQLString, description: 'Filter by class' },
    minAge: { type: GraphQLInt, description: 'Minimum age' },
    maxAge: { type: GraphQLInt, description: 'Maximum age' },
    minSalary: { type: GraphQLFloat, description: 'Minimum salary' },
    maxSalary: { type: GraphQLFloat, description: 'Maximum salary' },
  },
});

// Create Employee Input
const CreateEmployeeInput = new GraphQLInputObjectType({
  name: 'CreateEmployeeInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    department: { type: new GraphQLNonNull(GraphQLString) },
    position: { type: new GraphQLNonNull(GraphQLString) },
    salary: { type: new GraphQLNonNull(GraphQLFloat) },
    startDate: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLString },
    location: { type: GraphQLString },
    manager: { type: GraphQLString },
    phone: { type: GraphQLString },
    age: { type: GraphQLInt },
    class: { type: GraphQLString },
    subjects: { type: new GraphQLList(GraphQLString) },
  },
});

// Update Employee Input
const UpdateEmployeeInput = new GraphQLInputObjectType({
  name: 'UpdateEmployeeInput',
  fields: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    department: { type: GraphQLString },
    position: { type: GraphQLString },
    salary: { type: GraphQLFloat },
    startDate: { type: GraphQLString },
    status: { type: GraphQLString },
    location: { type: GraphQLString },
    manager: { type: GraphQLString },
    phone: { type: GraphQLString },
    age: { type: GraphQLInt },
    class: { type: GraphQLString },
    subjects: { type: new GraphQLList(GraphQLString) },
  },
});

module.exports = {
  SortInput,
  PaginationInput,
  EmployeeFilterInput,
  CreateEmployeeInput,
  UpdateEmployeeInput,
};

