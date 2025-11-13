import express from "express";
import {
  createReview,
  getPartnerReviews,
  getMyReviews,
  deleteReview,
} from "../controllers/review.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route - anyone can view approved reviews
router.use(verifyToken);
router.get("/", getPartnerReviews);

// Protected routes - require authentication
router.post("/", checkRole(["client"]), createReview);
router.get("/my-reviews", checkRole(["client"]), getMyReviews);
router.delete("/:id", checkRole(["client"]), deleteReview);

export default router;
