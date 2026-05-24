const express = require("express");
const router = express.Router();
const { getMe, updateProfile, changePassword } = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/me", verifyToken, getMe);
router.put("/update", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);

module.exports = router;