const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/allowRoles");


const { takeToken } = require("../controllers/tokenController");
const { serveToken } = require("../controllers/tokenController");
const { getEmployeeQueue } = require("../controllers/tokenController");
const { getMyToken } = require("../controllers/tokenController");

//take token
router.post("/", authMiddleware, allowRoles("USER"), takeToken);

// serve token
router.post(
  "/:tokenId/serve",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  serveToken
);

// VIEW EMPLOYEE QUEUE (EMPLOYEE)
router.get(
  "/employee",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  getEmployeeQueue
);

// VIEW MY TOKEN (USER)
router.get(
  "/my",
  authMiddleware,
  allowRoles("USER"),
  getMyToken
);

module.exports = router;
