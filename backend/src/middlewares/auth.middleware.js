import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.model.js";


// Verify JWT token and attach user to request
export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw ApiError.unauthorized("Access token is required");
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw ApiError.unauthorized("Invalid access token");
    }
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw ApiError.unauthorized("Invalid access token");
    }
    if (error.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Access token expired");
    }
    throw error;
  }
});

// /**
//  * Check if user has required role(s)
//  * @param {string[]} roles - Array of allowed roles
//  */
export const checkRole = (roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Access denied. Required role: ${roles.join(" or ")}`
      );
    }

    next();
  });
};

/**
 * Optional authentication - attaches user if token exists
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
});






//////////////////////////////////////////////////////////
// rewrite adding classes and OOPS service feature
//////////////////////////////////////////////////////////


// import  jwt  from "jsonwebtoken";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import User  from "../models/User.model.js";

// export const verifyToken = asyncHandler(async(req,res,next)=>{
//     try {
//     // verify jwt token 
//     const token  =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

//     if(!token){
//         throw new ApiError(401, "Unauthorized request")
//     }

//     const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
//     const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
//     if (!user) {  
//         throw new ApiError(401, "Invalid Access Token")
//     }
//     req.user = user;
//     next();
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid access token")
//     }    
// })

// export const checkRole = (allowedRoles) => {
//   return asyncHandler(async (req, res, next) => {
//     if (!req.user) {
//       throw new ApiError(401, "Authentication required");
//     }
    
//     if (!allowedRoles.includes(req.user.role)) {
//       throw new ApiError(403, "Insufficient permissions");
//     }
    
//     next();
//   });
// };