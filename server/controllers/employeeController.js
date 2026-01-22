const db = require("../config/db");

//GET ACTIVE DOCTORS (For Users & Admin)

exports.getActiveDoctors = (req, res) => {
  const sql = `
    SELECT id, employee_name, avg_service_time
    FROM employees
    WHERE is_active = true
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json({
      success: true,
      doctors: results,
    });
  });
};
