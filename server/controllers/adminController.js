const db = require("../config/db");

// TODAY'S TOKEN SUMMARY (ADMIN)
exports.getTodayTokenSummary = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS total_tokens,
      SUM(CASE WHEN status = 'SERVED' THEN 1 ELSE 0 END) AS served,
      SUM(CASE WHEN status = 'WAITING' THEN 1 ELSE 0 END) AS waiting
    FROM tokens
    WHERE DATE(created_at) = CURDATE()
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Today summary error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json({
      success: true,
      data: result[0],
    });
  });
};


// DOCTOR-WISE LOAD (ADMIN)

exports.getDoctorLoad = (req, res) => {
  const sql = `
    SELECT 
      e.employee_name AS doctor,
      COUNT(t.id) AS total_tokens,
      SUM(CASE WHEN t.status = 'WAITING' THEN 1 ELSE 0 END) AS waiting,
      SUM(CASE WHEN t.status = 'SERVED' THEN 1 ELSE 0 END) AS served
    FROM employees e
    LEFT JOIN tokens t 
      ON e.id = t.employee_id 
      AND DATE(t.created_at) = CURDATE()
    GROUP BY e.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Doctor load error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json({
      success: true,
      doctors: result,
    });
  });
};

// TODAY'S ACTIVE EMPLOYEES (ADMIN)
exports.getActiveEmployees = (req, res) => {
  const sql = `
    SELECT DISTINCT 
      e.employee_name
    FROM employees e
    JOIN tokens t ON e.id = t.employee_id
    WHERE DATE(t.created_at) = CURDATE()
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Active employees error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json({
      success: true,
      active_employees: result.map(row => row.employee_name),
    });
  });
};

// WEEKLY TOKEN TREND (ADMIN)
exports.getWeeklyTokens = (req, res) => {
  const sql = `
    SELECT 
      DATE(created_at) AS date,
      COUNT(*) AS total_tokens
    FROM tokens
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Weekly tokens error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json({
      success: true,
      trend: result,
    });
  });
};
