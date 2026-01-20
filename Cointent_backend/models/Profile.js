const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: String,
  platform: String,
  contentType: String,
  teamSize: String,
  monthlyBudget: Number
});

module.exports = mongoose.model("Profile", ProfileSchema);
