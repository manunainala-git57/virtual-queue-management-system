import { useEffect, useState } from "react";
import "../styles/employeeDashboard.css";
import DashboardNavbar from "../components/DashboardNavbar";

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    inQueue: 0,
    servedToday: 0,
    avgServiceTime: 0,
    totalToday: 0,
  });

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ------------------------------------
  // FETCH EMPLOYEE QUEUE + STATS
  // ------------------------------------
  const fetchQueue = async () => {
    try {
      const res = await fetch("http://localhost:5000/employee/queue", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setStats({
          inQueue: data.inQueue,
          servedToday: data.servedToday,
          avgServiceTime: data.avgServiceTime,
          totalToday: data.totalToday,
        });

        setQueue(data.customerQueue);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  // ------------------------------------
  // SERVE NEXT
  // ------------------------------------
  const serveNext = async () => {
    if (queue.length === 0) return;

    const next = queue[0];

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/employee/next/${next.id}`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.ok) fetchQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // MARK AS SERVED
  // ------------------------------------
  const serveToken = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/employee/complete/${id}`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.ok) fetchQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔹 Top Navbar */}
      <DashboardNavbar />

      {/* MAIN PAGE CONTENT */}
      <div className="emp-dashboard-container dashboard-page-content">
        {/* PAGE TITLE */}
        <h1 className="page-title">Employee Dashboard</h1>
        <p className="page-subtitle">Manage your customer queue efficiently</p>

        {/* TOP SUMMARY CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h2>{stats.inQueue}</h2>
            <p>In Queue</p>
          </div>

          <div className="stat-card">
            <h2>{stats.servedToday}</h2>
            <p>Served Today</p>
          </div>

          <div className="stat-card">
            <h2>{stats.avgServiceTime}m</h2>
            <p>Avg. Service Time</p>
          </div>

          <div className="stat-card">
            <h2>{stats.totalToday}</h2>
            <p>Total Today</p>
          </div>
        </div>

        {/* CUSTOMER QUEUE TABLE */}
        <div className="queue-card">
          <h2 className="queue-title">Customer Queue</h2>
          <p className="queue-subtitle">{queue.length} customers waiting</p>

          <table className="queue-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Customer Name</th>
                <th>Customers Ahead</th>
                <th>Estimated Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {queue.map((cust, index) => (
                <tr key={cust.id}>
                  <td className="token-col">#{cust.token_number}</td>
                  <td>{cust.user_name}</td>
                  <td>{index} people</td>
                  <td>{cust.estimatedTime}</td>

                  <td>
                    {index === 0 ? (
                      <span className="badge next">Next</span>
                    ) : (
                      <span className="badge wait">Waiting</span>
                    )}
                  </td>

                  <td>
                    {index === 0 ? (
                      <button
                        className="serve-btn"
                        onClick={() => serveToken(cust.id)}
                      >
                        Serve
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* SERVE NEXT BUTTON */}
          {queue.length > 0 && (
            <button className="serve-next-btn" onClick={serveNext}>
              Serve Next
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
