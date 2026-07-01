const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`Not found - ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  if (err.code === 11000) {
    error = new AppError('Duplicate field value entered.', 400);
  }

  if (err.name === 'CastError') {
    error = new AppError(`Resource not found for id ${err.value}`, 404);
  }

  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message || 'Internal Server Error'
  });
}

module.exports = { notFound, errorHandler };
