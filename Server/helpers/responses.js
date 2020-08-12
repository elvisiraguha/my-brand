class Response {
  static success = (res, status_code, message, data) => {
    return res.status(status_code).json({
      message,
      data,
    });
  };

  static error = (res, status_code = 500, message) => {
    return res.status(status_code).json({
      message,
    });
  };
}

export default Response;
