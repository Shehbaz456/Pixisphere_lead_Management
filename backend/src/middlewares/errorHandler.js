import { ApiError } from "../utils/ApiError.js";
import { Logger } from "../utils/Logger.js";

/**
 * Global error handler middleware
 * Catches all errors and sends consistent response format
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    const message = error.message || "Something went wrong";

    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Log error
  Logger.error(`${error.statusCode} - ${error.message}`, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: error.stack,
  });

  // Prepare response
  const response = {
    statusCode: error.statusCode,
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

/**
 * Handle 404 - Route not found
 */
export const notFoundHandler = (req, res, next) => {
  const error = ApiError.notFound(
    `Route ${req.method} ${req.originalUrl} not found`
  );
  next(error);
};




//////////////////////////////////////////////////////////
// rewrite adding classes and OOPS service feature
/////////////////////////////////////////////////////////



// import {ApiError} from "../utils/ApiError.js";

// export const errorHandler = function(err, req, res, next) {
//     console.error(`[ERROR] ${err.message}`, err);

//     if (err instanceof ApiError) {
//         return res.status(err.statusCode).json({
//             success: false,
//             statusCode: err.statusCode,
//             message: err.message,
//             ...(err.details && { details: err.details }),
//         });
//     }

//     // Fallback for unhandled errors
//     res.status(500).json({
//         success: false,
//         statusCode: 500,
//         message: "Internal Server Error",
//     });
// };