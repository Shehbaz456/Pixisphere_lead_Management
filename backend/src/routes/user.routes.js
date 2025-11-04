import express from "express";
import { registerUser, loginUser,sendOTP, verifyOTP, logoutUser, refreshAccessToken,getAllUsers, getUserProfile} from "../controllers/user.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", registerUser);
router.post("/send-otp", sendOTP);              
router.post("/verify-otp", verifyOTP);       
router.post("/login",loginUser);
router.post( "/refresh-token",refreshAccessToken);
router.post("/logout", verifyToken,logoutUser);

// Protected route examples
router.get("/profile", verifyToken, getUserProfile); 
router.get("/admin/users", verifyToken, checkRole(['admin']), getAllUsers);

export default router;
