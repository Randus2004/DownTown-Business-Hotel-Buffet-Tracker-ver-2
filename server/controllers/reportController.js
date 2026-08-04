import Session from "../models/Session.js";
import Guest from "../models/Guest.js";

import { generateReport } from "../utils/reportGenerator.js";

export const downloadReport = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Find Session
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Claimed Guests
    const claimedGuests = await Guest.find({
      sessionId,
      claimed: true,
    }).sort({
      roomNo: 1,
      guestName: 1,
    });

    // Pending Guests
    const pendingGuests = await Guest.find({
      sessionId,
      claimed: false,
    }).sort({
      roomNo: 1,
      guestName: 1,
    });

    // Generate Workbook
    const workbook = await generateReport(
      session,
      claimedGuests,
      pendingGuests
    );

    // Download Headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${session.sessionCode}_Report.xlsx`
    );

    // Send Workbook
    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};