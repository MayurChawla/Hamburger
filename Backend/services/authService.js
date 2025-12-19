const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { queryOne } = require('../database/connection');
const config = require('../config');
const { AuthenticationError, ValidationError } = require('../utils/errors');
const { validateEmail, validateRequired, validateStringLength } = require('../utils/validation');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Generate JWT token
   */
  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        employeeId: user.employee_id,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  /**
   * Login user
   */
  static async login(usernameOrEmail, password) {
    // Validation
    validateRequired(usernameOrEmail, 'Username or email');
    validateRequired(password, 'Password');

    // Hardcoded credentials for development (no encryption needed)
    const hardcodedUsers = {
      'admin': {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        employee_id: null,
      },
      'admin@example.com': {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        employee_id: null,
      },
      'john_doe': {
        id: '2',
        username: 'john_doe',
        email: 'john@example.com',
        role: 'employee',
        employee_id: null, // Will be set from database
      },
      'john@example.com': {
        id: '2',
        username: 'john_doe',
        email: 'john@example.com',
        role: 'employee',
        employee_id: null, // Will be set from database
      },
    };

    // Hardcoded passwords
    const hardcodedPasswords = {
      'admin': 'admin123',
      'admin@example.com': 'admin123',
      'john_doe': 'employee123',
      'john@example.com': 'employee123',
    };

    // Check hardcoded credentials first
    const user = hardcodedUsers[usernameOrEmail];
    const expectedPassword = hardcodedPasswords[usernameOrEmail];

    if (user && password === expectedPassword) {
      // Always try to get the actual user data from database first (like admin does)
      // This ensures employee_id is correct and matches actual database records
      let dbUser = null;
      try {
        dbUser = await User.findByUsernameOrEmail(usernameOrEmail);
        if (dbUser) {
          logger.info(`[AuthService] Found user in database: ${dbUser.username}, employee_id: ${dbUser.employee_id}`);
        }
      } catch (error) {
        logger.warn(`[AuthService] Could not fetch user from database: ${error.message}`);
      }

      // Use database user data if available, otherwise fall back to hardcoded values
      let actualEmployeeId = user.employee_id;
      let userId = user.id;
      let userRole = user.role;
      let userUsername = user.username;
      let userEmail = user.email;

      if (dbUser) {
        // Use database values (this ensures employee_id matches actual database)
        userId = dbUser.id;
        userRole = dbUser.role;
        userUsername = dbUser.username;
        userEmail = dbUser.email;
        actualEmployeeId = dbUser.employee_id;
        logger.info(`[AuthService] Using database user data - employee_id: ${actualEmployeeId}`);
      } else {
        // Fallback to hardcoded values, but for employees, try to get employee_id from database
        if (user.role === 'employee') {
          try {
            // Try to get the employee ID from the users table first (it should be set by seed script)
            const employeeUser = await User.findByUsernameOrEmail(usernameOrEmail);
            if (employeeUser && employeeUser.employee_id) {
              actualEmployeeId = employeeUser.employee_id;
              logger.info(`[AuthService] Using employee user data from database - employee_id: ${actualEmployeeId}`);
            } else {
              // Fallback: Try to get the first employee ID
              const firstEmployee = await queryOne('SELECT id FROM employees LIMIT 1');
              if (firstEmployee) {
                actualEmployeeId = firstEmployee.id;
                logger.info(`[AuthService] Using first employee ID from database: ${actualEmployeeId}`);
              } else {
                logger.warn(`[AuthService] No employees found in database, using hardcoded value: ${actualEmployeeId}`);
              }
            }
          } catch (error) {
            logger.warn(`[AuthService] Could not fetch employee from database: ${error.message}`);
          }
        }
      }

      // Create user object with actual values
      const userForToken = {
        id: userId,
        username: userUsername,
        email: userEmail,
        role: userRole,
        employee_id: actualEmployeeId,
      };

      // Generate token
      const token = this.generateToken(userForToken);

      logger.info(`User logged in: ${userUsername} (${userRole}), employee_id: ${actualEmployeeId}`);

      return {
        token,
        user: {
          id: userId,
          username: userUsername,
          email: userEmail,
          role: userRole,
          employeeId: actualEmployeeId,
        },
      };
    }

    // Fallback to database lookup if hardcoded credentials don't match
    const dbUser = await User.findByUsernameOrEmail(usernameOrEmail);
    if (!dbUser) {
      logger.warn(`Login attempt with invalid username/email: ${usernameOrEmail}`);
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, dbUser.password);
    if (!isValidPassword) {
      logger.warn(`Login attempt with invalid password for user: ${usernameOrEmail}`);
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(dbUser);

    logger.info(`User logged in: ${dbUser.username}`);

    return {
      token,
      user: {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
        employeeId: dbUser.employee_id,
      },
    };
  }

  /**
   * Register new user
   */
  static async register(userData) {
    const { username, email, password, role = 'employee', employeeId = null } = userData;

    // Validation
    validateRequired(username, 'Username');
    validateRequired(email, 'Email');
    validateRequired(password, 'Password');
    validateStringLength(username, 3, 50, 'Username');
    validateStringLength(password, 6, 100, 'Password');
    
    if (!validateEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      employeeId,
    });

    // Generate token
    const token = this.generateToken(user);

    logger.info(`User registered: ${user.username}`);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        employeeId: user.employee_id,
      },
    };
  }

  /**
   * Get current user
   */
  static async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      employeeId: user.employee_id,
    };
  }
}

module.exports = AuthService;

