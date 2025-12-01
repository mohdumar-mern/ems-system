import logger from "../config/logger.js";
import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  logger.error(err);
  console.log(err)

  // Custom API Errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors,
    });
  }

  // Mongo Duplicate Key Error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate value error",
      field: err.keyValue,
    });
  }

  // Unexpected Error
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
