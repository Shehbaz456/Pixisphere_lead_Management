import { ApiError } from "../utils/ApiError.js";

/**
 * Validate request body against schema
 * @param {Object} schema - Validation schema
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));

      throw ApiError.badRequest("Validation failed", errors);
    }

    next();
  };
};

/**
 * Validate MongoDB ObjectId
 */
export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw ApiError.badRequest(`Invalid ${paramName} format`);
    }

    next();
  };
};
