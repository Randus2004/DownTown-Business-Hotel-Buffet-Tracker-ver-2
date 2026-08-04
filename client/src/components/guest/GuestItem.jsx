import "../../css/guest.css";

function GuestItem({
  guest,
  onToggle,
  disabled = false,
}) {
  return (
    <label
      className={`guest-item ${
        disabled ? "disabled" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={guest.claimed}
        disabled={disabled}
        onChange={() => onToggle(guest)}
      />

      <span>{guest.guestName}</span>
    </label>
  );
}

export default GuestItem;