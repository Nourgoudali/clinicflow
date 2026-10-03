const logger = require('../utils/logger');

// Custom AppError class for operational errors with explicit status code
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 handler for unmatched routes
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
};

// Centralized error handler
const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.originalUrl, method: req.method });

  // Handle known Sequelize Unique Constraint errors (e.g., duplicate CIN or email)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors && err.errors[0] ? err.errors[0].path : 'field';
    const value = err.errors && err.errors[0] ? err.errors[0].value : '';
    let message = `${field} already exists`;
    if (field === 'cin') {
      message = `Patient with CIN "${value}" already exists`;
    } else if (field === 'email') {
      message = `User with email "${value}" already exists`;
    }

    return res.status(409).json({
      message,
      field
    });
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors ? err.errors.map(e => e.message) : ['Database validation failed'];
    return res.status(400).json({
      message: messages[0],
      errors: messages
    });
  }

  // Handle Sequelize Foreign Key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Referenced entity does not exist or cannot be modified due to foreign key constraints'
    });
  }

  // Handle custom operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {})
    });
  }

  // Unhandled / Internal Server Error
  const statusCode = err.status || 500;
  const isDev = process.env.NODE_ENV === 'development';

  return res.status(statusCode).json({
    message: isDev ? err.message : 'Internal server error',
    ...(isDev && { stack: err.stack })
  });
};

module.exports = {
  AppError,
  notFoundHandler,
  errorHandler
};
