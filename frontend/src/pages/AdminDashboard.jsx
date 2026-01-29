import { useEffect, useState } from "react";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  const [todayStats, setTodayStats] = useState({});
  const [doctorLoad, setDoctorLoad] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [activeDoctors, setActiveDoctors] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const fetchData = async () => {
      try {
        const todayRes = await fetch(
          "http://localhost:5000/admin/tokens/today",
          { headers }
        );
        const todayData = await todayRes.json();
        setTodayStats(todayData);

        const loadRes = await fetch(
          "http://localhost:5000/admin/doctor-load",
          { headers }
        );
        const loadData = await loadRes.json();
        setDoctorLoad(loadData.doctors || []);

        const weeklyRes = await fetch(
          "http://localhost:5000/admin/tokens/weekly",
          { headers }
        );
        const weeklyData = await weeklyRes.json();
        setWeeklyStats(weeklyData || []);

        const activeRes = await fetch(
          "http://localhost:5000/admin/active-employees",
          { headers }
        );
        const activeData = await activeRes.json();
        setActiveDoctors(activeData.count || 0);
      } catch (err) {
        console.error("Admin dashboard error:", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">Hospital Queue Analytics Overview</p>

      {/* Top cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tokens Today</h3>
          <p>{todayStats.total || 0}</p>
        </div>

        <div className="stat-card served">
          <h3>Served</h3>
          <p>{todayStats.served || 0}</p>
        </div>

        <div className="stat-card waiting">
          <h3>Waiting</h3>
          <p>{todayStats.waiting || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Active Doctors</h3>
          <p>{activeDoctors}</p>
        </div>
      </div>

      {/* Doctor Load */}
      <div className="section">
        <h2>Doctor-wise Patient Load</h2>
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Total Tokens</th>
              <th>Served</th>
              <th>Waiting</th>
            </tr>
          </thead>
          <tbody>
            {doctorLoad.map((doc) => (
              <tr key={doc.employee_id}>
                <td>{doc.employee_name}</td>
                <td>{doc.total}</td>
                <td>{doc.served}</td>
                <td>{doc.waiting}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Weekly Trends */}
      <div className="section">
        <h2>Weekly System Usage</h2>
        <div className="weekly-grid">
          {weeklyStats.map((day) => (
            <div key={day.date} className="day-card">
              <h4>{day.date}</h4>
              <p>{day.count} tokens</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
