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


app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
