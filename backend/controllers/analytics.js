// backend/controllers/analytics.js

const User = require("../models/User");
const Donation = require("../models/Donation");
const Reward = require("../models/Reward");

// =====================================================
// CONFIG
// =====================================================

// Apps Script Web App URL (deployed from your Google Sheet)
// Set this in your .env file: APPS_SCRIPT_URL=https://script.google.com/macros/s/xxxx/exec
const WEBAPP_URL = process.env.APPS_SCRIPT_URL;

// =====================================================
// ID MAPPER
// Mongo _id is different every time, but we need clean
// readable IDs like DNR500000, DON600000 etc.
// This hashes the _id into a fixed number, so SAME _id
// always produces the SAME readable ID every time we sync.
// =====================================================

function hashToNumber(objectId, mod = 99999) {
  const str = objectId.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0; // unsigned 32-bit hash
  }
  return hash % mod;
}

function toReadableId(prefix, base, objectId) {
  return `${prefix}${base + hashToNumber(objectId)}`;
}

const idMap = {
  donorId: (id) => toReadableId("DNR", 500000, id),
  donationId: (id) => toReadableId("DON", 600000, id),
  ngoId: (id) => toReadableId("NGO", 700000, id),
  claimId: (id) => toReadableId("CLM", 800000, id),
};

// =====================================================
// MOCK DATA HELPERS
// Our schema doesn't have every field the sheet needs
// (like City, Area, Distance, Delay). Fill those randomly
// so the dashboard still has something to show.
// =====================================================

const CITIES = [
  "Hyderabad",
  "Chennai",
  "Bengaluru",
  "Jaipur",
  "Pune",
  "Delhi NCR",
  "Kolkata",
  "Ahmedabad",
  "Remote",
];
const AREAS = [
  "North",
  "South",
  "East",
  "West",
  "Central",
  "Suburban",
  "Citywide",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randRange = (min, max, decimals = 0) => {
  const val = Math.random() * (max - min) + min;
  return decimals ? +val.toFixed(decimals) : Math.round(val);
};

// =====================================================
// SEND ONE TAB'S DATA TO THE APPS SCRIPT WEB APP
// Apps Script's doPost() receives this and writes it
// into the correct sheet tab.
// =====================================================

async function writeTab(tabName, headers, rows) {
  const res = await fetch(WEBAPP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tabName, headers, rows }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(`Failed writing ${tabName}: ${JSON.stringify(data)}`);
  }
  return data;
}

// =====================================================
// MAIN CONTROLLER
// Fetches data from MongoDB, transforms it into the
// 4-tab structure (Donors, NGO, Donations, Claims),
// and pushes each tab to the Google Sheet.
// =====================================================

exports.syncToGoogleSheet = async (req, res) => {
  try {
    // ---------- fetch raw data from Mongo ----------
    const donors = await User.find({ role: "donor" });
    const ngos = await User.find({ role: "ngo" });
    const donations = await Donation.find().populate("donor claimedBy");
    const rewards = await Reward.find();
    const rewardMap = new Map(rewards.map((r) => [r.user.toString(), r]));

    // ---------- P2_Donors ----------
    const donorRows = donors.map((d) => {
      const reward = rewardMap.get(d._id.toString());
      return [
        idMap.donorId(d._id),
        d.name,
        "Household", // donorType not in schema -> mocked for now
        pick(CITIES),
        pick(AREAS),
        reward ? reward.totalDonations : randRange(1, 15),
        d.isBlocked ? "No" : "Yes",
      ];
    });
    await writeTab(
      "P2_Donors",
      [
        "Donor_ID",
        "Donor_Name",
        "Donor_Type",
        "City",
        "Area",
        "Avg_Monthly_Donations",
        "Active",
      ],
      donorRows,
    );

    // ---------- P2_NGO ----------
    const ngoRows = ngos.map((n) => [
      idMap.ngoId(n._id),
      n.name,
      pick(CITIES),
      pick(AREAS),
      randRange(100, 2200), // Beneficiaries_Served_Monthly not in schema -> mocked
      randRange(2, 80), // Volunteer_Count not in schema -> mocked
      n.isBlocked ? "No" : "Yes",
    ]);
    await writeTab(
      "P2_NGO",
      [
        "NGO_ID",
        "NGO_Name",
        "City",
        "Service_Area",
        "Beneficiaries_Served_Monthly",
        "Volunteer_Count",
        "Active",
      ],
      ngoRows,
    );

    // ---------- P2_Donations ----------
    const donationRows = donations.map((d) => {
      // compute expiry window in hours from pickupTime -> expiryTime
      const expiryHours = d.expiryTime
        ? +((new Date(d.expiryTime) - new Date(d.pickupTime)) / 36e5).toFixed(1)
        : randRange(2, 40, 1);

      return [
        idMap.donationId(d._id),
        d.donor ? idMap.donorId(d.donor._id) : "N/A",
        d.category,
        d.quantity,
        d.createdAt.toISOString().split("T")[0],
        d.pickupLocation,
        d.pickupTime ? d.pickupTime.toISOString() : "",
        expiryHours,
        d.status,
        Math.round(d.quantity * 2.2), // rough KG -> meals conversion, adjust ratio as needed
      ];
    });
    await writeTab(
      "P2_Donations",
      [
        "Donation_ID",
        "Donor_ID",
        "Food_Category",
        "Quantity_KG",
        "Donation_Date",
        "Pickup_Location",
        "Pickup_Time",
        "Expiry_Hours",
        "Status",
        "Estimated_Meals",
      ],
      donationRows,
    );

    // ---------- P2_Claims ----------
    // No separate Claim model in our schema, so we derive
    // "claims" from donations that have a claimedBy user set.
    const claimedDonations = donations.filter((d) => d.claimedBy);
    const claimRows = claimedDonations.map((d) => [
      idMap.claimId(d._id),
      idMap.donationId(d._id),
      idMap.ngoId(d.claimedBy._id),
      d.claimedAt ? d.claimedAt.toISOString().split("T")[0] : "",
      d.quantity,
      randRange(1, 20, 2), // Pickup_Distance_KM not tracked -> mocked
      randRange(5, 90), // Pickup_Delay_Min not tracked -> mocked
      d.status === "DELIVERED"
        ? "Delivered"
        : d.status === "PICKED_UP"
          ? "Assigned"
          : "Pending",
    ]);
    await writeTab(
      "P2_Claims",
      [
        "Claim_ID",
        "Donation_ID",
        "NGO_ID",
        "Claim_Date",
        "Claimed_Quantity_KG",
        "Pickup_Distance_KM",
        "Pickup_Delay_Min",
        "Delivery_Status",
      ],
      claimRows,
    );

    // ---------- done ----------
    res.status(200).json({
      success: true,
      message: "Synced to Google Sheet",
      counts: {
        donors: donorRows.length,
        ngos: ngoRows.length,
        donations: donationRows.length,
        claims: claimRows.length,
      },
    });
  } catch (err) {
    console.error("Sheet sync failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
