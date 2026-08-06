import express from "express";

import {
  getUnassignedGuests,
  createUnassignedGuest,
  updateUnassignedGuestStatus,
} from "../controllers/unassignedController.js";

const router = express.Router();

// Add Unassigned Guest
router.post("/", createUnassignedGuest);

// Get all unassigned guests of a session
router.get("/:sessionId", getUnassignedGuests);

// Claim / Unclaim
router.patch("/:guestId", updateUnassignedGuestStatus);

export default router;