const logger = require('./logger');

/**
 * Custom Application Error Classes
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400);
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message, details } = err;

  // Log error
  if (statusCode >= 500) {
    logger.error('Server Error:', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.warn('Client Error:', {
      error: err.message,
      statusCode,
      path: req.path,
      method: req.method,
    });
  }

  // GraphQL error format
  if (req.path === '/graphql') {
    return res.status(200).json({
      errors: [
        {
          message: message || 'Internal server error',
          extensions: {
            code: statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST',
            statusCode,
            ...(details && { details }),
          },
        },
      ],
    });
  }

  // REST error format
  res.status(statusCode).json({
    success: false,
    error: {
      message: message || 'Internal server error',
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * Async handler wrapper to catch errors in async routes
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  errorHandler,
  asyncHandler,
};

