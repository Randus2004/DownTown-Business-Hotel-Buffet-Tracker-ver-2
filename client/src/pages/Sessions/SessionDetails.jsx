import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SessionHeader from "../../components/session/SessionHeader";
import SessionStats from "../../components/session/SessionStats";
import UploadCard from "../../components/session/UploadCard";
import StaffAccessCard from "../../components/session/StaffAccessCard";
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

  useEffect(() => {
    loadSession();
    loadGuests();

    const interval = setInterval(() => {
      loadSession();
      loadGuests();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const loadSession = async () => {
    try {
      const res = await getSession(id);
      setSession(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadGuests = async () => {
    try {
      const [guestRes, unassignedRes] = await Promise.all([
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

  if (!session) {
    return <h2>Loading...</h2>;
  }

  const filteredGuests = guests.filter((guest) => {
    const keyword = search.toLowerCase();

    return (
      (guest.roomNo || "")
        .toLowerCase()
        .includes(keyword) ||
      guest.guestName
        .toLowerCase()
        .includes(keyword)
    );
  });

  return (
    <div className="session-page">

      <SessionHeader session={session} />

      <SessionStats session={session} />

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

        <StaffAccessCard session={session} />

        <ReportCard sessionId={id} />

        <EndSessionCard
          session={session}
          onSessionEnded={() => {
            loadSession();
            loadGuests();
          }}
        />

      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <GuestList
        guests={filteredGuests}
        onToggle={handleToggle}
        disabled={session.status === "Closed"}
      />

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