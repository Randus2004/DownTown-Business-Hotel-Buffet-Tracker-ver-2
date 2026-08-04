import "../../css/navbar.css";

function Navbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>DownTown Business Hotel</h2>
        <p>Buffet Management System</p>
      </div>

      <div className="navbar-right">
        <span>{today}</span>
      </div>
    </nav>
  );
}

export default Navbar;