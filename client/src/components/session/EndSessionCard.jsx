import { useState } from "react";

import ConfirmModal from "../common/ConfirmModal";

import { endSession } from "../../services/endSessionService";

import "../../css/uploadCard.css";

function EndSessionCard({
  session,
  onSessionEnded,
}) {
  const [open, setOpen] = useState(false);

  const handleEnd = async () => {
    try {
      await endSession(session._id);

      setOpen(false);

      alert("Session ended successfully.");

      onSessionEnded();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to end session."
      );
    }
  };

  return (
    <>
      <div className="action-card">

        <h3>🔒 End Session</h3>

        <p>
          Close this buffet session.
          Staff will no longer be able
          to claim guests.
        </p>

        <button
          onClick={() => setOpen(true)}
          disabled={session.status === "Closed"}
        >
          {session.status === "Closed"
            ? "Session Closed"
            : "End Session"}
        </button>

      </div>

      <ConfirmModal
        open={open}
        title="End Buffet Session"
        message={`Are you sure you want to close ${session.buffetName}?\n\nTotal Guests: ${session.totalGuests}\nClaimed: ${session.claimedGuests}\nPending: ${session.totalGuests - session.claimedGuests}`}
        confirmText="End Session"
        cancelText="Cancel"
        onConfirm={handleEnd}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

export default EndSessionCard;