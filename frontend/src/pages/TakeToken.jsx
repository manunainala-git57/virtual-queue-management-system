import { useEffect, useState } from "react";
import "../styles/takeToken.css";

const TakeToken = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch active doctors
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
        body: JSON.stringify({ employee_id: selectedDoctor }),
      });
      const data = await res.json();
      if (res.ok) setTokenInfo(data.token);
      else alert(data.message || "Failed to take token");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while taking token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="take-token-page">
      <div className="take-token-card">
        <h2>Take Your Token</h2>
        <p>Select a doctor to get your token and estimated wait time</p>

        <div className="select-group">
          <label>Choose Doctor</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">-- Select --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.employee_name} (Avg {doc.avg_service_time} min)
              </option>
            ))}
          </select>
        </div>

        <button
          className="take-token-btn"
          onClick={handleTakeToken}
          disabled={!selectedDoctor || loading}
        >
          {loading ? "Generating..." : "Take Token"}
        </button>

        {tokenInfo && (
          <div className="token-info">
            <h3>Your Token: {tokenInfo.token_number}</h3>
            <p>Doctor: {tokenInfo.doctor}</p>
            <p>Queue Position: {tokenInfo.queue_position}</p>
            <p>Estimated Time: {tokenInfo.estimated_time}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeToken;
