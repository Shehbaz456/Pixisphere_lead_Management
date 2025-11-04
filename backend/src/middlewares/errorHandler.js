import {ApiError} from "../utils/ApiError.js";

export const errorHandler = function(err, req, res, next) {
    console.error(`[ERROR] ${err.message}`, err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message,
            ...(err.details && { details: err.details }),
        });
    }

    // Fallback for unhandled errors
    res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
    });
};