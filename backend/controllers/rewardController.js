// backend/controllers/rewardController.js
const Reward = require('../models/Reward');

// =====================================================
// GET CURRENT USER'S REWARDS
// =====================================================
exports.getMyRewards = async (req, res) => {
  try {
    // req.user.id comes from your authMiddleware
    const rewardProfile = await Reward.findOne({ user: req.user.id });

    if (!rewardProfile) {
      return res.status(404).json({ 
        success: false, 
        message: "Reward profile not found." 
      });
    }

    return res.status(200).json({
      success: true,
      rewards: rewardProfile
    });
  } catch (error) {
    console.error("Get Rewards Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// =====================================================
// GET GLOBAL LEADERBOARD
// =====================================================
exports.getLeaderboard = async (req, res) => {
  try {
    // Find top 10 users with coins > 0, sort descending
    // We use .populate() to grab the user's name from the User model
    const leaderboard = await Reward.find({ coins: { $gt: 0 } })
      .sort({ coins: -1 })
      .limit(10)
      .populate('user', 'name'); 

    return res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};