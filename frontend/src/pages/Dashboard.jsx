import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import DashboardNavbar from "../components/DashboardNavbar";
import socket from "../socket";

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeToken, setActiveToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showReminder, setShowReminder] = useState(false);


  const token = localStorage.getItem("token");
  const hasActiveToken = !!activeToken;

  useEffect(() => {
    setUserName(localStorage.getItem("name"));
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success) setDoctors(data.doctors);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, [token]);




useEffect(() => {
  fetchMyToken();

  socket.on("queueUpdated", () => {
    console.log("User received update");
    fetchMyToken();
  });

  return () => {
    socket.off("queueUpdated");
  };
}, []);



  const handleTakeToken = async () => {
    if (!selectedDoctor) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: selectedDoctor.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store token
        setActiveToken(data.token);

        // Show animated popup
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      } else {
        if (data.message === "You already have an active token") {
          await fetchMyToken();
        } else {
          alert(data.message || "Failed to take token");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyToken = async () => {
  try {
    const res = await fetch("http://localhost:5000/tokens/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok && data.token) {
      setActiveToken(data.token);
    }else{
      setActiveToken(null);
    }
  } catch (err) {
    console.error(err);
  }
};


  // Reminder popup
  useEffect(() => {
    if (activeToken) {
      const mins = parseInt(activeToken.estimated_time);
      if (mins <= 10) {
        setShowReminder(true);
      }else {
      setShowReminder(false);
    }
    }
    else {
    setShowReminder(false);
  }

  }, [activeToken]);

  return (
    <>
      <DashboardNavbar />

      {/* POPUP MESSAGE */}
      {showPopup && (
        <div className="popup-success">
          🎉 Congratulations {userName}! <br />
          Your token is confirmed for{" "}
          <strong>{selectedDoctor?.employee_name}</strong>.
        </div>
      )}

      {/* WELCOME */}
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome, {userName}! 👋</h1>
        <p className="welcome-sub">Book your appointment and track your queue position</p>
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-layout">

        {/* LEFT SIDE */}
        <div className="left-column">
          <div className="booking-card">
            <h2>Book Appointment</h2>
            <p>Select a doctor to take token</p>

            <div className="doctor-grid">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className={`doctor-card ${selectedDoctor?.id === doc.id ? "active" : ""}`}
                  onClick={() => setSelectedDoctor(doc)}
                >
                  <h4>{doc.employee_name}</h4>
                  <span>Avg {doc.avg_service_time} mins</span>
                </div>
              ))}
            </div>

            <button
              className="take-token-btn"
              disabled={!selectedDoctor || loading || hasActiveToken}
              onClick={handleTakeToken}
            >
              {loading ? "Generating..." : hasActiveToken ? "Token Already Booked" : "Take Token"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-column">
          {activeToken ? (
            <div className="token-card">
              <h3 className="token-title">Your Active Token</h3>

              <div className="token-badge">#{activeToken.token_number}</div>

              <h4 className="doctor-name">{activeToken.doctor}</h4>

              <div className="token-details">
                <div className="detail-box">
                  <span>Queue Position</span>
                  <strong>{activeToken.queue_position}</strong>
                </div>

                <div className="detail-box">
                  <span>Estimated Time</span>
                  <strong>{activeToken.estimated_time}</strong>
                </div>
              </div>

              <span className="status waiting">Waiting</span>
            </div>
          ) : (
            <div className="token-card">
              <h3 className="token-title">Your Active Token</h3>
              <p className="no-token">No active token</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;