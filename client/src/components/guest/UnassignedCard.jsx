import GuestItem from "./GuestItem";

function UnassignedCard({
  guests,
  onToggle,
  disabled = false,
}) {
  // Group by the main guest (guestNumber = 1)
  const groups = [];
  let currentGroup = null;

  guests.forEach((guest) => {
    if (guest.guestNumber === 1) {
      currentGroup = {
        leader: guest,
        guests: [guest],
      };

      groups.push(currentGroup);
    } else if (currentGroup) {
      currentGroup.guests.push(guest);
    }
  });

  return (
    <div className="room-card">
      <div className="room-header">
        <h3>⚠️ Unassigned Guests</h3>

        <span>
          PAX : {guests.length}
        </span>
      </div>

      {groups.map((group) => (
        <div
          key={group.leader._id}
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              color: "#444",
              margin: "10px 0",
            }}
          >
            👤 {group.leader.guestName}
          </div>

          {group.guests.map((guest) => (
            <GuestItem
              key={guest._id}
              guest={guest}
              onToggle={onToggle}
              disabled={disabled}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default UnassignedCard;