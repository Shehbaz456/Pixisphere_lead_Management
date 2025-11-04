import  jwt  from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User  from "../models/User.model.js";

export const verifyToken = asyncHandler(async(req,res,next)=>{
    try {
    // verify jwt token 
    const token  =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if(!token){
        throw new ApiError(401, "Unauthorized request")
    }

    const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
    const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
    if (!user) {  
        throw new ApiError(401, "Invalid Access Token")
    }
    req.user = user;
    next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }    
})

export const checkRole = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Insufficient permissions");
    }
    
    next();
  });
};