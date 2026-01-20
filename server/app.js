require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// IMPORTANT: route prefix
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server started on port ${process.env.PORT}`);
});
