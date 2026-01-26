import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import "../styles/adminDashboard.css";

const COLORS = ["#0088FE", "#FFBB28", "#FF4C4C"];

const AdminDashboard = () => {
  const [todaySummary, setTodaySummary] = useState({
    waiting: 0,
    serving: 0,
    served: 0,
  });
  const [doctorLoad, setDoctorLoad] = useState([]);
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        // Today's token summary
        const todayRes = await fetch("http://localhost:5000/admin/tokens/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (todayRes.ok) {
          const res = await todayRes.json();
          setTodaySummary(res.data);
        }

        // Doctor load
        const docRes = await fetch("http://localhost:5000/admin/doctor-load", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (docRes.ok) setDoctorLoad((await docRes.json()).doctors);

        // Active employees
        const activeRes = await fetch("http://localhost:5000/admin/active-employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (activeRes.ok) setActiveEmployees((await activeRes.json()).active_employees);

        // Weekly tokens
        const weeklyRes = await fetch("http://localhost:5000/admin/tokens/weekly", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (weeklyRes.ok) setWeeklyTrend((await weeklyRes.json()).trend);
      } catch (err) {
        console.error("Admin fetch error:", err);
        alert("Failed to load admin data");
      }
    };

    fetchData();
  }, [token]);

  const pieData = [
    { name: "Waiting", value: todaySummary.waiting },
    { name: "Serving", value: todaySummary.serving },
    { name: "Served", value: todaySummary.served },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Today's Summary */}
      <section className="dashboard-section summary-section">
        <h2>Today's Token Summary</h2>
        <div className="summary-cards">
          {["waiting", "serving", "served"].map((key, idx) => (
            <div className="card" key={idx}>
              <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <p>{todaySummary[key]}</p>
            </div>
          ))}
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Doctor Load */}
      <section className="dashboard-section">
        <h2>Doctor Load Today</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Total Tokens</th>
                <th>Waiting</th>
                <th>Served</th>
              </tr>
            </thead>
            <tbody>
              {doctorLoad.length > 0 ? (
                doctorLoad.map((doc, idx) => (
                  <tr key={idx}>
                    <td>{doc.doctor}</td>
                    <td>{doc.total_tokens}</td>
                    <td>{doc.waiting}</td>
                    <td>{doc.served}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Active Employees */}
      <section className="dashboard-section">
        <h2>Active Employees Today</h2>
        <ul className="active-employees">
          {activeEmployees.length > 0
            ? activeEmployees.map((emp, idx) => <li key={idx}>{emp}</li>)
            : "Loading..."}
        </ul>
      </section>

      {/* Weekly Trend */}
      <section className="dashboard-section">
        <h2>Weekly Token Trend</h2>
        <div className="linechart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_tokens"
                stroke="#0088FE"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
