const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/allowRoles");

const {
  getTodayTokenSummary,
  getDoctorLoad,
  getActiveEmployees,
  getWeeklyTokens,
} = require("../controllers/adminController");


//ADMIN ANALYTICS ROUTES

// Today's token summary
router.get(
  "/tokens/today",
  authMiddleware,
  allowRoles("ADMIN"),
  getTodayTokenSummary
);

// Doctor-wise load
router.get(
  "/doctor-load",
  authMiddleware,
  allowRoles("ADMIN"),
  getDoctorLoad
);


// Active employees
router.get(
  "/active-employees",
  authMiddleware,
  allowRoles("ADMIN"),
  getActiveEmployees
);

// Weekly tokens summary
router.get(
  "/tokens/weekly",
  authMiddleware,
  allowRoles("ADMIN"),
  getWeeklyTokens
);

module.exports = router;
