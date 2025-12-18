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

    // Find user
    const user = await User.findByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      logger.warn(`Login attempt with invalid username/email: ${usernameOrEmail}`);
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      logger.warn(`Login attempt with invalid password for user: ${usernameOrEmail}`);
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    logger.info(`User logged in: ${user.username}`);

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

