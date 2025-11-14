const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  eventType: String,
  mode: String,
  startDate: String,
  endDate: String,
  points: Number,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", // Coordinator status
  },
  hodStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", // HoD status after coordinator approval
  },
  submittedAt: {
    type: Date,
    default: Date.now, // Automatically set on creation
  },
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  department: String,
  role: {
    type: String,
    enum: ["staff", "coordinator","hod"],
    default: "staff",
  },
  activities: [activitySchema],
});

module.exports = mongoose.model("User", userSchema);
