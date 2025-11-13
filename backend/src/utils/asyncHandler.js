// function asyncHandler(requestHandler) {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch(next);
//     };
// }
// export { asyncHandler };

////////////////////////////////////////////////////////////////

/**
 * Higher-order function to handle async route handlers
 * Automatically catches errors and passes them to error middleware
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
