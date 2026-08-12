// backend/routes/analyticsRoute.js
const express = require("express");
const router = express.Router();
const { syncToGoogleSheet } = require("../controllers/analytics");

router.get("/sync-sheet", syncToGoogleSheet);

module.exports = router;