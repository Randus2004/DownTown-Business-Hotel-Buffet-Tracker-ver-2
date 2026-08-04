import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SessionHeader from "../../components/session/SessionHeader";
import SessionStats from "../../components/session/SessionStats";
import UploadCard from "../../components/session/UploadCard";
import StaffAccessCard from "../../components/session/StaffAccessCard";
import GuestList from "../../components/guest/GuestList";

import { getSession } from "../../services/sessionService";
import {
  getGuests,
  updateGuestStatus,
} from "../../services/guestService";
import SearchBar from "../../components/guest/SearchBar";
import ReportCard from "../../components/session/ReportCard";
import EndSessionCard from "../../components/session/EndSessionCard";


import "../../css/SessionDetails.css";

function SessionDetails() {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");

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
      const res = await getGuests(id);
      setGuests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

 const handleToggle = async (guest) => {
  try {
    await updateGuestStatus(
      guest._id,
      !guest.claimed
    );

    // Refresh guests and stats
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
  guests={guests.filter((guest) => {
    const keyword = search.toLowerCase();

    return (
      guest.roomNo.toLowerCase().includes(keyword) ||
      guest.guestName.toLowerCase().includes(keyword)
    );
  })}
  onToggle={handleToggle}
  disabled={session.status === "Closed"}
/>


    </div>
  );


}

export default SessionDetails;