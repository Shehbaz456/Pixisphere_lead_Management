import express from "express";
import {
  onboardPartner,
  getPartnerProfile,
  updatePartnerProfile,
  getMatchedLeads,
  getLeadDetails,
  respondToLead,
  addPortfolioItem,
  getPartnerPortfolio,
  updatePortfolioItem,
  deletePortfolioItem
} from "../controllers/partner.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication and partner role
router.use(verifyToken);
router.use(checkRole(['partner']));

// partner profile routes
router.post("/onboard", onboardPartner);
router.get("/profile", getPartnerProfile);
router.put("/profile", updatePartnerProfile);

// Lead management routes
router.get("/leads", getMatchedLeads);
router.get("/leads/:id", getLeadDetails);
router.put("/leads/:id/respond", respondToLead);

// Portfolio routes
router.post("/portfolio", addPortfolioItem);
router.get("/portfolio", getPartnerPortfolio);
router.put("/portfolio/:id", updatePortfolioItem);
router.delete("/portfolio/:id", deletePortfolioItem);

export default router;
