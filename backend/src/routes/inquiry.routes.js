import express from "express";
import {
  createInquiry,
  getClientInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  getInquiryStats
} from "../controllers/inquiry.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication and client and admin role
router.use(verifyToken);
router.use(checkRole(['client', 'admin']));

// Inquiry CRUD routes
router.post("/", createInquiry);
router.get("/", getClientInquiries);
router.get("/stats", getInquiryStats);
router.get("/:id", getInquiryById);
router.put("/:id/status", updateInquiryStatus);
router.delete("/:id", deleteInquiry);

export default router;
