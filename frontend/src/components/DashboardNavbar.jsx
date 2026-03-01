import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/dashboardNavbar.css";
import queueLogo from "../assets/queue.png";

// Doctor Mapping based on user_id from DB
const doctorMap = {
  2: "General Physician",
  3: "Cardiologist",
  4: "Dermatologist",
  5: "Orthopedic",
  6: "Pediatrician",
};

const DashboardNavbar = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    const storedId = localStorage.getItem("id"); // 🔥 THIS is important
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      setName(storedName);
      setRole(storedRole);
      setUserId(storedId); // 🔥 set doctor id
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="dash-nav">
      {/* LEFT SIDE */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={queueLogo} className="nav-logo" alt="Queue Logo" />
        <h2 className="nav-title">QueueFlow</h2>
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        {!isLoggedIn && (
          <>
            <button className="nav-login" onClick={() => navigate("/login")}>
              Login
            </button>

            <button className="nav-signup" onClick={() => navigate("/register")}>
              Sign Up
            </button>
          </>
        )}

        {isLoggedIn && (
          <>
            <button className="nav-dashboard" onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>

            <div className="user-badge">
              <span className="user-name">
                {/* 🔥 Show specialization based on user_id */}
                {doctorMap[userId] || name}
              </span>

              <span className="user-role">{role || "Role"}</span>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;