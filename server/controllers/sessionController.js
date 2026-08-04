import Session from "../models/Session.js";

// Create Session
export const createSession = async (req, res) => {
  try {
    const { buffetName, mealType, buffetDate } = req.body;


    const today = new Date();
    const dateCode = today.toISOString().slice(0, 10).replace(/-/g, "");

    const count = await Session.countDocuments();

    const prefix =
      mealType === "Breakfast"
        ? "BF"
        : mealType === "Lunch"
        ? "LU"
        : mealType === "Dinner"
        ? "DN"
        : "SP";

    const sessionCode = `${prefix}-${dateCode}-${String(
      count + 1
    ).padStart(3, "0")}`;

const session = await Session.create({
  buffetName,
  mealType,
  buffetDate,
  sessionCode,
});

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Sessions
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({
      createdAt: -1,
    });

    res.json(sessions);
  } catch (error) {
    console.log("GET SESSIONS ERROR");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Session
export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Session by Session Code
export const getSessionByCode = async (req, res) => {
  try {
    const session = await Session.findOne({
      sessionCode: req.params.sessionCode,
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// End Session
export const endSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.status === "Closed") {
      return res.status(400).json({
        message: "Session is already closed.",
      });
    }

    session.status = "Closed";
    session.endedAt = new Date();

    await session.save();

    res.json({
      message: "Session ended successfully.",
      session,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};