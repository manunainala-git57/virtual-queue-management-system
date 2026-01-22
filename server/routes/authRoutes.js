const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route test
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Token is valid",
    user: req.user,
  });
});

module.exports = router;
