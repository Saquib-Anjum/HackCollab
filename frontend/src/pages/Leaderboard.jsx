import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard } from "../redux/slices/rewardSlice"; // Adjust path as needed

const Leaderboard = () => {
  const dispatch = useDispatch();

  // Pull the leaderboard data and loading state from Redux
  const { leaderboard, loading, error } = useSelector((state) => state.rewards);

  useEffect(() => {
    // Fetch the top donors when the page loads
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  if (loading)
    return <div className="text-center p-8">Loading rankings...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">🏆 Wall of Fame</h1>
        <p className="text-gray-600 mt-2">
          Our most generous heroes making a difference.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
              <th className="py-4 px-6">Rank</th>
              <th className="py-4 px-6">Donor</th>
              <th className="py-4 px-6">Badge</th>
              <th className="py-4 px-6 text-right">Coins Earned</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  No donations yet. Be the first to claim a spot!
                </td>
              </tr>
            ) : (
              leaderboard.map((leader, index) => (
                <tr
                  key={leader._id}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    index === 0
                      ? "bg-yellow-50" // Gold background for 1st
                      : index === 1
                        ? "bg-gray-50" // Silver background for 2nd
                        : index === 2
                          ? "bg-orange-50" // Bronze background for 3rd
                          : ""
                  }`}
                >
                  <td className="py-4 px-6 font-bold text-lg">
                    {index === 0
                      ? "🥇"
                      : index === 1
                        ? "🥈"
                        : index === 2
                          ? "🥉"
                          : `#${index + 1}`}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-800">
                    {leader.user?.name || "Anonymous Hero"}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        leader.badge === "Platinum"
                          ? "bg-purple-200 text-purple-800"
                          : leader.badge === "Gold"
                            ? "bg-yellow-200 text-yellow-800"
                            : leader.badge === "Silver"
                              ? "bg-gray-200 text-gray-800"
                              : "bg-orange-200 text-orange-800" // Bronze
                      }`}
                    >
                      {leader.badge}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-green-600">
                    🪙 {leader.coins}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
