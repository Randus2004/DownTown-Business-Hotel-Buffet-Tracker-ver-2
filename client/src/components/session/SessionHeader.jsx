import { useNavigate } from "react-router-dom";
import "../../css/sessionHeader.css";

function SessionHeader({ session }) {
  const navigate = useNavigate();

  return (
    <div className="session-header">
      <button
  className="back-btn"
  onClick={() => navigate("/")}
>
  ← Dashboard
</button>

      <div>
        <h1>{session.buffetName}</h1>

        <p>{session.sessionCode}</p>
      </div>

      <span
        className={
          session.status === "Open"
            ? "status open"
            : "status closed"
        }
      >
        {session.status}
      </span>
    </div>
  );
}

export default SessionHeader;