import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://hack-collab-nu.vercel.app");

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// =====================================================
// FETCH MY REWARDS
// =====================================================
export const fetchMyRewards = createAsyncThunk(
  "rewards/fetchMyRewards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/rewards/me`, getAuthConfig());
      return response.data.rewards;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch rewards");
    }
  }
);

// =====================================================
// FETCH LEADERBOARD
// =====================================================
export const fetchLeaderboard = createAsyncThunk(
  "rewards/fetchLeaderboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/rewards/leaderboard`);
      return response.data.leaderboard;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch leaderboard");
    }
  }
);

const initialState = {
  myRewards: {
    coins: 0,
    badge: "Bronze",
    totalDonations: 0,
  },
  leaderboard: [],
  loading: false,
  error: null,
};

const rewardSlice = createSlice({
  name: "rewards",
  initialState,
  reducers: {
    updateMyRewards: (state, action) => {
      state.myRewards = {
        ...state.myRewards,
        ...action.payload,
      };
    },
    clearRewards: (state) => {
      state.myRewards = initialState.myRewards;
      state.leaderboard = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRewards.pending, (state) => { state.loading = true; })
      .addCase(fetchMyRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.myRewards = action.payload;
      })
      .addCase(fetchMyRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLeaderboard.pending, (state) => { state.loading = true; })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateMyRewards, clearRewards } = rewardSlice.actions;
export default rewardSlice.reducer;