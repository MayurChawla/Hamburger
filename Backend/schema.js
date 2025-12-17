const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean, GraphQLEnumType, GraphQLInputObjectType, GraphQLFloat } = require('graphql');
const auth = require('./auth');

// Sample data matching frontend structure
let employees = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 95000,
    startDate: '2020-01-15',
    status: 'Active',
    location: 'New York',
    manager: 'Jane Smith',
    phone: '+1-555-0101',
    age: 30,
    class: 'A',
    subjects: ['Mathematics', 'Science', 'English'],
    attendance: [
      { date: '2024-01-15', present: true },
      { date: '2024-01-16', present: true },
      { date: '2024-01-17', present: false },
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    department: 'Engineering',
    position: 'Engineering Manager',
    salary: 120000,
    startDate: '2018-03-20',
    status: 'Active',
    location: 'New York',
    manager: 'Robert Johnson',
    phone: '+1-555-0102',
    age: 25,
    class: 'B',
    subjects: ['History', 'Geography', 'English'],
    attendance: [
      { date: '2024-01-15', present: true },
      { date: '2024-01-16', present: true },
      { date: '2024-01-17', present: true },
    ]
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 65000,
    startDate: '2021-06-10',
    status: 'Active',
    location: 'Los Angeles',
    manager: 'Sarah Williams',
    phone: '+1-555-0103',
    age: 35,
    class: 'A',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    attendance: [
      { date: '2024-01-15', present: false },
      { date: '2024-01-16', present: true },
      { date: '2024-01-17', present: true },
    ]
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@company.com',
    department: 'Sales',
    position: 'Sales Manager',
    salary: 85000,
    startDate: '2019-09-05',
    status: 'Active',
    location: 'Los Angeles',
    manager: 'Robert Johnson',
    phone: '+1-555-0104',
    age: 28,
    class: 'C',
    subjects: ['Biology', 'Chemistry'],
    attendance: [
      { date: '2024-01-15', present: true },
      { date: '2024-01-16', present: true },
      { date: '2024-01-17', present: true },
    ]
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@company.com',
    department: 'Marketing',
    position: 'Marketing Specialist',
    salary: 70000,
    startDate: '2022-02-14',
    status: 'Active',
    location: 'Chicago',
    manager: 'Emily Davis',
    phone: '+1-555-0105',
    age: 32,
    class: 'B',
    subjects: ['English', 'Art', 'Music'],
    attendance: [
      { date: '2024-01-15', present: true },
      { date: '2024-01-16', present: false },
      { date: '2024-01-17', present: true },
    ]
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    department: 'Marketing',
    position: 'Marketing Director',
    salary: 110000,
    startDate: '2017-11-30',
    status: 'Active',
    location: 'Chicago',
    manager: 'Robert Johnson',
    phone: '+1-555-0106',
    age: 40,
    class: 'A',
    subjects: ['Mathematics', 'Economics'],
    attendance: [
      { date: '2024-01-15', present: true },
      { date: '2024-01-16', present: true },
      { date: '2024-01-17', present: true },
    ]
  },
  {
    id: '7',
    name: 'Chris Wilson',
    email: 'chris.wilson@company.com',
    department: 'HR',
    position: 'HR Coordinator',
    salary: 60000,
    startDate: '2023-01-08',
    status: 'Active',
    location: 'Boston',
    manager: 'Lisa Anderson',
    phone: '+1-555-0107',
    age: 26,
    class: 'C',
    subjects: ['Psychology', 'Sociology'],
    attendance: [
      { date: '2024-01-15', present: true },
      { date: '2024-01-16', present: true },
      { date: '2024-01-17', present: false },
    ]
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    department: 'HR',
    position: 'HR Manager',
    salary: 90000,
    startDate: '2016-05-22',
    status: 'Active',
    location: 'Boston',
    manager: 'Robert Johnson',
    phone: '+1-555-0108',
    age: 38,
    class: 'B',
    subjects: ['Management', 'Communication'],
    attendance: [
      { date: '2024-01-15', present: true },
      { date: '2024-01-16', present: true },
      { date: '2024-01-17', present: true },
    ]
  },
  {
    id: '9',
    name: 'Robert Johnson',
    email: 'robert.johnson@company.com',
    department: 'Executive',
    position: 'CEO',
    salary: 200000,
    startDate: '2015-01-10',
    status: 'Active',
    location: 'New York',
    manager: 'Board of Directors',
    phone: '+1-555-0109',
    age: 50,
    class: 'A',
    subjects: ['Leadership', 'Strategy'],
    attendance: [
      { date: '2024-01-15', present: true },
      { date: '2024-01-16', present: true },
      { date: '2024-01-17', present: true },
    ]
  },
  {
    id: '10',
    name: 'Amanda Taylor',
    email: 'amanda.taylor@company.com',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 75000,
    startDate: '2021-08-17',
    status: 'Active',
    location: 'Seattle',
    manager: 'Michael Chen',
    phone: '+1-555-0110',
    age: 29,
    class: 'B',
    subjects: ['Accounting', 'Finance'],
    attendance: [
      { date: '2024-01-15', present: true },
      { date: '2024-01-16', present: false },
      { date: '2024-01-17', present: true },
    ]
  },
  {
    id: '11',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    department: 'Finance',
    position: 'Finance Director',
    salary: 105000,
    startDate: '2018-07-12',
    status: 'Active',
    location: 'Seattle',
    manager: 'Robert Johnson',
    phone: '+1-555-0111',
    age: 42,
    class: 'A',
    subjects: ['Finance', 'Economics', 'Statistics'],
    attendance: [
      { date: '2024-01-15', present: true },
      { date: '2024-01-16', present: true },
      { date: '2024-01-17', present: true },
    ]
  },
  {
    id: '12',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@company.com',
    department: 'Engineering',
    position: 'Junior Developer',
    salary: 70000,
    startDate: '2023-03-01',
    status: 'Active',
    location: 'Austin',
    manager: 'Jane Smith',
    phone: '+1-555-0112',
    age: 24,
    class: 'C',
    subjects: ['Computer Science', 'Mathematics'],
    attendance: [
      { date: '2024-01-15', present: true },
      { date: '2024-01-16', present: true },
      { date: '2024-01-17', present: false },
    ]
  }
];

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

// Sort Input Type
const SortInput = new GraphQLInputObjectType({
  name: 'SortInput',
  fields: {
    field: { 
      type: new GraphQLNonNull(GraphQLString),
      description: 'Field to sort by'
    },
    order: { 
      type: SortOrderEnum,
      defaultValue: 'ASC',
      description: 'Sort order (ASC or DESC)'
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
      description: 'Page number (1-indexed)'
    },
    limit: { 
      type: GraphQLInt,
      defaultValue: 10,
      description: 'Number of items per page'
    },
    offset: { 
      type: GraphQLInt,
      description: 'Number of items to skip (alternative to page)'
    },
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

// Helper function to apply sorting
function applySorting(data, sort) {
  if (!sort || !sort.field) {
    return data;
  }

  const field = sort.field;
  const order = sort.order || 'ASC';

  return [...data].sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];

    if (typeof aVal === 'number') {
      aVal = aVal || 0;
      bVal = bVal || 0;
    } else {
      aVal = (aVal || '').toString().toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }

    if (aVal < bVal) return order === 'ASC' ? -1 : 1;
    if (aVal > bVal) return order === 'ASC' ? 1 : -1;
    return 0;
  });
}

// Helper function to apply pagination
function applyPagination(data, pagination) {
  if (!pagination) {
    return { data, totalCount: data.length };
  }

  const totalCount = data.length;
  let offset = 0;
  let limit = pagination.limit || 10;

  if (pagination.offset !== undefined && pagination.offset !== null) {
    offset = pagination.offset;
  } else if (pagination.page !== undefined && pagination.page !== null) {
    const page = Math.max(1, pagination.page);
    offset = (page - 1) * limit;
  }

  const paginatedData = data.slice(offset, offset + limit);
  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = pagination.page || Math.floor(offset / limit) + 1;

  return {
    data: paginatedData,
    totalCount,
    pageInfo: {
      currentPage,
      perPage: limit,
      totalPages,
      totalCount,
      hasNextPage: offset + limit < totalCount,
      hasPreviousPage: offset > 0,
    },
  };
}

// Helper function to get user from context
function getUserFromContext(context) {
  return context.user || null;
}

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Get all employees (public - no auth required for demo)
    employees: {
      type: new GraphQLList(EmployeeType),
      args: {
        pagination: { type: PaginationInput },
        sort: { type: SortInput },
      },
      resolve(parent, args) {
        let result = [...employees];
        
        if (args.sort) {
          result = applySorting(result, args.sort);
        }
        
        if (args.pagination) {
          const paginated = applyPagination(result, args.pagination);
          return paginated.data;
        }
        
        return result;
      },
    },
    // Get all employees (paginated connection)
    employeesConnection: {
      type: EmployeeConnectionType,
      args: {
        pagination: { type: PaginationInput },
        sort: { type: SortInput },
      },
      resolve(parent, args) {
        let result = [...employees];
        
        if (args.sort) {
          result = applySorting(result, args.sort);
        }
        
        const pagination = args.pagination || { page: 1, limit: 10 };
        const paginated = applyPagination(result, pagination);
        
        return {
          nodes: paginated.data,
          pageInfo: paginated.pageInfo,
          totalCount: paginated.totalCount,
        };
      },
    },
    // Get employee by ID
    employee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return employees.find(employee => employee.id === args.id);
      },
    },
    // Hello world query
    hello: {
      type: GraphQLString,
      resolve() {
        return 'Hello from GraphQL API!';
      },
    },
    // Get current user
    me: {
      type: UserType,
      resolve(parent, args, context) {
        return getUserFromContext(context);
      },
    },
  },
});

// Root Mutation
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Login mutation
    login: {
      type: AuthResponseType,
      args: {
        usernameOrEmail: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const user = auth.getUserByUsernameOrEmail(args.usernameOrEmail);
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isValidPassword = await auth.comparePassword(args.password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid credentials');
        }

        const token = auth.generateToken(user);
        return {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
          },
        };
      },
    },
    // Create employee
    createEmployee: {
      type: EmployeeType,
      args: {
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
      },
      resolve(parent, args) {
        const newEmployee = {
          id: String(employees.length + 1),
          name: args.name,
          email: args.email,
          department: args.department,
          position: args.position,
          salary: args.salary,
          startDate: args.startDate,
          status: args.status || 'Active',
          location: args.location || '',
          manager: args.manager || '',
          phone: args.phone || '',
        };
        employees.push(newEmployee);
        return newEmployee;
      },
    },
    // Update employee
    updateEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
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
      },
      resolve(parent, args) {
        const employee = employees.find(e => e.id === args.id);
        if (!employee) {
          throw new Error('Employee not found');
        }
        
        if (args.name) employee.name = args.name;
        if (args.email) employee.email = args.email;
        if (args.department) employee.department = args.department;
        if (args.position) employee.position = args.position;
        if (args.salary !== undefined) employee.salary = args.salary;
        if (args.startDate) employee.startDate = args.startDate;
        if (args.status) employee.status = args.status;
        if (args.location) employee.location = args.location;
        if (args.manager) employee.manager = args.manager;
        if (args.phone) employee.phone = args.phone;
        
        return employee;
      },
    },
    // Delete employee
    deleteEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const employeeIndex = employees.findIndex(e => e.id === args.id);
        if (employeeIndex === -1) {
          throw new Error('Employee not found');
        }
        const deletedEmployee = employees[employeeIndex];
        employees.splice(employeeIndex, 1);
        return deletedEmployee;
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
