import express from "express";
import {
  createSession,
  getSessions,
  getSession,
  getSessionByCode,
  endSession,
} from "../controllers/sessionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create Session
router.post(
  "/",
  protect,
  authorize("admin", "reception"),
  createSession
);

// Get All Sessions
router.get(
  "/",
  protect,
  authorize("admin", "reception"),
  getSessions
);

// Get Session by Code (Staff)
router.get(
  "/code/:sessionCode",
  protect,
  getSessionByCode
);

// Get Single Session
router.get(
  "/:id",
  protect,
  getSession
);

// End Session
router.patch(
  "/:id/end",
  protect,
  authorize("admin", "reception"),
  endSession
);

export default router;