const { GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { EmployeeType, EmployeeConnectionType } = require('../types');
const { EmployeeFilterInput, SortInput, PaginationInput, CreateEmployeeInput, UpdateEmployeeInput } = require('../inputs');
const EmployeeService = require('../../services/employeeService');
const { errorHandler } = require('../../utils/errors');

const Query = {
  // Get all employees with optional filters, sorting, and pagination
  employees: {
    type: new GraphQLList(EmployeeType),
    args: {
      filter: { type: EmployeeFilterInput },
      pagination: { type: PaginationInput },
      sort: { type: SortInput },
    },
    resolve: async (parent, args, context) => {
      try {
        const result = await EmployeeService.getEmployees(
          args.filter || {},
          args.sort || {},
          args.pagination || {},
          context.user
        );
        return result.employees || result;
      } catch (error) {
        throw error;
      }
    },
  },

  // Get all employees with pagination (returns connection with pageInfo)
  employeesConnection: {
    type: EmployeeConnectionType,
    args: {
      filter: { type: EmployeeFilterInput },
      pagination: { type: PaginationInput },
      sort: { type: SortInput },
    },
    resolve: async (parent, args, context) => {
      try {
        const result = await EmployeeService.getEmployees(
          args.filter || {},
          args.sort || {},
          args.pagination || { page: 1, limit: 10 },
          context.user
        );
        return {
          nodes: result.employees,
          pageInfo: result.pageInfo,
          totalCount: result.totalCount,
        };
      } catch (error) {
        throw error;
      }
    },
  },

  // Get employee by ID
  employee: {
    type: EmployeeType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => {
      try {
        return await EmployeeService.getEmployeeById(args.id, context.user);
      } catch (error) {
        throw error;
      }
    },
  },
};

const Mutation = {
  // Create employee
  createEmployee: {
    type: EmployeeType,
    args: {
      input: { type: new GraphQLNonNull(CreateEmployeeInput) },
    },
    resolve: async (parent, args, context) => {
      try {
        return await EmployeeService.createEmployee(args.input, context.user);
      } catch (error) {
        throw error;
      }
    },
  },

  // Update employee
  updateEmployee: {
    type: EmployeeType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      input: { type: new GraphQLNonNull(UpdateEmployeeInput) },
    },
    resolve: async (parent, args, context) => {
      try {
        return await EmployeeService.updateEmployee(args.id, args.input, context.user);
      } catch (error) {
        throw error;
      }
    },
  },

  // Delete employee
  deleteEmployee: {
    type: EmployeeType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => {
      try {
        return await EmployeeService.deleteEmployee(args.id, context.user);
      } catch (error) {
        throw error;
      }
    },
  },

  // Mark attendance
  markAttendance: {
    type: EmployeeType,
    args: {
      employeeId: { type: new GraphQLNonNull(GraphQLString) },
      date: { type: new GraphQLNonNull(GraphQLString) },
      present: { type: new GraphQLNonNull(GraphQLBoolean) },
    },
    resolve: async (parent, args, context) => {
      try {
        return await EmployeeService.markAttendance(
          args.employeeId,
          args.date,
          args.present,
          context.user
        );
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { Query, Mutation };

