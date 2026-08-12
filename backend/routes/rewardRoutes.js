const express = require("express");
const router = express.Router();

// 1. Correctly import your auth middleware (just like in donationRoutes.js)
const protect = require("../middleware/authMiddleware");

// 2. Import the reward controllers
const {
  getMyRewards,
  getLeaderboard,
} = require("../controllers/rewardController");

// =====================================================
// REWARD ROUTES
// =====================================================

// Route: GET /api/rewards/me
// Description: Get logged-in user's coin and badge status
// Access: Private (Requires token)
router.get("/me", protect, getMyRewards);

// Route: GET /api/rewards/leaderboard
// Description: Get top 10 donors
// Access: Public
router.get("/leaderboard", getLeaderboard);

module.exports = router;
