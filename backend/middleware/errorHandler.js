export const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Tài nguyên không tìm thấy';
    error.message = message;
    error.status = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Dữ liệu đã tồn tại';
    error.message = message;
    error.status = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error.message = message;
    error.status = 400;
  }

  res.status(error.status || 500).json({
    message: error.message || 'Lỗi máy chủ',
    status: error.status || 500
  });
};

export default errorHandler;
