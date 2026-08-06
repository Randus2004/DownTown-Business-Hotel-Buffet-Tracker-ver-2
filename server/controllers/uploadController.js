import fs from "fs";
import mongoose from "mongoose";

import Guest from "../models/Guest.js";
import Session from "../models/Session.js";
import UnassignedGuest from "../models/UnassignedGuest.js";

import { parseGuestExcel } from "../utils/excelParser.js";

export const uploadGuests = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Excel file is required",
      });
    }

    //---------------------------------------
    // Check Session
    //---------------------------------------

    const session = await Session.findById(sessionId);

    if (!session) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.status === "Closed") {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message:
          "This buffet session has been closed. Guest upload is no longer allowed.",
      });
    }

    //---------------------------------------
    // Parse Excel
    //---------------------------------------

    const {
      guests,
      unassignedGuests,
    } = parseGuestExcel(req.file.path);

    //---------------------------------------
    // Prevent Upload After Claims
    //---------------------------------------

    const claimedCount = await Guest.countDocuments({
      sessionId,
      claimed: true,
    });

    if (claimedCount > 0) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message:
          "Guests have already been claimed. Reset or create a new session.",
      });
    }

    //---------------------------------------
    // Delete Previous Guests
    //---------------------------------------

    await Guest.deleteMany({
      sessionId,
    });

    await UnassignedGuest.deleteMany({
      sessionId,
    });

    //---------------------------------------
    // Assigned Guests
    //---------------------------------------

    const guestDocs = guests.map((guest) => ({
      sessionId,

      roomNo: guest.roomNo,

      guestName: guest.guestName,

      guestNumber: guest.guestNumber,

      generated: guest.generated,

      claimed: false,
    }));

    //---------------------------------------
    // Unassigned Guests
    //---------------------------------------

    const unassignedDocs = [];

    let currentGroupId = null;

    for (const guest of unassignedGuests) {

      // Create a new group for every main guest
      if (guest.guestNumber === 1) {
        currentGroupId =
          new mongoose.Types.ObjectId().toString();
      }

      unassignedDocs.push({
        sessionId,

        groupId: currentGroupId,

        guestName: guest.guestName,

        guestNumber: guest.guestNumber,

        generated: guest.generated,

        claimed: false,
      });
    }

    //---------------------------------------
    // Save
    //---------------------------------------

    if (guestDocs.length) {
      await Guest.insertMany(guestDocs);
    }

    if (unassignedDocs.length) {
      await UnassignedGuest.insertMany(
        unassignedDocs
      );
    }

    //---------------------------------------
    // Update Session
    //---------------------------------------

    session.totalGuests =
      guestDocs.length +
      unassignedDocs.length;

    session.claimedGuests = 0;

    await session.save();

    //---------------------------------------
    // Delete Uploaded File
    //---------------------------------------

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    //---------------------------------------
    // Response
    //---------------------------------------

    res.status(201).json({
      success: true,

      message:
        "Guests imported successfully",

      assignedGuests:
        guestDocs.length,

      unassignedGuests:
        unassignedDocs.length,

      totalGuests:
        guestDocs.length +
        unassignedDocs.length,
    });

  } catch (error) {

    console.error(error);

    if (
      req.file &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};