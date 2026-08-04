import express from "express";
import { downloadReport } from "../controllers/reportController.js";

const router = express.Router();

// Download Session Report
router.get("/:sessionId", downloadReport);

export default router;