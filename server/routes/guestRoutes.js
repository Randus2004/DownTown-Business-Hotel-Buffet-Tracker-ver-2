import express from "express";

import {
  getGuests,
  updateGuestStatus,
} from "../controllers/guestController.js";

const router = express.Router();

// Get Guests
router.get("/:sessionId", getGuests);

// Update Guest Status
router.patch("/:guestId/status", updateGuestStatus);

export default router;