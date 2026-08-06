import mongoose from "mongoose";
import UnassignedGuest from "../models/UnassignedGuest.js";

// Get all unassigned guests for a session
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
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create unassigned guest
export const createUnassignedGuest = async (req, res) => {
  try {
    const { sessionId, guestName, pax } = req.body;

    if (!sessionId || !guestName) {
      return res.status(400).json({
        message: "Session ID and Guest Name are required.",
      });
    }

    // One group id for the whole booking
    const groupId = new mongoose.Types.ObjectId().toString();

    const guests = [];

    const totalPax = Math.max(Number(pax) || 1, 1);

    for (let i = 1; i <= totalPax; i++) {
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
      });
    }

    const createdGuests =
      await UnassignedGuest.insertMany(
        guests
      );

    res.status(201).json({
      success: true,
      message:
        "Unassigned guest added successfully.",
      guests: createdGuests,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update claim status
export const updateUnassignedGuestStatus = async (
  req,
  res
) => {
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

    guest.claimed = claimed;
    guest.claimedAt = claimed
      ? new Date()
      : null;

    await guest.save();

    res.json({
      message: "Updated successfully",
      guest,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};