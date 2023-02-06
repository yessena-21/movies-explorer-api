const { SERVER_ERROR_MESSAGE } = require('./errors');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? SERVER_ERROR_MESSAGE
        : message,
    });

  next();
};
