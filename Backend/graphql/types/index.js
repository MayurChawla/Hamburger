const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLEnumType, GraphQLFloat } = require('graphql');

// Attendance Type
const AttendanceType = new GraphQLObjectType({
  name: 'Attendance',
  fields: () => ({
    date: { type: GraphQLString },
    present: { type: GraphQLBoolean },
  }),
});

// Employee Type
const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
    id: { type: GraphQLString },
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
    attendance: { type: new GraphQLList(AttendanceType) },
  }),
});

// Role Enum
const RoleEnum = new GraphQLEnumType({
  name: 'Role',
  values: {
    ADMIN: { value: 'admin' },
    EMPLOYEE: { value: 'employee' },
  },
});

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: RoleEnum },
    employeeId: { type: GraphQLString },
  }),
});

// Auth Response Type
const AuthResponseType = new GraphQLObjectType({
  name: 'AuthResponse',
  fields: () => ({
    token: { type: GraphQLString },
    user: { type: UserType },
  }),
});

// Sort Order Enum
const SortOrderEnum = new GraphQLEnumType({
  name: 'SortOrder',
  values: {
    ASC: { value: 'ASC' },
    DESC: { value: 'DESC' },
  },
});

// Page Info Type
const PageInfoType = new GraphQLObjectType({
  name: 'PageInfo',
  fields: () => ({
    currentPage: { type: GraphQLInt },
    perPage: { type: GraphQLInt },
    totalPages: { type: GraphQLInt },
    totalCount: { type: GraphQLInt },
    hasNextPage: { type: GraphQLBoolean },
    hasPreviousPage: { type: GraphQLBoolean },
  }),
});

// Employee Connection Type (paginated response)
const EmployeeConnectionType = new GraphQLObjectType({
  name: 'EmployeeConnection',
  fields: () => ({
    nodes: { type: new GraphQLList(EmployeeType) },
    pageInfo: { type: PageInfoType },
    totalCount: { type: GraphQLInt },
  }),
});

module.exports = {
  AttendanceType,
  EmployeeType,
  RoleEnum,
  UserType,
  AuthResponseType,
  SortOrderEnum,
  PageInfoType,
  EmployeeConnectionType,
};

