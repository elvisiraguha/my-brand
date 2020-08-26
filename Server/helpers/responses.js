class Response {
  static success = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
      message,
      data,
    });
  };

  static error = (res, statusCode, message) => {
    return res.status(statusCode).json({
      message,
    });
  };
}

export default Response;
