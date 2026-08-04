import express from "express";

import { downloadReport } from "../controllers/reportController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Download Session Report
router.get(
  "/:sessionId",
  protect,
  downloadReport
);

export default router;