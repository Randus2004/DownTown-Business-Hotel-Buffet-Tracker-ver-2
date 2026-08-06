import GuestItem from "./GuestItem";

function UnassignedCard({
  guests,
  onToggle,
  disabled = false,
}) {

  const grouped = {};

  guests.forEach((guest) => {

    if (!grouped[guest.groupId]) {
      grouped[guest.groupId] = [];
    }

    grouped[guest.groupId].push(guest);

  });

  return (
    <div className="room-card">

      <div className="room-header">
        <h3>⚠️ Unassigned Guests</h3>

        <span>
          PAX : {guests.length}
        </span>
      </div>

      {Object.values(grouped).map((group) => {

        group.sort(
          (a, b) =>
            a.guestNumber - b.guestNumber
        );

        const leader =
          group.find(
            (g) =>
              g.guestNumber === 1
          ) || group[0];

        return (
          <div
            key={leader.groupId}
            style={{
              marginBottom: 18,
              paddingBottom: 12,
              borderBottom:
                "1px solid #e5e5e5",
            }}
          >

            <div
              style={{
                fontWeight: 700,
                color: "#444",
                marginBottom: 8,
              }}
            >
              👤 {leader.guestName}
            </div>

            {group.map((guest) => (
              <GuestItem
                key={guest._id}
                guest={guest}
                onToggle={onToggle}
                disabled={disabled}
              />
            ))}

          </div>
        );

      })}

    </div>
  );
}

export default UnassignedCard;