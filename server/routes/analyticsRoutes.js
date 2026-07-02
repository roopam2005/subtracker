const express = require("express");
const router = express.Router();
const {
    getSummary,
    getByCategory,
    getUpcoming,
    getMonthlyTrend,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.get("/summary", getSummary);
router.get("/category", getByCategory);
router.get("/upcoming", getUpcoming);
router.get("/monthly", getMonthlyTrend);

module.exports = router;