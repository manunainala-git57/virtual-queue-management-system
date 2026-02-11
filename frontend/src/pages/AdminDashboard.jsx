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
  const [todayStats, setTodayStats] = useState({});
  const [doctorLoad, setDoctorLoad] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [activeDoctors, setActiveDoctors] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const d1 = await fetch("http://localhost:5000/admin/tokens/today", { headers });
        setTodayStats(await d1.json());

        const d2 = await fetch("http://localhost:5000/admin/doctor-load", { headers });
        const docData = await d2.json();
        setDoctorLoad(docData.doctors || []);

        const d3 = await fetch("http://localhost:5000/admin/tokens/weekly", { headers });
        const w = await d3.json();
        setWeeklyStats(Array.isArray(w) ? w : []);

        const d4 = await fetch("http://localhost:5000/admin/active-employees", { headers });
        const activeData = await d4.json();
        setActiveDoctors(activeData.count || 0);

      } catch (err) {
        console.error("Admin Dashboard Error:", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <>
      {/* 🔹 Top Navbar */}
      <DashboardNavbar />

      <div className="admin-page dashboard-page-content">

        {/* TITLE */}
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="subtitle">Overview of your organization's queue performance</p>

        {/* SUMMARY CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h2>{todayStats.total || 0}</h2>
            <p>Total Today</p>
          </div>

          <div className="stat-card">
            <h2>{todayStats.served || 0}</h2>
            <p>Served</p>
          </div>

          <div className="stat-card">
            <h2>{todayStats.waiting || 0}</h2>
            <p>Waiting</p>
          </div>

          <div className="stat-card">
            <h2>{todayStats.avgWait || 0}m</h2>
            <p>Avg. Wait Time</p>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="charts-row">

          {/* WEEKLY BAR CHART */}
          <div className="chart-card">
            <h3>📊 Weekly Overview</h3>
            <p className="chart-subtitle">Customer traffic for the past 7 days</p>

            <div className="chart-wrapper">
              <Bar
                data={{
                  labels: (weeklyStats || []).map((d) => d.date),
                  datasets: [
                    {
                      label: "Tokens",
                      data: (weeklyStats || []).map((d) => d.count),
                      backgroundColor: "#3b82f6",
                      borderRadius: 8,
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
          </div>

          {/* TODAY'S STATUS DOUGHNUT */}
          <div className="chart-card">
            <h3>📈 Today's Status</h3>
            <p className="chart-subtitle">Service completion ratio</p>

            <div className="chart-wrapper donut">
              <Doughnut
                data={{
                  labels: ["Served", "Waiting"],
                  datasets: [
                    {
                      data: [todayStats.served || 0, todayStats.waiting || 0],
                      backgroundColor: ["#22c55e", "#f59e0b"],
                      borderWidth: 1,
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

        </div>

        {/* EMPLOYEE PERFORMANCE */}
        <div className="section">
          <h2 className="section-title">👨‍⚕️ Employee Performance</h2>
          <p className="chart-subtitle">Today's active employees</p>

          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Queue</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {(doctorLoad || []).map((doc) => (
                <tr key={doc.employee_id}>
                  <td>{doc.employee_name}</td>
                  <td>{doc.department}</td>
                  <td>{doc.waiting}</td>
                  <td><span className="badge active">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TODAY'S TOKENS */}
        <div className="section">
          <h2 className="section-title">🎟️ Today's Tokens</h2>

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
              {(todayStats.tokens || []).map((tk, index) => (
                <tr key={index}>
                  <td>#{tk.token_number}</td>
                  <td>{tk.user_name}</td>
                  <td>{tk.employee_name}</td>
                  <td>{tk.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;
