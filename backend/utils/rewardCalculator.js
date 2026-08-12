// backend/utils/rewardCalculator.js

const calculateCoins = (totalDonations) => {
  const BASE_REWARD = 100;
  let bonusReward = 0;

  // The Streak Logic: If total donations is a multiple of 7, add 100 extra coins
  if (totalDonations > 0 && totalDonations % 7 === 0) {
    bonusReward = 100;
  }

  const totalCoinsEarned = BASE_REWARD + bonusReward;

  return {
    coinsEarned: totalCoinsEarned,
    hitStreak: bonusReward > 0,
  };
};

const determineBadge = (totalCoins) => {
  if (totalCoins >= 1000) return "Platinum";
  if (totalCoins >= 500) return "Gold";
  if (totalCoins >= 100) return "Silver";
  return "Bronze";
};

module.exports = { calculateCoins, determineBadge };
