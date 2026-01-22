const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// This API is only for USER registration
exports.register = (req, res) => {
const { name, email, mobile, password } = req.body;

const role = "USER";
  // 1. Validation
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 2. Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 3. Insert user
  const sql =
    "INSERT INTO users (name, email, mobile, password, role) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [name, email, mobile, hashedPassword, role],
    (err) => {
      if (err) {
        console.error(err);
        return res
          .status(400)
          .json({ message: "Email or mobile already exists" });
      }

      res.status(201).json({
        message: "User registered successfully",
      });
    }
  );
};


// LOGIN USER

exports.login = (req, res) => {
  const { email, password } = req.body;

  // 1. Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // 2. Find user
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    // 3. Compare password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 4. Create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  });
};
