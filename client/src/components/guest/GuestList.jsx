import RoomCard from "./RoomCard";
import "../../css/guest.css";

function GuestList({
  guests = [],
  onToggle,
  disabled = false,
}) {
  const grouped = guests.reduce((acc, guest) => {
    if (!acc[guest.roomNo]) {
      acc[guest.roomNo] = [];
    }

    acc[guest.roomNo].push(guest);

    return acc;
  }, {});

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
    </div>
  );
}

export default GuestList;