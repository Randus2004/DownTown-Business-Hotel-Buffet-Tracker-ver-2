import "../../css/uploadCard.css";

function StaffAccessCard({ session }) {
  const link = `${window.location.origin}/staff/${session.sessionCode}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      alert("Staff link copied successfully!");
    } catch (err) {
      alert("Failed to copy link.");
    }
  };

  const openStaffPage = () => {
    window.open(link, "_blank");
  };

  return (
    <div className="action-card">
      <h3>🔗 Staff Access</h3>

      <p className="staff-link">{link}</p>

      <div className="staff-buttons">
        <button onClick={copyLink}>
          📋 Copy Link
        </button>

        <button onClick={openStaffPage}>
          🚀 Open Staff Page
        </button>
      </div>
    </div>
  );
}

export default StaffAccessCard;