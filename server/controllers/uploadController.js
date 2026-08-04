import fs from "fs";

import Guest from "../models/Guest.js";
import Session from "../models/Session.js";

import { parseGuestExcel } from "../utils/excelParser.js";

export const uploadGuests = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Excel file is required",
      });
    }

    // Check if session exists
    const session = await Session.findById(sessionId);

    if (!session) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Prevent upload if session is closed
if (session.status === "Closed") {
  fs.unlinkSync(req.file.path);

  return res.status(400).json({
    message: "This buffet session has been closed. Guest upload is no longer allowed.",
  });
}

    // Parse Excel
    const guests = parseGuestExcel(req.file.path);

    // Prevent re-upload after claims have started
    const claimedCount = await Guest.countDocuments({
      sessionId,
      claimed: true,
    });

    if (claimedCount > 0) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message:
          "This session already has claimed guests. Reset or create a new session before uploading another Excel.",
      });
    }

    // Remove existing guests
    await Guest.deleteMany({
      sessionId,
    });

    // Prepare guest documents
    const guestDocs = guests.map((guest) => ({
      sessionId,
      roomNo: guest.roomNo,
      guestName: guest.guestName,
      guestNumber: guest.guestNumber,
      generated: guest.generated,
      claimed: false,
    }));

    // Save guests
    await Guest.insertMany(guestDocs);

    // Update session statistics
    session.totalGuests = guestDocs.length;
    session.claimedGuests = 0;

    await session.save();

    // Delete uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(201).json({
      success: true,
      message: "Guests imported successfully",
      totalGuests: guestDocs.length,
    });

  } catch (error) {

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};