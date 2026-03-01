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

            //  Emit real-time update
            const io = req.app.get("io");
            io.emit("queueUpdated");

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

// SERVE TOKEN (EMPLOYEE)
exports.serveToken = (req, res) => {
  const tokenId = req.params.tokenId;
  const employeeUserId = req.user.id;

  const employeeSql = `
    SELECT id FROM employees WHERE user_id = ?
  `;

  db.query(employeeSql, [employeeUserId], (err, empResult) => {
    if (err) {
      console.error("Employee fetch error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (empResult.length === 0) {
      return res.status(403).json({ message: "Not an employee" });
    }

    const employeeId = empResult[0].id;

    const tokenSql = `
      SELECT id, employee_id, queue_position
      FROM tokens
      WHERE id = ? AND status = 'WAITING'
    `;

    db.query(tokenSql, [tokenId], (err, tokenResult) => {
      if (err) {
        console.error("Token fetch error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (tokenResult.length === 0) {
        return res.status(404).json({ message: "Token not found or already served" });
      }

      const token = tokenResult[0];

      if (token.employee_id !== employeeId) {
        return res.status(403).json({ message: "Cannot serve this token" });
      }

      const servedPosition = token.queue_position;

      const serveSql = `
        UPDATE tokens SET status = 'SERVED' WHERE id = ?
      `;

      db.query(serveSql, [tokenId], (err) => {
        if (err) {
          console.error("Serve token error:", err);
          return res.status(500).json({ message: "Server error" });
        }

        const shiftSql = `
          UPDATE tokens
          SET queue_position = queue_position - 1
          WHERE employee_id = ?
            AND status = 'WAITING'
            AND queue_position > ?
        `;

        db.query(shiftSql, [employeeId, servedPosition], (err) => {
          if (err) {
            console.error("Queue shift error:", err);
            return res.status(500).json({ message: "Server error" });
          }

          const recalcSql = `
            UPDATE tokens t
            JOIN employees e ON t.employee_id = e.id
            SET t.estimated_time = t.queue_position * e.avg_service_time
            WHERE t.employee_id = ?
              AND t.status = 'WAITING'
          `;

          db.query(recalcSql, [employeeId], (err) => {
            if (err) {
              console.error("Recalc error:", err);
              return res.status(500).json({ message: "Server error" });
            }

            //EMIT WEBSOCKET EVENT (ONLY AFTER SUCCESS)
            const io = req.app.get("io");
            io.emit("queueUpdated", {
              employeeId: employeeId,
              servedTokenId: tokenId
            });

            res.json({
              success: true,
              message: "Token served successfully",
            });
          });
        });
      });
    });
  });
};


// VIEW EMPLOYEE QUEUE along with some STATS (EMPLOYEE)(tokens that are booked by patients to this particular employee)
exports.getEmployeeQueue = (req, res) => {
  const employeeUserId = req.user.id;

  const employeeSql = `
    SELECT id, avg_service_time FROM employees WHERE user_id = ?
  `;

  db.query(employeeSql, [employeeUserId], (err, empResult) => {
    if (err) {
      console.error("Employee fetch error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (empResult.length === 0) {
      return res.status(403).json({ message: "Not an employee" });
    }

    const employeeId = empResult[0].id;
    const avgServiceTime = empResult[0].avg_service_time;

    // Fetch waiting queue
    const queueSql = `
      SELECT 
        t.id AS token_id,
        t.queue_position,
        t.estimated_time,
        u.name AS user_name
      FROM tokens t
      JOIN users u ON t.user_id = u.id
      WHERE t.employee_id = ?
        AND t.status = 'WAITING'
      ORDER BY t.queue_position ASC
    `;

    db.query(queueSql, [employeeId], (err, queueResult) => {
      if (err) {
        console.error("Queue fetch error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      // Count served today
      const servedTodaySql = `
        SELECT COUNT(*) AS servedToday
        FROM tokens
        WHERE employee_id = ?
          AND status = 'SERVED'
          AND DATE(updated_at) = CURDATE()
      `;

      db.query(servedTodaySql, [employeeId], (err, servedResult) => {
        if (err) {
          console.error("Served count error:", err);
          return res.status(500).json({ message: "Server error" });
        }

        // Total today
        const totalTodaySql = `
          SELECT COUNT(*) AS totalToday
          FROM tokens
          WHERE employee_id = ?
            AND DATE(created_at) = CURDATE()
        `;

        db.query(totalTodaySql, [employeeId], (err, totalResult) => {
          if (err) {
            console.error("Total count error:", err);
            return res.status(500).json({ message: "Server error" });
          }

          res.json({
            success: true,
            queue: queueResult,
            stats: {
              inQueue: queueResult.length,
              servedToday: servedResult[0].servedToday,
              totalToday: totalResult[0].totalToday,
              avgServiceTime: avgServiceTime,
            },
          });
        });
      });
    });
  });
};



// VIEW MY TOKEN (USER)
exports.getMyToken = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      t.id AS token_id,
      t.token_number,
      t.queue_position,
      t.estimated_time,
      e.employee_name AS doctor
    FROM tokens t
    JOIN employees e ON t.employee_id = e.id
    WHERE t.user_id = ?
      AND t.status = 'WAITING'
    LIMIT 1
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("My token fetch error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.json({
        success: true,
        message: "No active token",
        token: null,
      });
    }

    res.json({
      success: true,
      token: result[0],
    });
  });
};


