class Response {
  static success = (res, status, message, data) => {
    return res.status(status).json({
      status,
      message,
      data,
    });
  };

  static error = (res, status, message) => {
    return res.status(status).json({
      status,
      message,
    });
  };
}

export default Response;
