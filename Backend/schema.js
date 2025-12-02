const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');

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

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Get all employees
    employees: {
      type: new GraphQLList(EmployeeType),
      resolve() {
        return employees;
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
    // Get employees by class
    employeesByClass: {
      type: new GraphQLList(EmployeeType),
      args: {
        class: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return employees.filter(employee => employee.class === args.class);
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
    // Create employee
    createEmployee: {
      type: EmployeeType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        class: { type: new GraphQLNonNull(GraphQLString) },
        subjects: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
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
    // Update employee
    updateEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        class: { type: GraphQLString },
        subjects: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        const employee = employees.find(e => e.id === args.id);
        if (!employee) {
          throw new Error('Employee not found');
        }
        if (args.name) employee.name = args.name;
        if (args.age !== undefined) employee.age = args.age;
        if (args.class) employee.class = args.class;
        if (args.subjects) employee.subjects = args.subjects;
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
    // Mark attendance
    markAttendance: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        present: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve(parent, args) {
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

