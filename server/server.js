require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/tokens", tokenRoutes);
app.use("/admin", adminRoutes);


const PORT = process.env.PORT || 5000; // default to 5000 if .env missing

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
