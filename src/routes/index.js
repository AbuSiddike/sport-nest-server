const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "SportNest API is running" });
});

module.exports = router;
