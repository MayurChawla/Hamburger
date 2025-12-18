const jwt = require('jsonwebtoken');
const User = require('../models/User');
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
        employee_id: '1',
      },
      'john@example.com': {
        id: '2',
        username: 'john_doe',
        email: 'john@example.com',
        role: 'employee',
        employee_id: '1',
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
      // Generate token
      const token = this.generateToken(user);

      logger.info(`User logged in (hardcoded): ${user.username}`);

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

