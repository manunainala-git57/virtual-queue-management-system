import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import DashboardNavbar from "../components/DashboardNavbar";

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeToken, setActiveToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) setDoctors(data.doctors);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, [token]);

  // Take token
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
        setActiveToken(data.token);
      } else {
        alert(data.message || "Failed to take token");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reminder popup
  useEffect(() => {
    if (activeToken) {
      const mins = parseInt(activeToken.estimated_time);
      if (mins <= 10) {
        setShowReminder(true);
      }
    }
  }, [activeToken]);

  return (
    <>
      {/* TOP NAVBAR */}
      <DashboardNavbar />

      <div className="dashboard-page-content dashboard">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <h2>Book Appointment</h2>
          <p>Select a doctor to take token</p>

          <div className="doctor-grid">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className={`doctor-card ${
                  selectedDoctor?.id === doc.id ? "active" : ""
                }`}
                onClick={() => setSelectedDoctor(doc)}
              >
                <h4>{doc.employee_name}</h4>
                <span>Avg {doc.avg_service_time} mins</span>
              </div>
            ))}
          </div>

          <button
            className="take-token-btn"
            disabled={!selectedDoctor || loading}
            onClick={handleTakeToken}
          >
            {loading ? "Generating..." : "Take Token"}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <h3>Your Active Token</h3>

          {activeToken ? (
            <div className="token-card">
              <div className="token-badge">
                #{activeToken.token_number}
              </div>

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
            <p className="no-token">No active token</p>
          )}
        </div>

        {/* REMINDER POPUP */}
        {showReminder && (
          <div className="reminder-popup">
            ⏰ Your appointment is in 10 minutes. Please reach the venue.
            <button onClick={() => setShowReminder(false)}>✕</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
