import { useEffect, useState } from "react";
import "../styles/adminDashboard.css";
import DashboardNavbar from "../components/DashboardNavbar";

// CHART IMPORTS
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [todayStats, setTodayStats] = useState({
    total_tokens: 0,
    served: 0,
    waiting: 0,
    avgWait: 0,
    tokens: [],
  });

  const [doctorLoad, setDoctorLoad] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [activeEmployees, setActiveEmployees] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    const fetchData = async () => {
      try {
        /* ---------------------- TODAY STATS ---------------------- */
        const t1 = await fetch("http://localhost:5000/admin/tokens/today", { headers });
        const today = await t1.json();
        if (today.success) {
          setTodayStats({
            total_tokens: today.data.total_tokens,
            served: today.data.served,
            waiting: today.data.waiting,
            avgWait: 0,
            tokens: today.data.tokens || [],
          });
        }

        /* ---------------------- DOCTOR LOAD ---------------------- */
        const t2 = await fetch("http://localhost:5000/admin/doctor-load", { headers });
        const doctorData = await t2.json();
        if (doctorData.success) setDoctorLoad(doctorData.doctors);

        /* ---------------------- WEEKLY STATS ---------------------- */
        const t3 = await fetch("http://localhost:5000/admin/tokens/weekly", { headers });
        const weekly = await t3.json();
        if (weekly.success) setWeeklyStats(weekly.trend);

        /* ---------------------- ACTIVE EMPLOYEES ---------------------- */
        const t4 = await fetch("http://localhost:5000/admin/active-employees", { headers });
        const active = await t4.json();
        if (active.success) setActiveEmployees(active.active_employees);

      } catch (err) {
        console.error("Admin Dashboard Error:", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <>
      <DashboardNavbar />

      <div className="admin-page dashboard-page-content">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="subtitle">Monitor system performance in real-time</p>

        {/* TOP STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h2>{todayStats.total_tokens}</h2>
            <p>Total Tokens</p>
          </div>

          <div className="stat-card">
            <h2>{todayStats.served}</h2>
            <p>Served</p>
          </div>

          <div className="stat-card">
            <h2>{todayStats.waiting}</h2>
            <p>Waiting</p>
          </div>

          <div className="stat-card">
            <h2>0m</h2>
            <p>Avg Wait</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="charts-row">

          {/* WEEKLY CHART */}
          <div className="chart-card">
            <h3>📊 Weekly Overview</h3>
            <p className="chart-subtitle">Customer traffic for the past 7 days</p>

            <Bar
              data={{
                labels: weeklyStats.map((w) =>
                  new Date(w.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                ),
                datasets: [
                  {
                    label: "Tokens",
                    data: weeklyStats.map((w) => w.total_tokens),
                    backgroundColor: "#3b82f6",
                    borderRadius: 10,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>

          {/* DOUGHNUT CHART */}
          <div className="chart-card">
            <h3>📈 Today's Status</h3>
            <p className="chart-subtitle">Service completion ratio</p>

            <Doughnut
              data={{
                labels: ["Served", "Waiting"],
                datasets: [
                  {
                    data: [todayStats.served, todayStats.waiting],
                    backgroundColor: ["#22c55e", "#f59e0b"],
                  },
                ],
              }}
              options={{
                cutout: "70%",
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
        </div>

        {/* EMPLOYEE PERFORMANCE */}
        <div className="section">
          <h2 className="section-title">👨‍⚕️ Employee Performance</h2>
          <p className="chart-subtitle">
            Active employees: {activeEmployees.length}
          </p>

          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Queue</th>
                <th>Served</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {doctorLoad.map((doc, index) => (
                <tr key={index}>
                  <td>{doc.doctor}</td>
                  <td>{doc.doctor}</td>
                  <td>{doc.waiting}</td>
                  <td>{doc.served}</td>
                  <td>
                    <span className="badge active">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TODAY'S TOKENS */}
        <div className="section">
          <h2 className="section-title">🎟️ Today’s Tokens</h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Customer</th>
                <th>Employee</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {todayStats.tokens.length === 0 ? (
                <tr>
                  <td colSpan="4">No tokens today</td>
                </tr>
              ) : (
                todayStats.tokens.map((tk, index) => (
                  <tr key={index}>
                    <td>#{tk.token_number}</td>
                    <td>{tk.user_name}</td>
                    <td>{tk.employee_name}</td>
                    <td>{tk.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;