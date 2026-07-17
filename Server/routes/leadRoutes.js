import express from "express";
import { createLead, getLeads } from "../controllers/leadController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit a new lead (public — used by the landing page form)
router.post("/", createLead);

// Get all leads (admin only)
router.get("/", protectAdmin, getLeads);

export default router;
