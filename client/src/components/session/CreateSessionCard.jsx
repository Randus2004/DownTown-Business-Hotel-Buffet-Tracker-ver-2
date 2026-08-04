import "../../css/createSessionCard.css";

function CreateSessionCard({ onClick }) {
  return (
    <div className="create-session-card" onClick={onClick}>
      <div className="plus">+</div>

      <h3>New Session</h3>

      <p>Create a new buffet session</p>
    </div>
  );
}

export default CreateSessionCard;