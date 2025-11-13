// export class ApiResponse{
//     constructor(statusCode, data, message = "Success") {
//         this.statusCode = statusCode;
//         this.data = data;
//         this.message = message;
//         this.success = statusCode<400;
//     }
// }

/////////////////////////////////////////////////////////////////

/**
 * Standard API Response class for consistent response structure
 */
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Factory method for success responses
   */
  static success(data, message = "Operation successful") {
    return new ApiResponse(200, data, message);
  }

  /**
   * Factory method for created responses
   */
  static created(data, message = "Resource created successfully") {
    return new ApiResponse(201, data, message);
  }

  /**
   * Factory method for no content responses
   */
  static noContent(message = "Operation successful") {
    return new ApiResponse(204, null, message);
  }
}

export { ApiResponse };
