require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
