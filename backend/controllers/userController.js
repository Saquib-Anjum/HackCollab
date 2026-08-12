// backend/controllers/userController.js
const User = require("../models/User");
const Reward = require("../models/Reward");

// =========================
// GET MY PROFILE
// =========================
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Optionally fetch or auto-create reward stats if the user is a donor
    let reward = null;
    if (user.role === "donor") {
      reward = await Reward.findOne({ user: user._id });
      if (!reward) {
        reward = await Reward.create({ user: user._id });
      }
    }

    return res.status(200).json({
      success: true,
      user,
      reward,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =========================
// UPDATE MY PROFILE
// =========================
const updateMyProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name.trim(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
