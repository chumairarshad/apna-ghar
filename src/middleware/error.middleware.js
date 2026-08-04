/**
 * Global Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('🔥 Global API Error:', err);

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode >= 400 ? statusCode : 500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
