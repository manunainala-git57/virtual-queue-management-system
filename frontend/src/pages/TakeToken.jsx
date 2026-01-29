import { useEffect, useState } from "react";
import "../styles/takeToken.css";

const TakeToken = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setDoctors(data.doctors);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, [token]);

  // Take token
  const handleTakeToken = async () => {
    if (!selectedDoctor) return;

    setLoading(true);
    setTokenInfo(null);

    try {
      const res = await fetch("http://localhost:5000/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employee_id: selectedDoctor.id }),
      });

      const data = await res.json();
      if (res.ok) setTokenInfo(data.token);
      else alert(data.message || "Failed to take token");
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="queue-dashboard">
      <div className="book-card">
        <h2>Book Appointment</h2>
        <p>Select a doctor to get your token and estimated wait time</p>

        {/* DOCTOR GRID */}
        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className={`doctor-card ${
                selectedDoctor?.id === doc.id ? "active" : ""
              }`}
              onClick={() => setSelectedDoctor(doc)}
            >
              <div className="doctor-info">
                <h4>{doc.employee_name}</h4>
                <span>Avg {doc.avg_service_time} mins</span>
              </div>

              <div className="queue-info">
                <p>{doc.queue_count || 0} waiting</p>
                <p>~ {(doc.queue_count || 1) * doc.avg_service_time} mins</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="take-token-btn"
          onClick={handleTakeToken}
          disabled={!selectedDoctor || loading}
        >
          {loading ? "Generating..." : "Take Token"}
        </button>

        {tokenInfo && (
          <div className="token-confirm">
            <h3>Token Confirmed!</h3>
            <div className="token-number">#{tokenInfo.token_number}</div>
            <p><b>Doctor:</b> {tokenInfo.doctor}</p>
            <p><b>Queue Position:</b> {tokenInfo.queue_position}</p>
            <p><b>Expected Time:</b> {tokenInfo.estimated_time}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeToken;
