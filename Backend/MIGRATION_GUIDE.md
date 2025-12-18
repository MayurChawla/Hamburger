# Migration Guide

This document explains the changes made to transform the backend into a scalable, professional architecture.

## What Changed

### Old Structure
```
Backend/
├── index.js      # Main server file with all logic
├── auth.js        # Authentication logic
└── schema.js      # GraphQL schema with inline resolvers
```

### New Structure
```
Backend/
├── config/           # Configuration management
├── database/         # Database layer with migrations
├── graphql/          # Modular GraphQL schema
│   ├── inputs/       # Input types
│   ├── resolvers/    # Resolvers (separated by domain)
│   └── types/        # GraphQL types
├── middleware/       # Express middleware
├── models/           # Data models
├── services/         # Business logic
├── utils/            # Utilities
└── scripts/          # Utility scripts
```

## Key Improvements

### 1. Separation of Concerns
- **Models**: Data access layer (database operations)
- **Services**: Business logic layer
- **Resolvers**: GraphQL-specific logic
- **Middleware**: Cross-cutting concerns

### 2. Database Layer
- Migrated from in-memory arrays to SQLite database
- Proper schema with migrations
- Parameterized queries (SQL injection protection)
- Relationships properly modeled

### 3. Error Handling
- Custom error classes
- Centralized error handler
- Proper error logging
- User-friendly error messages

### 4. Security
- Helmet.js for security headers
- Rate limiting
- Input validation
- JWT authentication with proper middleware

### 5. Configuration
- Environment-based configuration
- Centralized config management
- .env file support

### 6. Logging
- Winston logger
- File and console logging
- Structured logging
- Log levels

### 7. Code Organization
- Modular GraphQL schema
- Reusable utilities
- Clear file structure
- Easy to extend

## Breaking Changes

### GraphQL API Changes

#### Mutations
- `createEmployee` now uses `input` parameter:
  ```graphql
  # Old
  mutation {
    createEmployee(name: "John", ...) { ... }
  }
  
  # New
  mutation {
    createEmployee(input: { name: "John", ... }) { ... }
  }
  ```

- `updateEmployee` now uses `input` parameter:
  ```graphql
  # Old
  mutation {
    updateEmployee(id: "1", name: "John", ...) { ... }
  }
  
  # New
  mutation {
    updateEmployee(id: "1", input: { name: "John", ... }) { ... }
  }
  ```

### Data Storage
- Data is now persisted in SQLite database instead of in-memory arrays
- Run migrations before starting: `npm run migrate`
- Seed initial data: `npm run seed`

### Authentication
- Authentication logic moved to `services/authService.js`
- User model now uses database instead of in-memory array
- JWT tokens remain compatible

## Migration Steps

1. **Backup existing data** (if any)
2. **Install new dependencies**: `npm install`
3. **Set up environment**: Copy `.env.example` to `.env` and configure
4. **Run migrations**: `npm run migrate`
5. **Seed data**: `npm run seed`
6. **Update frontend** to use new mutation format if needed
7. **Test thoroughly**

## Old Files

The following files are kept for reference but are no longer used:
- `auth.js` - Replaced by `services/authService.js` and `models/User.js`
- `schema.js` - Replaced by modular structure in `graphql/` directory

You can safely delete these files after verifying the new system works correctly.

## Testing

After migration, test:
1. User authentication (login/register)
2. Employee CRUD operations
3. GraphQL queries with filters, sorting, pagination
4. Attendance marking
5. Authorization (admin vs employee access)

## Need Help?

If you encounter issues during migration:
1. Check the logs in `logs/` directory
2. Verify database is created: `./data/database.sqlite`
3. Ensure environment variables are set correctly
4. Review error messages in console

