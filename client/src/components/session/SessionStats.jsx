import StatCard from "../ui/StatCard";

function SessionStats({ session }) {
  return (
    <div className="stats">
      <StatCard
        title="Guests"
        value={session.totalGuests}
      />

      <StatCard
        title="Claimed"
        value={session.claimedGuests}
      />

      <StatCard
        title="Pending"
        value={
          session.totalGuests -
          session.claimedGuests
        }
      />
    </div>
  );
}

export default SessionStats;