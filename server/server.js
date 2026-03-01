require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
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
// DEBUG ROUTE — To check which database backend is using
app.get("/debug", (req, res) => {
  const db = require("./config/db");
  
  db.query("SELECT * FROM users", (err, rows) => {
    if (err) return res.json({ error: err });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 5000; // default to 5000 if .env missing


const server = http.createServer(app);



const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set("io", io); // make io accessible inside controllers

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
