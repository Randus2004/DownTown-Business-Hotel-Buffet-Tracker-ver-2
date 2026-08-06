import { useState } from "react";
import { addUnassignedGuest } from "../../services/unassignedService";

function AddUnassignedModal({
  open,
  onClose,
  sessionId,
  onSuccess,
}) {
  const [guestName, setGuestName] = useState("");
  const [pax, setPax] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSave = async () => {
    if (!guestName.trim()) {
      alert("Please enter guest name.");
      return;
    }

    try {
      setLoading(true);

      await addUnassignedGuest({
        sessionId,
        guestName,
        pax,
      });

      setGuestName("");
      setPax(1);

      onSuccess?.();
      onClose();

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to add guest."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,.2)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Add Unassigned Guest
        </h2>

        <div style={{ marginBottom: "15px" }}>
          <label>Guest Name</label>

          <input
            type="text"
            value={guestName}
            onChange={(e) =>
              setGuestName(e.target.value)
            }
            placeholder="Enter Guest Name"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>PAX</label>

          <select
            value={pax}
            onChange={(e) =>
              setPax(Number(e.target.value))
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddUnassignedModal;