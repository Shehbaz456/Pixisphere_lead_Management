import express from "express";
import {
  getDashboardStats,getPendingVerifications,verifyPartner,
  getAllReviews,moderateReview,deleteReview,
  getAllCategories,createCategory,updateCategory,deleteCategory,
  getAllLocations,createLocation,updateLocation,deleteLocation,
} from "../controllers/admin.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(verifyToken);
router.use(checkRole(["admin"]));

// Dashboard stats
router.get("/stats", getDashboardStats);

// Partner verification
router.get("/verifications", getPendingVerifications);
router.put("/verify/:id", verifyPartner);

// Reviews moderation
router.get("/reviews", getAllReviews);
router.put("/reviews/:id", moderateReview);
router.delete("/reviews/:id", deleteReview);

// Categories management
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Locations management
router.get("/locations", getAllLocations);
router.post("/locations", createLocation);
router.put("/locations/:id", updateLocation);
router.delete("/locations/:id", deleteLocation);

export default router;
