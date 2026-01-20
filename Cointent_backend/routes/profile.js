const express = require("express");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");

const router = express.Router();

// auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token provided" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.userId;
  next();
}

// create or update profile
router.post("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { userId: req.userId, ...req.body },
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get profile
router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
