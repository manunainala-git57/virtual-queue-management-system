const db = require("../config/db");
//Assign a new token to a user for a selected doctor, with correct queue position and estimated time, while preventing duplicates.

// TAKE TOKEN (USER)
exports.takeToken = (req, res) => {
  const userId = req.user.id;
  const { employee_id } = req.body; // the doctor ID selected by the user

  // Validate input
  if (!employee_id) {
    return res.status(400).json({ message: "employee_id is required" });
  }

  //  Check if user already has an active token
  const checkUserTokenSql = `
    SELECT id
    FROM tokens
    WHERE user_id = ? AND status = 'WAITING'
  `;

  db.query(checkUserTokenSql, [userId], (err, userTokens) => {
    if (err) {
      console.error("Error checking existing token:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (userTokens.length > 0) {
      return res
        .status(400)
        .json({ message: "You already have an active token" });
    }

    // Validate doctor & get avg service time
    const doctorSql = `
      SELECT employee_name, avg_service_time
      FROM employees
      WHERE id = ? AND is_active = true
    `;

    db.query(doctorSql, [employee_id], (err, doctorResult) => {
      if (err) {
        console.error("Error fetching doctor:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (doctorResult.length === 0) {
        return res.status(404).json({ message: "Doctor not found or inactive" });
      }

      const doctor = doctorResult[0];
      /* 
        doctor = {
                    employee_name: "Cardiologist",
                    avg_service_time: 15
                    }
      */

      //  Count waiting tokens for this doctor
      const countSql = `
        SELECT COUNT(*) AS waitingCount
        FROM tokens
        WHERE employee_id = ? AND status = 'WAITING'
      `;

      db.query(countSql, [employee_id], (err, countResult) => {
        if (err) {
          console.error("Error counting tokens:", err);
          return res.status(500).json({ message: "Server error" });
        }

        const waitingCount = countResult[0].waitingCount;
        /* 
            Suppose for employee_id = 2 there are already 3 waiting tokens.
            countResult = [
                        {
                            waitingCount: 3
                        }
                    ];

            waitingCount = countResult[0].waitingCount => 3;
        */

        //  Calculate queue details
        const queuePosition = waitingCount + 1; //4
        const tokenNumber = queuePosition; // 4
        const estimatedTime = queuePosition * doctor.avg_service_time; // 4 * 15 = 60 minutes

        //  Insert token
        const insertSql = `
          INSERT INTO tokens
          (user_id, employee_id, token_number, queue_position, estimated_time, status)
          VALUES (?, ?, ?, ?, ?, 'WAITING')
        `;

        db.query(
          insertSql,
          [
            userId,
            employee_id,
            tokenNumber,
            queuePosition,
            estimatedTime,
          ],
          (err) => {
            if (err) {
              console.error("Error inserting token:", err);
              return res.status(500).json({ message: "Server error" });
            }

            // Send response
            res.status(201).json({
              success: true,
              token: {
                token_number: tokenNumber,
                queue_position: queuePosition,
                estimated_time: `${estimatedTime} minutes`,
                doctor: doctor.employee_name,
              },
            });
          }
        );
      });
    });
  });
};
