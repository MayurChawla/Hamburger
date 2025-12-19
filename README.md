# Hamburger - Employee Management System

A full-stack Employee Management System built with React and GraphQL, featuring authentication, employee CRUD operations, attendance tracking, and a modern, responsive UI.

## 🎯 Overview

This project is a comprehensive Employee Management System that allows administrators and employees to manage employee data, track attendance, and perform various operations through a user-friendly web interface. The system uses GraphQL for efficient data fetching and provides role-based access control.

## ✨ Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based authentication with role-based access control (Admin/Employee)
- **Employee Management** - Full CRUD operations for employee records
- **Attendance Tracking** - Mark and track employee attendance
- **Advanced Filtering** - Filter employees by department, position, salary range, and more
- **Sorting & Pagination** - Efficient data handling with sorting and pagination support
- **Responsive Design** - Modern, mobile-friendly UI with theme support
- **Real-time Updates** - Dynamic data updates without page refresh

### Frontend Features
- React 19 with Vite for fast development
- React Router for navigation
- Context API for state management (Auth, Theme)
- Horizontal navigation menu
- Employee grid with filtering capabilities
- Dark/Light theme toggle
- Protected routes

### Backend Features
- GraphQL API with flexible querying
- SQLite database with migrations
- Comprehensive error handling
- Request logging with Winston
- Security middleware (Helmet, Rate Limiting)
- Input validation
- JWT token-based authentication

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool and dev server
- **React Router DOM** 7.10.0 - Client-side routing
- **ESLint** - Code linting

### Backend
- **Node.js** >= 16.0.0 - Runtime environment
- **Express** 5.1.0 - Web framework
- **GraphQL** 16.12.0 - Query language and runtime
- **SQLite3** 5.1.6 - Database
- **JWT** (jsonwebtoken) - Authentication
- **Bcryptjs** - Password hashing
- **Winston** - Logging
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

## 📁 Project Structure

```
Hamburger/
├── Backend/                 # GraphQL API Server
│   ├── config/             # Configuration management
│   ├── database/           # Database connection and migrations
│   │   ├── migrations/     # SQL migration files
│   │   ├── connection.js   # DB connection
│   │   └── migrate.js     # Migration runner
│   ├── graphql/            # GraphQL schema and resolvers
│   │   ├── inputs/         # GraphQL input types
│   │   ├── resolvers/      # Query and mutation resolvers
│   │   └── types/          # GraphQL type definitions
│   ├── middleware/         # Express middleware
│   │   ├── auth.js         # Authentication middleware
│   │   └── rateLimiter.js  # Rate limiting
│   ├── models/             # Data models
│   │   ├── Employee.js     # Employee model
│   │   └── User.js         # User model
│   ├── services/           # Business logic layer
│   │   ├── authService.js  # Authentication service
│   │   └── employeeService.js # Employee service
│   ├── utils/              # Utility functions
│   │   ├── errors.js       # Error handling
│   │   ├── logger.js       # Logging utility
│   │   └── validation.js   # Input validation
│   ├── scripts/            # Utility scripts
│   │   └── seed.js         # Database seeding
│   ├── logs/               # Application logs
│   ├── data/               # Database files
│   ├── index.js            # Application entry point
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
│
└── frontend/               # React Frontend Application
    ├── public/             # Static assets
    ├── src/
    │   ├── components/     # React components
    │   │   ├── EmployeeGrid.jsx
    │   │   ├── EmployeeFilter.jsx
    │   │   ├── HorizontalMenu.jsx
    │   │   ├── Login.jsx
    │   │   └── ThemeToggle.jsx
    │   ├── contexts/       # React contexts
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/          # Page components
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── Services.jsx
    │   │   ├── About.jsx
    │   │   └── Contact.jsx
    │   ├── styles/          # CSS stylesheets
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Application entry point
    ├── package.json        # Frontend dependencies
    └── README.md           # Frontend documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hamburger
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm install
   npm run seed
   npm run dev    # Development mode with nodemon
   # or
   npm start      # Production mode
   ```
   The GraphQL API will be available at `http://localhost:4000/graphql`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to access the application

## 🔐 Default Credentials

After running `npm run seed` in the Backend directory, you can use these default credentials:

### Admin User
- **Username/Email**: `admin` or `admin@example.com`
- **Password**: `admin123`
- **Role**: Admin (full access = view + edit)

### Employee User
- **Username/Email**: `john_doe` or `john@example.com`
- **Password**: `employee123`
- **Role**: Employee (limited access = view only)

## 📡 API Documentation

### GraphQL Endpoint

- **URL**: `http://localhost:4000/graphql`
- **Method**: POST
- **Content-Type**: `application/json`

### Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a2000e7c-367c-4bf7-a512-f40ef8b780d2" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8171cd1e-9430-41a9-8721-8b442087e991" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5f5b4a64-0761-401a-b479-8464fe33f8d2" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/418e0064-9919-4fa2-ad6b-8172912e5d32" />


### Example Queries

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

#### Get Employees with Filters and Pagination
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
      department
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

For more detailed API documentation, see:
- [Backend README.md](Backend/README.md) - Complete API reference
- [Backend TEST_QUERIES.md](Backend/TEST_QUERIES.md) - Example queries and mutations

## 🧪 Testing the API

### Using GraphiQL Online (Recommended)

1. Visit: https://lucasconstantino.github.io/graphiql-online/
2. Enter endpoint: `http://localhost:4000/graphql`
3. Add Authorization header: `Authorization: Bearer <your-token>`
4. Write and execute queries

### Using Postman

1. Create a POST request to `http://localhost:4000/graphql`
2. Add header: `Content-Type: application/json`
3. Add header: `Authorization: Bearer <your-token>` (for protected queries)
4. Send GraphQL query in request body:
   ```json
   {
     "query": "query { employees { id name email } }"
   }
   ```

## 🛠️ Development

### Backend Development

- **Start dev server**: `npm run dev` (with auto-reload)
- **Run Installation**: `npm install`
- **Seed database**: `npm run seed`
- **View logs**: Check `logs/combined.log` and `logs/error.log`

### Frontend Development

- **Start dev server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Lint code**: `npm run lint`

### Adding New Features

#### Backend
1. **New GraphQL Type**: Add to `graphql/types/`
2. **New Resolver**: Add to `graphql/resolvers/` and export in `index.js`
3. **New Model**: Create in `models/` following existing patterns
4. **New Service**: Add business logic in `services/`
5. **New Migration**: Create SQL file in `database/migrations/`

#### Frontend
1. **New Component**: Add to `src/components/`
2. **New Page**: Add to `src/pages/` and update routes in `App.jsx`
3. **New Context**: Add to `src/contexts/` if needed for global state

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for password security
- **Rate Limiting** - Protection against brute force attacks
- **Helmet.js** - Security headers
- **Input Validation** - Comprehensive input validation
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Configurable cross-origin resource sharing

## 📝 Logging

Backend logs are written to:
- **Console** (development mode)
- `Backend/logs/combined.log` (all logs)
- `Backend/logs/error.log` (errors only)

Log levels: `error`, `warn`, `info`, `debug`

## 🗄️ Database

The application uses SQLite by default. The database file is located at `Backend/data/database.sqlite`.

### Schema

- **users** - User accounts with authentication
- **employees** - Employee information
- **subjects** - Subject catalog
- **employee_subjects** - Many-to-many relationship between employees and subjects
- **attendance** - Employee attendance records

## 🚀 Production Deployment

### Backend

1. Set `NODE_ENV=production` in environment
2. Generate a strong `JWT_SECRET`: `openssl rand -base64 32`
3. Configure proper CORS origins
4. Set up process manager (PM2, systemd, etc.)
5. Configure database backups
6. Set up HTTPS
7. Configure proper logging and monitoring

### Frontend

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to a static hosting service
3. Configure environment variables for API endpoint
4. Set up proper routing (SPA configuration)

## 🐛 Troubleshooting

### Backend Issues

**Database errors**
- Ensure the `Backend/data/` directory exists and is writable
- Run migrations: `npm run migrate`

**Authentication errors**
- Verify `JWT_SECRET` is set in `.env`
- Check token expiration
- Ensure password is correctly hashed

**Port already in use**
- Change `PORT` in `.env` file
- Or kill the process using the port

### Frontend Issues

**Cannot connect to backend**
- Verify backend is running on port 4000
- Check CORS configuration in backend
- Verify API endpoint URL in frontend code

**Build errors**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## 📚 Additional Documentation

- [Backend README.md](Backend/README.md) - Detailed backend documentation
- [Backend MIGRATION_GUIDE.md](Backend/MIGRATION_GUIDE.md) - Architecture migration guide
- [Backend TEST_QUERIES.md](Backend/TEST_QUERIES.md) - Example GraphQL queries

## 📄 License

ISC

## 👥 Contributing

1. Follow the existing code structure and patterns
2. Write clear commit messages
3. Add appropriate error handling
4. Update documentation as needed
5. Test your changes thoroughly

## 📞 Support

For issues or questions:
1. Check the documentation in `Backend/README.md` and `Backend/TEST_QUERIES.md`
2. Review logs in `Backend/logs/`
3. Create an issue in the repository

---

**Built with ❤️ using React, GraphQL, and Node.js**

