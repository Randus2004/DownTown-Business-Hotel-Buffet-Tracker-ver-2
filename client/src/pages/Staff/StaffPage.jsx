import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SearchBar from "../../components/guest/SearchBar";
import GuestList from "../../components/guest/GuestList";

import {
  getGuests,
  updateGuestStatus,
} from "../../services/guestService";

import {
  getSessionByCode,
} from "../../services/sessionService";

import "../../css/staff.css";

function StaffPage() {
  const { sessionCode } = useParams();

  const [session, setSession] = useState(null);
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");

useEffect(() => {
  loadData();

  const interval = setInterval(() => {
    loadData();
  }, 5000);

  return () => clearInterval(interval);

}, [sessionCode]);

  const loadData = async () => {
    try {
      const sessionRes = await getSessionByCode(sessionCode);

      setSession(sessionRes.data);

      const guestRes = await getGuests(sessionRes.data._id);

      setGuests(guestRes.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = async (guest) => {
    // Prevent updates if session is closed
    if (session.status === "Closed") {
      return;
    }

    try {
      await updateGuestStatus(
        guest._id,
        !guest.claimed
      );

      loadData();

    } catch (err) {
      console.log(err);
    }
  };

  if (!session) {
    return <h2>Loading...</h2>;
  }

  const filteredGuests = guests.filter((guest) => {
    const keyword = search.toLowerCase();

    return (
      guest.roomNo.toLowerCase().includes(keyword) ||
      guest.guestName.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="staff-page">

      <h1>{session.buffetName}</h1>

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

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <GuestList
        guests={filteredGuests}
        onToggle={handleToggle}
        disabled={session.status === "Closed"}
      />

    </div>
  );
}

export default StaffPage;