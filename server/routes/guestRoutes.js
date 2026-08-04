import express from "express";
import {
  getGuests,
  updateGuestStatus,
} from "../controllers/guestController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/:sessionId", protect, getGuests);

router.patch(
  "/:guestId/status",
  protect,
  authorize("staff", "admin", "reception"),
  updateGuestStatus
);

export default router;