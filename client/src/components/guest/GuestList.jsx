import RoomCard from "./RoomCard";
import UnassignedCard from "./UnassignedCard";
import "../../css/guest.css";

function GuestList({
  guests = [],
  onToggle,
  disabled = false,
}) {
  const grouped = {};
  let unassigned = [];

  guests.forEach((guest) => {
    const roomNo = (guest.roomNo || "").trim();

    if (roomNo === "") {
      unassigned.push(guest);
    } else {
      if (!grouped[roomNo]) {
        grouped[roomNo] = [];
      }

      grouped[roomNo].push(guest);
    }
  });

  // Sort room guests
  Object.values(grouped).forEach((roomGuests) => {
    roomGuests.sort((a, b) => a.guestNumber - b.guestNumber);
  });

  return (
    <div className="guest-list">
      <h2>Guests</h2>

      {Object.entries(grouped).map(([roomNo, roomGuests]) => (
        <RoomCard
          key={roomNo}
          room={{
            roomNo,
            guests: roomGuests,
          }}
          onToggle={onToggle}
          disabled={disabled}
        />
      ))}

      {unassigned.length > 0 && (
        <UnassignedCard
          guests={unassigned}
          onToggle={onToggle}
          disabled={disabled}
        />
      )}
    </div>
  );
}

export default GuestList;