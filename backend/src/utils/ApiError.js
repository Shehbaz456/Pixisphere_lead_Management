// class ApiError extends Error {
//     constructor(statusCode, message, details, isOperational = true) {
//         super(message);

//         this.statusCode = statusCode;
//         this.isOperational = isOperational;
//         this.details = details;

//         // Maintains proper stack trace (V8 only)
//         if (Error.captureStackTrace) {
//             Error.captureStackTrace(this, this.constructor);
//         }
//     }
// }

// export { ApiError }

//////////////////////////////////////////////////////////////////////

/**
 * Custom API Error class following industry standard
 * Extends native Error with additional properties for API responses
 */
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Factory method for creating bad request errors
   */
  static badRequest(message = "Bad Request", errors = []) {
    return new ApiError(400, message, errors);
  }

  /**
   * Factory method for creating unauthorized errors
   */
  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  /**
   * Factory method for creating forbidden errors
   */
  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  /**
   * Factory method for creating not found errors
   */
  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  /**
   * Factory method for creating conflict errors
   */
  static conflict(message = "Resource already exists") {
    return new ApiError(409, message);
  }

  /**
   * Factory method for creating internal server errors
   */
  static internal(message = "Internal Server Error") {
    return new ApiError(500, message);
  }
}

export { ApiError };
