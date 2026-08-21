import mongoose from "mongoose";

import UnassignedGuest from "../models/UnassignedGuest.js";
import Session from "../models/Session.js";

// ========================================
// Get all unassigned guests for a session
// ========================================

export const getUnassignedGuests = async (req, res) => {
  try {
    const guests = await UnassignedGuest.find({
      sessionId: req.params.sessionId,
    }).sort({
      createdAt: 1,
      guestNumber: 1,
    });

    res.json(guests);

  } catch (error) {
    console.error(
      "Get Unassigned Guests Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// Create unassigned guest
// ========================================

export const createUnassignedGuest = async (req, res) => {
  try {
    const {
      sessionId,
      guestName,
      pax,
    } = req.body;

    if (!sessionId || !guestName) {
      return res.status(400).json({
        message:
          "Session ID and Guest Name are required.",
      });
    }

    // Create one group ID for this booking
    const groupId =
      new mongoose.Types.ObjectId().toString();

    const guests = [];

    const totalPax = Math.max(
      Number(pax) || 1,
      1
    );

    for (
      let i = 1;
      i <= totalPax;
      i++
    ) {
      guests.push({
        sessionId,

        groupId,

        guestName:
          i === 1
            ? guestName
            : `Guest ${i}`,

        guestNumber: i,

        generated: i > 1,

        claimed: false,

        claimedAt: null,
      });
    }

    const createdGuests =
      await UnassignedGuest.insertMany(
        guests
      );

    // Increase total guest count
    await Session.findByIdAndUpdate(
      sessionId,
      {
        $inc: {
          totalGuests: createdGuests.length,
        },
      }
    );

    res.status(201).json({
      success: true,

      message:
        "Unassigned guest added successfully.",

      guests: createdGuests,
    });

  } catch (error) {
    console.error(
      "Create Unassigned Guest Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// Update claim status
// ========================================

export const updateUnassignedGuestStatus =
  async (req, res) => {
    try {
      const { claimed } = req.body;

      const guest =
        await UnassignedGuest.findById(
          req.params.guestId
        );

      if (!guest) {
        return res.status(404).json({
          message: "Guest not found",
        });
      }

      // Prevent unnecessary database update
      if (guest.claimed === claimed) {
        return res.json({
          message: "No changes",
          guest,
        });
      }

      // Check session
      const session =
        await Session.findById(
          guest.sessionId
        );

      if (!session) {
        return res.status(404).json({
          message: "Session not found",
        });
      }

      // Prevent claiming after session closed
      if (session.status === "Closed") {
        return res.status(400).json({
          message:
            "This buffet session has been closed.",
        });
      }

      // Update guest
      guest.claimed = claimed;

      guest.claimedAt = claimed
        ? new Date()
        : null;

      await guest.save();

      // Update session statistics
      await Session.findByIdAndUpdate(
        guest.sessionId,
        {
          $inc: {
            claimedGuests:
              claimed ? 1 : -1,
          },
        }
      );

      res.json({
        message:
          "Guest status updated successfully.",

        guest,
      });

    } catch (error) {
      console.error(
        "Update Unassigned Guest Status Error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };