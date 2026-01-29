import { useEffect, useState } from "react";
import "../styles/employeeDashboard.css";

const EmployeeDashboard = () => {
  const [queue, setQueue] = useState([]);
  const [currentToken, setCurrentToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔹 Fetch employee queue
  const fetchQueue = async () => {
    try {
      const res = await fetch("http://localhost:5000/employee/queue", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setCurrentToken(data.currentToken);
        setQueue(data.upcomingTokens);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  // 🔹 Complete token
  const completeToken = async () => {
    if (!currentToken) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/employee/complete/${currentToken.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) fetchQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-dashboard">
      {/* HEADER */}
      <div className="emp-header">
        <h2>Employee Dashboard</h2>
        <span className="live-badge">LIVE</span>
      </div>

      {/* CURRENT TOKEN */}
      <div className="current-token-card">
        <h3>Current Token</h3>

        {currentToken ? (
          <>
            <div className="token-number">
              #{currentToken.token_number}
            </div>

            <div className="patient-info">
              <p><strong>Name:</strong> {currentToken.user_name}</p>
              <p><strong>Booked At:</strong> {currentToken.created_at}</p>
            </div>

            <button
              className="complete-btn"
              onClick={completeToken}
              disabled={loading}
            >
              {loading ? "Processing..." : "Mark as Completed"}
            </button>
          </>
        ) : (
          <p className="empty">No active token</p>
        )}
      </div>

      {/* UPCOMING QUEUE */}
      <div className="queue-section">
        <h3>Upcoming Queue</h3>

        {queue.length === 0 ? (
          <p className="empty">Queue is empty</p>
        ) : (
          <div className="queue-list">
            {queue.map((item, index) => (
              <div key={item.id} className="queue-card">
                <span className="queue-index">{index + 1}</span>
                <div className="queue-info">
                  <h4>Token #{item.token_number}</h4>
                  <p>{item.user_name}</p>
                </div>
                <span className="waiting-badge">Waiting</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
