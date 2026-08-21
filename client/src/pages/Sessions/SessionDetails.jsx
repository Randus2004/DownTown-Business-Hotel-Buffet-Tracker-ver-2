import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SessionHeader from "../../components/session/SessionHeader";
import SessionStats from "../../components/session/SessionStats";
import UploadCard from "../../components/session/UploadCard";
import StaffAccessCard from "../../components/session/StaffAccessCard";
import SessionQRButton from "../../components/session/SessionQRButton";

import GuestList from "../../components/guest/GuestList";
import SearchBar from "../../components/guest/SearchBar";
import ReportCard from "../../components/session/ReportCard";
import EndSessionCard from "../../components/session/EndSessionCard";
import AddUnassignedModal from "../../components/session/AddUnassignedModal";

import { getSession } from "../../services/sessionService";

import {
  getGuests,
  updateGuestStatus,
} from "../../services/guestService";

import {
  getUnassignedGuests,
  updateUnassignedGuestStatus,
} from "../../services/unassignedService";

import "../../css/SessionDetails.css";

function SessionDetails() {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  //---------------------------------------
  // Load Session + Guests
  //---------------------------------------

  useEffect(() => {
    loadSession();
    loadGuests();

    const interval = setInterval(() => {
      loadSession();
      loadGuests();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  //---------------------------------------
  // Load Session
  //---------------------------------------

  const loadSession = async () => {
    try {
      const res = await getSession(id);
      setSession(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //---------------------------------------
  // Load Guests
  //---------------------------------------

  const loadGuests = async () => {
    try {
      const [guestRes, unassignedRes] =
        await Promise.all([
          getGuests(id),
          getUnassignedGuests(id),
        ]);

      const mergedGuests = [
        ...guestRes.data,

        ...unassignedRes.data.map((guest) => ({
          ...guest,
          roomNo: "",
        })),
      ];

      setGuests(mergedGuests);

    } catch (err) {
      console.log(err);
    }
  };

  //---------------------------------------
  // Toggle Guest Claim
  //---------------------------------------

  const handleToggle = async (guest) => {
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

      await loadGuests();
      await loadSession();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update guest."
      );
    }
  };

  //---------------------------------------
  // Loading
  //---------------------------------------

  if (!session) {
    return <h2>Loading...</h2>;
  }

  //---------------------------------------
  // Search
  //---------------------------------------

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

  //---------------------------------------
  // UI
  //---------------------------------------

  return (
    <div className="session-page">

      <SessionHeader session={session} />

      <SessionStats session={session} />

      {/* Action Cards */}
      <div className="action-grid">

        <UploadCard
          session={session}
          onUploadSuccess={() => {
            loadSession();
            loadGuests();
          }}
          onAddUnassigned={() =>
            setShowAddModal(true)
          }
        />

        {/* QR Button */}
        <SessionQRButton
          session={session}
        />

        <StaffAccessCard
          session={session}
        />

        <ReportCard
          sessionId={id}
        />

        <EndSessionCard
          session={session}
          onSessionEnded={() => {
            loadSession();
            loadGuests();
          }}
        />

      </div>

      {/* Search */}
      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      {/* Pending Guests */}
<div className="dashboard-section">
  <h2>
    Pending{" "}
    <span className="dashboard-section-count">
      {filteredGuests.filter(
        (guest) => !guest.claimed
      ).length}
    </span>
  </h2>

  <GuestList
    guests={filteredGuests.filter(
      (guest) => !guest.claimed
    )}
    onToggle={handleToggle}
    disabled={session.status === "Closed"}
  />
</div>

{/* Served Guests */}
<div className="dashboard-section">
  <h2>
    Served{" "}
    <span className="dashboard-section-count">
      {filteredGuests.filter(
        (guest) => guest.claimed
      ).length}
    </span>
  </h2>

  <GuestList
    guests={filteredGuests.filter(
      (guest) => guest.claimed
    )}
    onToggle={handleToggle}
    disabled={session.status === "Closed"}
  />
</div>

      {/* Add Unassigned Modal */}
      <AddUnassignedModal
        open={showAddModal}
        sessionId={session._id}
        onClose={() =>
          setShowAddModal(false)
        }
        onSuccess={() => {
          loadGuests();
          loadSession();
        }}
      />

    </div>
  );
}

export default SessionDetails;