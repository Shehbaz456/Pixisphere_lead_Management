class ApiError extends Error {
    constructor(statusCode, message, details, isOperational = true) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        // Maintains proper stack trace (V8 only)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }

