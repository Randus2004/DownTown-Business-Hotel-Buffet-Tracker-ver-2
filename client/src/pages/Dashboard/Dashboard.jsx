import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import StatCard from "../../components/ui/StatCard";
import SessionCard from "../../components/session/SessionCard";
import CreateSessionModal from "../../components/session/CreateSessionModal";

import {
  getSessions,
  createSession,
} from "../../services/sessionService";
import CreateSessionCard from "../../components/session/CreateSessionCard";
import "../../css/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSessions();

    const interval = setInterval(() => {
      loadSessions();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadSessions = async () => {
    try {
      const res = await getSessions();
      setSessions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateSession = async (data) => {
    try {
      const res = await createSession(data);

      setShowModal(false);

      await loadSessions();

      navigate(`/sessions/${res.data._id}`);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to create session."
      );
    }
  };

  // Active Sessions
  const activeSessions = sessions.filter(
    (session) => session.status === "Open"
  );

  // Recent Closed Sessions
  const recentSessions = sessions
    .filter((session) => session.status === "Closed")
    .slice(0, 5);

  // Dashboard Stats
  const totalGuests = activeSessions.reduce(
    (sum, session) => sum + session.totalGuests,
    0
  );

  const claimedGuests = activeSessions.reduce(
    (sum, session) => sum + session.claimedGuests,
    0
  );

  const pendingGuests =
    totalGuests - claimedGuests;

  return (
    <>
      <Navbar />

      <div className="dashboard">

        <h2>Downtown Hotel Buffet Dashboard</h2>

        <div className="stats">
          <StatCard
            title="Open Sessions"
            value={activeSessions.length}
          />

          <StatCard
            title="Guests"
            value={totalGuests}
          />

          <StatCard
            title="Claimed"
            value={claimedGuests}
          />

          <StatCard
            title="Pending"
            value={pendingGuests}
          />
        </div>

<h3>Today's Active Sessions</h3>

<div className="session-grid">

  <CreateSessionCard
    onClick={() => setShowModal(true)}
  />

  {activeSessions.map((session) => (
    <SessionCard
      key={session._id}
      session={session}
    />
  ))}

</div>
        <h3 style={{ marginTop: "40px" }}>
          Recent Sessions
        </h3>

        {recentSessions.length > 0 ? (
          recentSessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
            />
          ))
        ) : (
          <p>No previous sessions found.</p>
        )}

      </div>

      <CreateSessionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateSession}
      />
    </>
  );
}

export default Dashboard;