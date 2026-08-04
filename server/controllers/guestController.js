import Guest from "../models/Guest.js";
import Session from "../models/Session.js";

// Get Guests
export const getGuests = async (req, res) => {
  try {
    const guests = await Guest.find({
      sessionId: req.params.sessionId,
    }).sort({
      roomNo: 1,
      guestName: 1,
    });

    res.json(guests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Guest Status
export const updateGuestStatus = async (req, res) => {
  try {
    const { claimed } = req.body;

    const guest = await Guest.findById(req.params.guestId);

    if (!guest) {
      return res.status(404).json({
        message: "Guest not found",
      });
    }

    // Check Session Status
const session = await Session.findById(guest.sessionId);

if (!session) {
  return res.status(404).json({
    message: "Session not found",
  });
}

if (session.status === "Closed") {
  return res.status(400).json({
    message: "This buffet session has been closed.",
  });
}

    // No change
    if (guest.claimed === claimed) {
      return res.json({
        message: "No changes",
      });
    }

    guest.claimed = claimed;

    if (claimed) {
      guest.claimedBy = req.user._id;
      guest.claimedAt = new Date();

      await Session.findByIdAndUpdate(guest.sessionId, {
        $inc: { claimedGuests: 1 },
      });
    } else {
      guest.claimedBy = null;
      guest.claimedAt = null;

      await Session.findByIdAndUpdate(guest.sessionId, {
        $inc: { claimedGuests: -1 },
      });
    }

    await guest.save();

    res.json({
      message: "Guest status updated successfully",
      guest,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};