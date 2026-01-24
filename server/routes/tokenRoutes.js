const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/allowRoles");

const { takeToken } = require("../controllers/tokenController");

router.post("/", authMiddleware, allowRoles("USER"), takeToken);

module.exports = router;
