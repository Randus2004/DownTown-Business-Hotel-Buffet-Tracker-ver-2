import GuestItem from "./GuestItem";

function RoomCard({
  room,
  onToggle,
  disabled = false,
}) {
  const isUnassigned =
    room.roomNo === "UNASSIGNED";

  return (
    <div className="room-card">
      <div className="room-header">
        <h3>
          {isUnassigned
            ? "⚠️ Unassigned Guests"
            : `Room ${room.roomNo}`}
        </h3>

        <span>PAX : {room.guests.length}</span>
      </div>

      {room.guests.map((guest) => (
        <GuestItem
          key={guest._id}
          guest={guest}
          onToggle={onToggle}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default RoomCard;