const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getActiveDoctors } = require("../controllers/employeeController");

// Doctor selection / monitoring API
router.get("/", authMiddleware, getActiveDoctors);

module.exports = router;
