const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean, GraphQLEnumType, GraphQLInputObjectType } = require('graphql');
const auth = require('./auth');

// Sample data (in a real app, this would come from a database)
let employees = [
  { 
    id: '1', 
    name: 'John Doe', 
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
    name: 'Bob Johnson', 
    age: 35, 
    class: 'A', 
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    attendance: [
      { date: '2024-01-15', present: false },
      { date: '2024-01-16', present: true },
      { date: '2024-01-17', present: true },
    ]
  },
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
      description: 'Field to sort by (id, name, age, class)'
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

// Employee Edge Type (for connection pattern)
const EmployeeEdgeType = new GraphQLObjectType({
  name: 'EmployeeEdge',
  fields: () => ({
    node: { type: EmployeeType },
    cursor: { type: GraphQLString },
  }),
});

// Employee Connection Type (paginated response)
const EmployeeConnectionType = new GraphQLObjectType({
  name: 'EmployeeConnection',
  fields: () => ({
    edges: { type: new GraphQLList(EmployeeEdgeType) },
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

    // Handle different field types
    if (field === 'age') {
      aVal = aVal || 0;
      bVal = bVal || 0;
    } else if (field === 'name' || field === 'class' || field === 'id') {
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

// Authorization helpers
function requireAuth(context) {
  const user = getUserFromContext(context);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

function requireRole(context, role) {
  const user = requireAuth(context);
  if (user.role !== role) {
    throw new Error(`Access denied. ${role} role required.`);
  }
  return user;
}

function requireAdmin(context) {
  return requireRole(context, 'admin');
}

function requireEmployee(context) {
  return requireRole(context, 'employee');
}

function canAccessEmployeeData(context, employeeId) {
  const user = requireAuth(context);
  if (!auth.canAccessEmployee(user, employeeId)) {
    throw new Error('Access denied. You can only access your own data.');
  }
  return user;
}

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Get all employees (with pagination and sorting support) - Admin only
    employees: {
      type: new GraphQLList(EmployeeType),
      args: {
        pagination: { type: PaginationInput },
        sort: { type: SortInput },
      },
      resolve(parent, args, context) {
        requireAdmin(context);
        let result = [...employees];
        
        // Apply sorting
        if (args.sort) {
          result = applySorting(result, args.sort);
        }
        
        // Apply pagination
        if (args.pagination) {
          const paginated = applyPagination(result, args.pagination);
          return paginated.data;
        }
        
        return result;
      },
    },
    // Get all employees (paginated connection) - Admin only
    employeesConnection: {
      type: EmployeeConnectionType,
      args: {
        pagination: { type: PaginationInput },
        sort: { type: SortInput },
      },
      resolve(parent, args, context) {
        requireAdmin(context);
        let result = [...employees];
        
        // Apply sorting
        if (args.sort) {
          result = applySorting(result, args.sort);
        }
        
        // Apply pagination
        const pagination = args.pagination || { page: 1, limit: 10 };
        const paginated = applyPagination(result, pagination);
        
        return {
          edges: paginated.data.map((node, index) => ({
            node,
            cursor: String((pagination.page ? (pagination.page - 1) * (pagination.limit || 10) : pagination.offset || 0) + index + 1),
          })),
          nodes: paginated.data,
          pageInfo: paginated.pageInfo,
          totalCount: paginated.totalCount,
        };
      },
    },
    // Get employee by ID - Admin can access all, Employee can only access their own
    employee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args, context) {
        const user = requireAuth(context);
        canAccessEmployeeData(context, args.id);
        return employees.find(employee => employee.id === args.id);
      },
    },
    // Get employees by class (with pagination and sorting support) - Admin only
    employeesByClass: {
      type: new GraphQLList(EmployeeType),
      args: {
        class: { type: new GraphQLNonNull(GraphQLString) },
        pagination: { type: PaginationInput },
        sort: { type: SortInput },
      },
      resolve(parent, args, context) {
        requireAdmin(context);
        let result = employees.filter(employee => employee.class === args.class);
        
        // Apply sorting
        if (args.sort) {
          result = applySorting(result, args.sort);
        }
        
        // Apply pagination
        if (args.pagination) {
          const paginated = applyPagination(result, args.pagination);
          return paginated.data;
        }
        
        return result;
      },
    },
    // Get employees by class (paginated connection) - Admin only
    employeesByClassConnection: {
      type: EmployeeConnectionType,
      args: {
        class: { type: new GraphQLNonNull(GraphQLString) },
        pagination: { type: PaginationInput },
        sort: { type: SortInput },
      },
      resolve(parent, args, context) {
        requireAdmin(context);
        let result = employees.filter(employee => employee.class === args.class);
        
        // Apply sorting
        if (args.sort) {
          result = applySorting(result, args.sort);
        }
        
        // Apply pagination
        const pagination = args.pagination || { page: 1, limit: 10 };
        const paginated = applyPagination(result, pagination);
        
        return {
          edges: paginated.data.map((node, index) => ({
            node,
            cursor: String((pagination.page ? (pagination.page - 1) * (pagination.limit || 10) : pagination.offset || 0) + index + 1),
          })),
          nodes: paginated.data,
          pageInfo: paginated.pageInfo,
          totalCount: paginated.totalCount,
        };
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
    // Register mutation
    register: {
      type: AuthResponseType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: RoleEnum },
        employeeId: { type: GraphQLString },
      },
      async resolve(parent, args) {
        // Check if user already exists
        const existingUser = auth.getUserByUsernameOrEmail(args.username) || 
                            auth.getUserByUsernameOrEmail(args.email);
        if (existingUser) {
          throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await auth.hashPassword(args.password);

        // Create user (only admin can create admin users, default is employee)
        const role = args.role || 'employee';
        const newUser = auth.createUser({
          username: args.username,
          email: args.email,
          password: hashedPassword,
          role: role,
          employeeId: args.employeeId || null,
        });

        const token = auth.generateToken(newUser);
        return {
          token,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            employeeId: newUser.employeeId,
          },
        };
      },
    },
    // Create employee - Admin only
    createEmployee: {
      type: EmployeeType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        class: { type: new GraphQLNonNull(GraphQLString) },
        subjects: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args, context) {
        requireAdmin(context);
        const newEmployee = {
          id: String(employees.length + 1),
          name: args.name,
          age: args.age,
          class: args.class,
          subjects: args.subjects || [],
          attendance: [],
        };
        employees.push(newEmployee);
        return newEmployee;
      },
    },
    // Update employee - Admin can update all, Employee can only update their own
    updateEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        class: { type: GraphQLString },
        subjects: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args, context) {
        const user = requireAuth(context);
        canAccessEmployeeData(context, args.id);
        
        const employee = employees.find(e => e.id === args.id);
        if (!employee) {
          throw new Error('Employee not found');
        }
        
        // Employees can only update certain fields (not class)
        if (user.role === 'employee' && args.class) {
          throw new Error('Employees cannot update class');
        }
        
        if (args.name) employee.name = args.name;
        if (args.age !== undefined) employee.age = args.age;
        if (args.class && user.role === 'admin') employee.class = args.class;
        if (args.subjects) employee.subjects = args.subjects;
        return employee;
      },
    },
    // Delete employee - Admin only
    deleteEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args, context) {
        requireAdmin(context);
        const employeeIndex = employees.findIndex(e => e.id === args.id);
        if (employeeIndex === -1) {
          throw new Error('Employee not found');
        }
        const deletedEmployee = employees[employeeIndex];
        employees.splice(employeeIndex, 1);
        return deletedEmployee;
      },
    },
    // Mark attendance - Admin can mark for any employee, Employee can only mark their own
    markAttendance: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        present: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve(parent, args, context) {
        const user = requireAuth(context);
        canAccessEmployeeData(context, args.id);
        
        const employee = employees.find(e => e.id === args.id);
        if (!employee) {
          throw new Error('Employee not found');
        }
        // Check if attendance for this date already exists
        const existingAttendance = employee.attendance.find(a => a.date === args.date);
        if (existingAttendance) {
          existingAttendance.present = args.present;
        } else {
          employee.attendance.push({
            date: args.date,
            present: args.present,
          });
        }
        return employee;
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

