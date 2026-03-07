import express from "express";
import {
  addVideo,
  getVideosByPage,
  deleteVideo,
    getAllVideos,
} from "../controllers/videoController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin adds video
router.post("/", protectAdmin, addVideo);

// Delete video (admin)
router.delete("/:id", protectAdmin, deleteVideo);

// Get videos for a specific page
router.get("/:slug", getVideosByPage);

router.get("/", getAllVideos);

export default router;