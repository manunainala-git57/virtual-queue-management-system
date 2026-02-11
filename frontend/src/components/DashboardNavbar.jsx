import { useNavigate } from "react-router-dom";
import "./dashboardNavbar.css";
import queueLogo from "../assets/queue.png";

const DashboardNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="dash-nav">
      {/* LEFT SIDE */}
      <div className="nav-left" onClick={() => navigate("/")}>
       <img src={queueLogo} className="nav-logo" alt="Queue Logo" />

        <h2 className="nav-title">Queue</h2>
      </div>

      {/* RIGHT SIDE  */}
      <div className="nav-right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
