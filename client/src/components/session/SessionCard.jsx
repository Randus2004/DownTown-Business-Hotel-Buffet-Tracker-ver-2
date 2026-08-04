import { useNavigate } from "react-router-dom";
import "../../css/sessioncard.css";

function SessionCard({ session }) {
  const navigate = useNavigate();

  const isClosed = session.status === "Closed";

  const pendingGuests =
    session.totalGuests - session.claimedGuests;

  // ------------------------
  // Closed Session Card
  // ------------------------

  if (isClosed) {
    return (
      <div className="session-card session-card-small">
        <div className="session-top">
          <div>
            <h2>{session.buffetName}</h2>

            <p>
              <strong>Session:</strong>{" "}
              {session.sessionCode}
            </p>

            <p>
              👥 <strong>Guests:</strong>{" "}
              {session.totalGuests}
            </p>
          </div>

          <span className="status closed">
            Closed
          </span>
        </div>

        <div className="session-actions">
          <button
            onClick={() =>
              navigate(`/sessions/${session._id}`)
            }
          >
            View Session
          </button>
        </div>
      </div>
    );
  }

  // ------------------------
  // Open Session Card
  // ------------------------

  return (
    <div className="session-card">
      <div className="session-top">
        <div>
          <h2>{session.buffetName}</h2>

          <p>
            <strong>Meal:</strong>{" "}
            {session.mealType}
          </p>

          <p>
            <strong>Session:</strong>{" "}
            {session.sessionCode}
          </p>
        </div>

        <span className="status open">
          Open
        </span>
      </div>

      <div className="session-summary">
        <span>
          👥 <strong>Guests:</strong>{" "}
          {session.totalGuests}
        </span>

        <span>
          ✅ <strong>Claimed:</strong>{" "}
          {session.claimedGuests}
        </span>

        <span>
          ⏳ <strong>Pending:</strong>{" "}
          {pendingGuests}
        </span>
      </div>

      <div className="session-actions">
        <button
          onClick={() =>
            navigate(`/sessions/${session._id}`)
          }
        >
          Manage Session
        </button>
      </div>
    </div>
  );
}

export default SessionCard;