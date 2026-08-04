import express from "express";

import {
  createSession,
  getSessions,
  getSession,
  getSessionByCode,
  endSession,
} from "../controllers/sessionController.js";

const router = express.Router();

// Create Session
router.post("/", createSession);

// Get All Sessions
router.get("/", getSessions);

// Get Session by Code (Staff)
router.get("/code/:sessionCode", getSessionByCode);

// Get Single Session
router.get("/:id", getSession);

// End Session
router.patch("/:id/end", endSession);

export default router;