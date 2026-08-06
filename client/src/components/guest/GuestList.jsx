import RoomCard from "./RoomCard";
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

  // Sort unassigned guests
  unassigned.sort((a, b) => {
    // Main guests first
    if (a.guestNumber !== b.guestNumber) {
      return a.guestNumber - b.guestNumber;
    }

    // Then alphabetically
    return a.guestName.localeCompare(b.guestName);
  });

  return (
    <div className="guest-list">
      <h2>Guests</h2>

      {/* Normal Rooms */}
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

      {/* Unassigned Guests */}
      {unassigned.length > 0 && (
        <>
          <h2 className="unassigned-title">
            ⚠️ Unassigned Guests
          </h2>

          <RoomCard
            room={{
              roomNo: "UNASSIGNED",
              guests: unassigned,
            }}
            onToggle={onToggle}
            disabled={disabled}
          />
        </>
      )}
    </div>
  );
}

export default GuestList;