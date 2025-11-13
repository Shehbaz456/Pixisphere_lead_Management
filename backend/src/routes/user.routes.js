import express from "express";
import {
  signup,
  login,
  sendOTP,
  verifyOTP,
  refreshAccessToken,
  logout,
  getProfile,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, getProfile);

export default router;






////////////////////////////////////////////////////////////
//    Rewrite according to service based features
///////////////////////////////////////////////////////////



// import express from "express";
// import { registerUser, loginUser,sendOTP, verifyOTP, logoutUser, refreshAccessToken,getAllUsers, getUserProfile} from "../controllers/user.controller.js";
// import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
// const router = express.Router();

// router.post("/signup", registerUser);
// router.post("/send-otp", sendOTP);              
// router.post("/verify-otp", verifyOTP);       
// router.post("/login",loginUser);
// router.post( "/refresh-token",refreshAccessToken);
// router.post("/logout", verifyToken,logoutUser);

// // Protected route examples
// router.get("/profile", verifyToken, getUserProfile); 
// router.get("/admin/users", verifyToken, checkRole(['admin']), getAllUsers);

// export default router;
