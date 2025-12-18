# Hamburger Backend API

A scalable, production-ready GraphQL API backend for Employee Management System built with Node.js, Express, and GraphQL.

## 🏗️ Architecture

This backend follows professional software engineering practices with a clean, modular architecture:

```
Backend/
├── config/           # Configuration management
├── database/         # Database connection and migrations
├── graphql/          # GraphQL schema, types, resolvers
│   ├── inputs/       # GraphQL input types
│   ├── resolvers/    # GraphQL resolvers
│   └── types/        # GraphQL types
├── middleware/       # Express middleware
├── models/           # Data models (User, Employee)
├── services/         # Business logic layer
├── utils/            # Utility functions (logger, errors, validation)
├── scripts/          # Utility scripts (seeding, etc.)
└── index.js          # Application entry point
```

## ✨ Features

- **GraphQL API** - Flexible query language for efficient data fetching
- **SQLite Database** - Lightweight, file-based database with proper schema
- **Authentication & Authorization** - JWT-based auth with role-based access control
- **Error Handling** - Centralized error handling with proper error types
- **Logging** - Winston-based logging with file and console outputs
- **Security** - Helmet.js for security headers, rate limiting
- **Validation** - Input validation utilities
- **Database Migrations** - Automated schema migrations
- **Environment Configuration** - Environment-based configuration management

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

1. Clone the repository and navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
DB_TYPE=sqlite
DB_PATH=./data/database.sqlite
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

5. Run database migrations:
```bash
npm run migrate
```

6. Seed initial data (optional):
```bash
npm run seed
```

Or run both migrations and seeding:
```bash
npm run setup
```

7. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:4000`

## 📚 API Documentation

### GraphQL Endpoint

- **URL**: `http://localhost:4000/graphql`
- **Method**: POST
- **Content-Type**: `application/json`

### Available Queries

#### Get All Employees
```graphql
query {
  employees {
    id
    name
    email
    department
    position
    salary
    age
    class
    subjects
    attendance {
      date
      present
    }
  }
}
```

#### Get Employee by ID
```graphql
query {
  employee(id: "1") {
    id
    name
    email
    department
    position
  }
}
```

#### Get Employees with Filters, Sorting, and Pagination
```graphql
query {
  employeesConnection(
    filter: {
      department: "Engineering"
      minSalary: 80000
    }
    sort: {
      field: "salary"
      order: DESC
    }
    pagination: {
      page: 1
      limit: 10
    }
  ) {
    nodes {
      id
      name
      salary
    }
    pageInfo {
      currentPage
      totalPages
      totalCount
      hasNextPage
    }
  }
}
```

#### Get Current User
```graphql
query {
  me {
    id
    username
    email
    role
  }
}
```

### Available Mutations

#### Login
```graphql
mutation {
  login(
    usernameOrEmail: "admin"
    password: "admin123"
  ) {
    token
    user {
      id
      username
      email
      role
    }
  }
}
```

#### Register
```graphql
mutation {
  register(
    username: "newuser"
    email: "newuser@example.com"
    password: "password123"
    role: "employee"
  ) {
    token
    user {
      id
      username
      email
    }
  }
}
```

#### Create Employee
```graphql
mutation {
  createEmployee(
    input: {
      name: "John Doe"
      email: "john@example.com"
      department: "Engineering"
      position: "Developer"
      salary: 80000
      startDate: "2024-01-20"
      age: 30
      class: "A"
      subjects: ["Math", "Science"]
    }
  ) {
    id
    name
    email
  }
}
```

#### Update Employee
```graphql
mutation {
  updateEmployee(
    id: "1"
    input: {
      name: "John Updated"
      salary: 90000
    }
  ) {
    id
    name
    salary
  }
}
```

#### Delete Employee
```graphql
mutation {
  deleteEmployee(id: "1") {
    id
    name
  }
}
```

#### Mark Attendance
```graphql
mutation {
  markAttendance(
    employeeId: "1"
    date: "2024-01-20"
    present: true
  ) {
    id
    name
    attendance {
      date
      present
    }
  }
}
```

### Authentication

To authenticate requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🔐 Default Users

After running `npm run seed`, you can use these default credentials:

- **Admin User**:
  - Username/Email: `admin` or `admin@example.com`
  - Password: `admin123`

- **Employee User**:
  - Username/Email: `john_doe` or `john@example.com`
  - Password: `employee123`

## 🛠️ Development

### Project Structure

- **config/**: Centralized configuration management
- **database/**: Database connection, migrations, and queries
- **graphql/**: GraphQL schema definition
  - **types/**: GraphQL type definitions
  - **inputs/**: GraphQL input types
  - **resolvers/**: GraphQL resolvers (query and mutation handlers)
- **middleware/**: Express middleware (auth, rate limiting)
- **models/**: Data models with database operations
- **services/**: Business logic layer
- **utils/**: Utility functions (logger, error handling, validation)

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed initial data
- `npm run setup` - Run migrations and seed data

### Adding New Features

1. **Add a new GraphQL type**: Create in `graphql/types/`
2. **Add a new resolver**: Create in `graphql/resolvers/` and export in `graphql/resolvers/index.js`
3. **Add a new model**: Create in `models/` following the existing pattern
4. **Add a new service**: Create in `services/` for business logic
5. **Add a new migration**: Create SQL file in `database/migrations/`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password hashing
- **Rate Limiting**: Protection against brute force attacks
- **Helmet.js**: Security headers
- **Input Validation**: Comprehensive input validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Configurable CORS settings

## 📝 Logging

Logs are written to:
- Console (development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

Log levels: `error`, `warn`, `info`, `debug`

## 🗄️ Database

The application uses SQLite by default. The database file is created at `./data/database.sqlite`.

### Schema

- **users**: User accounts with authentication
- **employees**: Employee information
- **subjects**: Subject catalog
- **employee_subjects**: Many-to-many relationship between employees and subjects
- **attendance**: Employee attendance records

## 🧪 Testing

To test the API:

1. Use the built-in GraphQL interface at `http://localhost:4000/graphql`
2. Use GraphiQL Online: https://lucasconstantino.github.io/graphiql-online/
3. Use Postman or any HTTP client
4. See `TEST_QUERIES.md` for example queries

## 📦 Dependencies

### Production Dependencies

- **express**: Web framework
- **graphql**: GraphQL implementation
- **graphql-http**: GraphQL HTTP server
- **sqlite3**: SQLite database driver
- **jsonwebtoken**: JWT token generation/verification
- **bcryptjs**: Password hashing
- **winston**: Logging
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **cors**: CORS middleware
- **dotenv**: Environment variable management

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong `JWT_SECRET` (generate with: `openssl rand -base64 32`)
3. Configure proper CORS origins
4. Set up proper logging and monitoring
5. Use a process manager like PM2
6. Set up database backups
7. Configure HTTPS

## 📄 License

ISC

## 👥 Contributing

1. Follow the existing code structure
2. Write clear commit messages
3. Add appropriate error handling
4. Update documentation as needed

## 🐛 Troubleshooting

### Database errors
- Ensure the `data/` directory exists and is writable
- Run migrations: `npm run migrate`

### Authentication errors
- Verify JWT_SECRET is set in `.env`
- Check token expiration
- Ensure password is correctly hashed

### Port already in use
- Change PORT in `.env` file
- Or kill the process using the port

## 📞 Support

For issues or questions, please check the documentation or create an issue in the repository.

