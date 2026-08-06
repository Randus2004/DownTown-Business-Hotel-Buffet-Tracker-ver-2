import mongoose from "mongoose";

const unassignedGuestSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    guestName: {
      type: String,
      required: true,
      trim: true,
    },

    guestNumber: {
      type: Number,
      default: 1,
    },

    generated: {
      type: Boolean,
      default: false,
    },

    claimed: {
      type: Boolean,
      default: false,
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

export default mongoose.model(
  "UnassignedGuest",
  unassignedGuestSchema
);