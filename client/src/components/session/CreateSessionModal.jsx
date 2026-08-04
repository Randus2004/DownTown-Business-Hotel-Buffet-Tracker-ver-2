import { useState } from "react";
import "../../css/confirmModal.css";

function CreateSessionModal({
  open,
  onClose,
  onCreate,
}) {
  const [buffetName, setBuffetName] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [buffetDate, setBuffetDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  if (!open) return null;

  const handleSubmit = () => {
    if (!buffetName.trim()) {
      alert("Please enter buffet name.");
      return;
    }

    onCreate({
      buffetName,
      mealType,
      buffetDate,
    });

    setBuffetName("");
    setMealType("Breakfast");
    setBuffetDate(
      new Date().toISOString().split("T")[0]
    );
  };

  return (
    <div className="modal-overlay">
      <div className="confirm-modal">

        <h2>Create Buffet Session</h2>

        <input
          type="text"
          placeholder="Buffet Name"
          value={buffetName}
          onChange={(e) =>
            setBuffetName(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <select
          value={mealType}
          onChange={(e) =>
            setMealType(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Special</option>
        </select>

        <input
          type="date"
          value={buffetDate}
          onChange={(e) =>
            setBuffetDate(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
          }}
        />

        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="confirm-btn"
            onClick={handleSubmit}
          >
            Create Session
          </button>
        </div>

      </div>
    </div>
  );
}

export default CreateSessionModal;