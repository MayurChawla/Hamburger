const jwt = require('jsonwebtoken');
const config = require('../config');
const { AuthenticationError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Extract token from Authorization header
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    logger.debug('Token verification failed:', error.message);
    return null;
  }
};

/**
 * Authentication middleware
 * Adds user to request context if valid token is provided
 */
const authenticate = (req, res, next) => {
  const token = extractToken(req);
  
  if (!token) {
    // For GraphQL, we allow unauthenticated requests but user will be null
    req.user = null;
    return next();
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    req.user = null;
    return next();
  }

  req.user = {
    id: decoded.id,
    username: decoded.username,
    email: decoded.email,
    role: decoded.role,
    employeeId: decoded.employeeId,
  };

  next();
};

/**
 * Require authentication middleware
 * Throws error if user is not authenticated
 */
const requireAuth = (req, res, next) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }
  next();
};

/**
 * Require role middleware
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }
    if (!roles.includes(req.user.role)) {
      throw new Error(`Access denied. Required role: ${roles.join(' or ')}`);
    }
    next();
  };
};

module.exports = {
  authenticate,
  requireAuth,
  requireRole,
  extractToken,
  verifyToken,
};

