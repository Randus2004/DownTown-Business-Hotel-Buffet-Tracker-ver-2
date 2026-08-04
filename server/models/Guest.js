import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    roomNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    guestName: {
      type: String,
      required: true,
      trim: true,
    },

    // Position of guest inside the room
    // 1 = Main Guest
    // 2 = Guest 2
    // 3 = Guest 3
    guestNumber: {
      type: Number,
      required: true,
      default: 1,
    },

    // Original PAX (optional, useful for reports)
    adults: {
      type: Number,
      default: 1,
    },

    // True if generated from PAX
    generated: {
      type: Boolean,
      default: false,
    },

    // Buffet claimed
    claimed: {
      type: Boolean,
      default: false,
      index: true,
    },


    claimedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Guest", guestSchema);