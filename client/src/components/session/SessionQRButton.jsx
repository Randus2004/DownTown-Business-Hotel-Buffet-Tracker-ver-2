import { useState } from "react";
import SessionQRModal from "./SessionQRModal";

function SessionQRButton({ session }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={session.status === "Closed"}
        style={{
          padding: "12px 18px",
          border: "none",
          borderRadius: "10px",
          background: "#111827",
          color: "#fff",
          cursor:
            session.status === "Closed"
              ? "not-allowed"
              : "pointer",
          fontWeight: 600,
        }}
      >
        📱 Staff QR
      </button>

      <SessionQRModal
        open={open}
        onClose={() => setOpen(false)}
        session={session}
      />
    </>
  );
}

export default SessionQRButton;