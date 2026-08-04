import "../../css/statcard.css";

function StatCard({ title, value }) {
  return (
    <div className="stat-card">

      <h4>{title}</h4>

      <h1>{value}</h1>

    </div>
  );
}

export default StatCard;