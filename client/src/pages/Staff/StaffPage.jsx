import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SearchBar from "../../components/guest/SearchBar";
import GuestList from "../../components/guest/GuestList";

import {
  getGuests,
  updateGuestStatus,
} from "../../services/guestService";

import {
  getUnassignedGuests,
  updateUnassignedGuestStatus,
} from "../../services/unassignedService";

import {
  getSessionByCode,
} from "../../services/sessionService";

import "../../css/staff.css";

function StaffPage() {
  const { sessionCode } = useParams();

  const [session, setSession] = useState(null);
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");

  // ---------------------------------------
  // Load Data
  // ---------------------------------------

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, [sessionCode]);

  const loadData = async () => {
    try {
      const sessionRes =
        await getSessionByCode(sessionCode);

      const currentSession =
        sessionRes.data;

      setSession(currentSession);

      // Get normal guests + unassigned guests
      const [
        guestRes,
        unassignedRes,
      ] = await Promise.all([
        getGuests(currentSession._id),
        getUnassignedGuests(
          currentSession._id
        ),
      ]);

      const mergedGuests = [
        ...guestRes.data,

        ...unassignedRes.data.map(
          (guest) => ({
            ...guest,
            roomNo: "",
          })
        ),
      ];

      setGuests(mergedGuests);

    } catch (err) {
      console.log(err);
    }
  };

  // ---------------------------------------
  // Toggle Guest
  // ---------------------------------------

  const handleToggle = async (guest) => {
    if (session.status === "Closed") {
      return;
    }

    try {
      if (guest.roomNo === "") {
        await updateUnassignedGuestStatus(
          guest._id,
          !guest.claimed
        );
      } else {
        await updateGuestStatus(
          guest._id,
          !guest.claimed
        );
      }

      await loadData();

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to update guest."
      );
    }
  };

  // ---------------------------------------
  // Loading
  // ---------------------------------------

  if (!session) {
    return <h2>Loading...</h2>;
  }

  // ---------------------------------------
  // Search
  // ---------------------------------------

  const filteredGuests = guests.filter(
    (guest) => {
      const keyword =
        search.toLowerCase();

      return (
        (guest.roomNo || "")
          .toLowerCase()
          .includes(keyword) ||
        (guest.guestName || "")
          .toLowerCase()
          .includes(keyword)
      );
    }
  );

  // ---------------------------------------
  // Status Counts
  // ---------------------------------------

  const totalGuests =
    guests.length;

  const servedGuests =
    guests.filter(
      (guest) => guest.claimed
    ).length;

  const pendingGuests =
    totalGuests - servedGuests;

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <div className="staff-page">

      <h1>{session.buffetName}</h1>

      {/* Closed Session Warning */}
      {session.status === "Closed" && (
        <div
          style={{
            background: "#fef3c7",
            color: "#92400e",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          This buffet session has been closed.
          Guest claiming is disabled.
        </div>
      )}

      {/* -------------------------------- */}
      {/* STATUS CARDS */}
      {/* -------------------------------- */}

      <div className="staff-stats">

        <div className="staff-stat-card">
          <span className="staff-stat-label">
            Total Guests
          </span>

          <strong className="staff-stat-value">
            {totalGuests}
          </strong>
        </div>

        <div className="staff-stat-card">
          <span className="staff-stat-label">
            Pending
          </span>

          <strong className="staff-stat-value">
            {pendingGuests}
          </strong>
        </div>

        <div className="staff-stat-card">
          <span className="staff-stat-label">
            Served
          </span>

          <strong className="staff-stat-value">
            {servedGuests}
          </strong>
        </div>

      </div>

      {/* Search */}
      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      {/* -------------------------------- */}
      {/* PENDING */}
      {/* -------------------------------- */}

      <div className="staff-section">

        <h2>
          Pending
          <span className="staff-section-count">
            {pendingGuests}
          </span>
        </h2>

        <GuestList
          guests={filteredGuests.filter(
            (guest) =>
              !guest.claimed
          )}
          onToggle={handleToggle}
          disabled={
            session.status === "Closed"
          }
        />

      </div>

      {/* -------------------------------- */}
      {/* SERVED */}
      {/* -------------------------------- */}

      <div className="staff-section">

        <h2>
          Served
          <span className="staff-section-count">
            {servedGuests}
          </span>
        </h2>

        <GuestList
          guests={filteredGuests.filter(
            (guest) =>
              guest.claimed
          )}
          onToggle={handleToggle}
          disabled={
            session.status === "Closed"
          }
        />

      </div>

    </div>
  );
}

export default StaffPage;