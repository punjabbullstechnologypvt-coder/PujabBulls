import express from "express";
import { createLead, getLeads } from "../controllers/leadController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { verifyRecaptcha } from "../middleware/recaptchaMiddleware.js";

const router = express.Router();

// Submit a new lead (public — used by the landing page form)
router.post("/", verifyRecaptcha, createLead);

// Get all leads (admin only)
router.get("/", protectAdmin, getLeads);

export default router;
