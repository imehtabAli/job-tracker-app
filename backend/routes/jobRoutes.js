const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {createJob, getAllJobs, getJobById, updateJob, deleteJob} = require("../controllers/jobController");

router.post("/", verifyToken, createJob);
router.get("/", verifyToken, getAllJobs);
router.get("/:id", verifyToken, getJobById);
router.put("/:id", verifyToken, updateJob);
router.delete("/:id", verifyToken, deleteJob);

module.exports = router;