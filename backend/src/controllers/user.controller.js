import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AuthService from "../services/AuthService.js";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// /**
//  * @desc    Register new user
//  * @route   POST /api/auth/signup
//  * @access  Public
//  */
const signup = asyncHandler(async (req, res) => {
  const user = await AuthService.registerUser(req.body);

  return res
    .status(201)
    .json(ApiResponse.created(user, "User registered successfully"));
});

/**
//  * @desc    Login with email/password
//  * @route   POST /api/auth/login
//  * @access  Public
//  */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Authenticate user
  const user = await AuthService.authenticateUser(email, password);

  // Generate tokens
  const { accessToken, refreshToken } = await AuthService.generateTokens(
    user._id
  );

  // Remove sensitive data
  const loggedInUser = await AuthService.getUserProfile(user._id);

  // Set cookies and send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      ApiResponse.success(
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// /**
//  * @desc    Send OTP to email
//  * @route   POST /api/auth/send-otp
//  * @access  Public
//  */
const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await AuthService.sendOTP(email);

  return res
    .status(200)
    .json(
      ApiResponse.success(
        { email: result.email, expiresIn: result.expiresIn },
        "OTP sent successfully"
      )
    );
});

// /**
//  * @desc    Verify OTP and login
//  * @route   POST /api/auth/verify-otp
//  * @access  Public
//  */
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Verify OTP
  const user = await AuthService.verifyOTPAndAuthenticate(email, otp);

  // Generate tokens
  const { accessToken, refreshToken } = await AuthService.generateTokens(
    user._id
  );

  // Get user profile
  const loggedInUser = await AuthService.getUserProfile(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      ApiResponse.success(
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "OTP verified successfully"
      )
    );
});

// /**
//  * @desc    Refresh access token
//  * @route   POST /api/auth/refresh-token
//  * @access  Public
//  */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  const { accessToken, refreshToken, user } =
    await AuthService.refreshAccessToken(incomingRefreshToken);

  const loggedInUser = await AuthService.getUserProfile(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      ApiResponse.success(
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Access token refreshed successfully"
      )
    );
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  await AuthService.logout(req.user._id);

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(ApiResponse.success({}, "User logged out successfully"));
});

// /**
//  * @desc    Get current user profile
//  * @route   GET /api/auth/profile
//  * @access  Private
//  */
const getProfile = asyncHandler(async (req, res) => {
  const user = await AuthService.getUserProfile(req.user._id);

  return res
    .status(200)
    .json(ApiResponse.success(user, "User profile retrieved successfully"));
});

export {
  signup,
  login,
  sendOTP,
  verifyOTP,
  refreshAccessToken,
  logout,
  getProfile,
};














//////////////////////////////////////////////////////
//         OLD way of writing cotroller
//////////////////////////////////////////////////////


// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import User  from "../models/User.model.js";
// import jwt from "jsonwebtoken";
// import ms from "ms";

// const generateAccessAndRefereshTokens = async (userId) => {
//     try {
//         const user = await User.findById(userId);
//         const accessToken = user.generateAccessToken();
//         const refreshToken = user.generateRefreshToken();

//         user.refreshToken = refreshToken;
//         await user.save({ validateBeforeSave: false });

//         return { accessToken, refreshToken };
//     } catch (error) {
//         throw new ApiError(
//             500,
//             "Something went wrong while generating referesh and access token"
//         );
//     }
// };


// const registerUser = asyncHandler(async (req, res) => {

//     const {  email, password, name,role } = req.body;

//     // Validate required fields
//     if (!email || !email.trim()) {
//     throw new ApiError(400, "Email is required");
//     }

//     if (!password || password.length < 6) {
//     throw new ApiError(400, "Password must be at least 6 characters");
//     }

//     if (!name || !name.trim()) {
//     throw new ApiError(400, "Name is required");
//     }

//     // Validate email format (additional check)
//     const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     if (!emailRegex.test(email)) {
//         throw new ApiError(400, "Invalid email format");
//     }

//     // Validate role
//     const validRoles = ['client', 'partner', 'admin'];
//     if (role && !validRoles.includes(role)) {
//         throw new ApiError(400, "Invalid role. Must be client, partner, or admin");
//     }

//     const existedUser = await User.findOne( { email });

//     if (existedUser) {
//         throw new ApiError(409, "User with email already exists");
//     }
//     const userData = {
//         name,
//         email,
//         password,
//         role: role || "client",
//     };

//     const user = await User.create(userData);

//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     );
//     if (!createdUser)  throw new ApiError( 500, "somthing went wrong while registering the user")
    
//     return res.status(201).json(new ApiResponse(200, createdUser, "User Register Successfully"));
// });


// const loginUser = asyncHandler(async (req, res) => {
//     // req body -> data
//     //find the user
//     //password check
//     //access and referesh token
//     //send cookie

//     const { email, password } = req.body;
   
//     const user = await User.findOne({ email });

//     if (!user) {
//         throw new ApiError(404, "User does not exist");
//     }

//     const isPasswordValid = await user.isPasswordCorrect(password);

//     if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");
    

//     const { accessToken, refreshToken } = await generateAccessAndRefereshTokens( user._id );

//     const loggedInUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     );

//     const options = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//     };
    

//     return res
//         .status(200)
//         .cookie("accessToken", accessToken, {...options,maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY)})
//         .cookie("refreshToken", refreshToken,{...options,maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY)})
//         .json(
//             new ApiResponse(
//                 200,
//                 {
//                     user: loggedInUser,
//                     accessToken,
//                     refreshToken,
//                 },
//                 "User logged In Successfully"
//             )
//         );
// });


// const logoutUser = asyncHandler(async (req, res) => {
//     // remove cookie
//     // remove refresh token from database
//     await User.findByIdAndUpdate(
//         req.user._id,
//         {
//             $unset: {
//                 refreshToken: 1, // this removes the field from document
//             },
//         },{ new: true }
//     );

//     const options = {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//     };
//     return res
//         .status(200)
//         .clearCookie("accessToken", {...options,maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY)})
//         .clearCookie("refreshToken",{...options,maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY)})
//         .json(new ApiResponse(200, {}, "User logged Out"));
// });

// const refreshAccessToken = asyncHandler(async (req, res) => {
//     // get refresh token from cookie
//     // check token is correct or not
//     // check if user exists with that token
//     // generate new access token and send it back

//     const IncomingRefreshToken =
//         req.cookies?.refreshToken || req.body?.refreshToken;

//     if (!IncomingRefreshToken) {
//         throw new ApiError(401, "unauthorized request");
//     }
//     try {
//         const decodedToken = jwt.verify(
//             IncomingRefreshToken,
//             process.env.REFRESH_TOKEN_SECRET
//         );

//         // console.log(decodedToken?._id);

//         const user = await User.findById(decodedToken?._id);

//         if (!user) {
//             throw new ApiError(401, "Invalid refresh token");
//         }
//         if (IncomingRefreshToken !== user?.refreshToken) {
//             throw new ApiError(401, "Refresh token is expired or used");
//         }
        
//         const options = {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//         };

//         const { newrefreshToken, accessToken } =
//             await generateAccessAndRefereshTokens(decodedToken._id);

//         return res
//             .status(200)
//             .cookie("accessToken", accessToken, {...options,maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY)})
//             .cookie("refreshToken", newrefreshToken,{...options,maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY)})
//             .json(
//                 new ApiResponse(
//                     200,
//                     {
//                         refreshToken: newrefreshToken,
//                         accessToken,
//                     },
//                     "Access token refreshed"
//                 )
//             );
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid refresh token");
//     }
// });


// const sendOTP = asyncHandler(async (req, res) => {
//   const { email } = req.body;
  
//   if (!email) {
//     throw new ApiError(400, "Email is required");
//   }
  
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
  
//   const otp = user.generateOTP();
//   await user.save({ validateBeforeSave: false });
  
//   // Mock sending OTP (in production, use Nodemailer/Twilio)
//   console.log(`OTP for ${email}: ${otp}`);
  
//   return res.status(200).json(
//     new ApiResponse(
//       200, 
//       { email, otp }, // Remove otp in production
//       "OTP sent successfully"
//     )
//   );
// });


// const verifyOTP = asyncHandler(async (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     throw new ApiError(400, "Email and OTP are required");
//   }

//   const user = await User.findOne({ email }).select("+otp +otpExpiry +otpAttempts");
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
  
//   const verification = user.verifyOTP(otp);
  
//   if (!verification.valid) {
//     // Save failed attempt count
//     await user.save({ validateBeforeSave: false });
//     throw new ApiError(400, verification.message);
//   }
  
//   // OTP is valid - clear it and save
//   await user.save({ validateBeforeSave: false });
  
//   const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  
//   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  
//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict'
//   };
  
//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, {...options,maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY)})
//     .cookie("refreshToken", refreshToken,{...options,maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY)})
//     .json(
//       new ApiResponse(
//         200,
//         { 
//           user: loggedInUser,
//           accessToken,
//           refreshToken
//         },
//         verification.message
//       )
//     );
// });



// const getUserProfile = asyncHandler(async (req, res) => {
//     return res.status(200).json(
//         new ApiResponse(200, req.user, "User profile fetched successfully")
//     );
// })

// const getAllUsers = asyncHandler(async (req, res) => {
//     const users = await User.find();
//     return res.status(200).json(
//         new ApiResponse(200, users, "All users fetched successfully")
//     );
// })

// export { registerUser, loginUser, refreshAccessToken, sendOTP, verifyOTP,getUserProfile,getAllUsers,logoutUser };
