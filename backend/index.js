require("dotenv").config();
const express = require("express");

const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const verifyToken = require("./middleware/auth");
const UserModel = require("./modules/userSchema");
const connectDB = require("./db");

const PORT = Number(process.env.PORT);
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

async function ensureSeedUsers() {
  console.log("Running seed...");
  const users = [
    {
      username: "Staff User",
      email: "staff@example.com",
      password: "Password123!",
      department: "CSE",
      role: "staff",
    },
    {
      username: "Coordinator User",
      email: "coordinator@example.com",
      password: "Password123!",
      department: "CSE",
      role: "coordinator",
      coordinatorType: "cocurricular",
    },
    {
      username: "HoD User",
      email: "hod@example.com",
      password: "Password123!",
      department: "CSE",
      role: "hod",
    },
  ];

  for (const u of users) {
    try {
      const exists = await UserModel.findOne({ email: u.email });
      if (exists) {
        console.log("Already exists:", u.email);
        continue;
      }

      const pw = await bcrypt.hash(u.password, 10);

      const doc = await new UserModel({
        username: u.username,
        email: u.email,
        password: pw,
        department: u.department,
        role: u.role,
        coordinatorType: u.coordinatorType || "",
      }).save();

      console.log("Seeded user:", doc.email);
    } catch (err) {
      console.error("Seed error for", u.email, err);
    }
  }

}
// ensureSeedUsers().catch((e) => console.error("Seeding error:", e));
connectDB()
  .then(async () => {
    console.log("DB connected! Now seeding...");
    await ensureSeedUsers(); 

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Assign Points
const getPoints = (type, mode) => {
  const table = {
    Workshop: { Attended: 5, Conducted: 10 },
    FDP: { Attended: 7, Conducted: 12 },
    Seminar: { Attended: 3, Conducted: 6 },
    STTP: { Attended: 8, Conducted: 14 },
    Course: { Attended: 4, Conducted: 0 },
    Internship: { Attended: 6, Conducted: 0 },
  };
  return table[type]?.[mode] || 0;
};

// Auth Routes
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      username: user.username,
      department: user.department,
      email: user.email,
    },
    "your_secret_key",
    { expiresIn: "1h" }
  );
  res.status(200).json({ token });
});

app.post("/register", async (req, res) => {
  const { username, email, password, department, role } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword,
    department,
    role,
  });

  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});

app.get("/profile", verifyToken, async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({
    name: user.username,
    email: user.email,
    role: user.role,
    activities: user.activities,
  });
});

// Staff submits activity
app.post("/activities", verifyToken, async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  const newActivity = {
    ...req.body,
    points: getPoints(req.body.eventType, req.body.mode),
    status: "pending",
  };
  user.activities.push(newActivity);
  await user.save();

  res
    .status(200)
    .json({ message: "Activity submitted", activities: user.activities });
});

// Get staff activities
app.get("/activities", verifyToken, async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  res.status(200).json(user.activities);
});

// Coordinator fetch pending submissions
app.get("/pending-activities", verifyToken, async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  if (user.role !== "coordinator")
    return res.status(403).json({ message: "Unauthorized" });

  const users = await UserModel.find({ "activities.status": "pending" });
  const pending = [];

  users.forEach((u) => {
    u.activities.forEach((act, idx) => {
      if (act.status === "pending") {
        pending.push({
          activityId: idx,
          userId: u._id,
          staffName: u.username,
          ...act._doc,
        });
      }
    });
  });

  res.status(200).json(pending);
});

// Coordinator approves/rejects
app.put("/update-activity-status", verifyToken, async (req, res) => {
  const { userId, activityId, status } = req.body;
  const user = await UserModel.findById(userId);

  if (!user || !user.activities[activityId]) {
    return res.status(404).json({ message: "Activity not found" });
  }

  user.activities[activityId].status = status;

  if (status === "approved") {
    user.activities[activityId].hodStatus = "pending"; // now it needs HoD review
  }

  await user.save();
  res.status(200).json({ message: "Status updated" });
});

app.get("/pending-for-hod", verifyToken, async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  if (user.role !== "hod")
    return res.status(403).json({ message: "Unauthorized" });

  const users = await UserModel.find({
    "activities.hodStatus": "pending",
    "activities.status": "approved",
  });
  const pending = [];

  users.forEach((u) => {
    u.activities.forEach((act, idx) => {
      if (act.status === "approved" && act.hodStatus === "pending") {
        pending.push({
          activityId: idx,
          userId: u._id,
          staffName: u.username,
          ...act._doc,
        });
      }
    });
  });

  res.status(200).json(pending);
});

app.put("/update-hod-status", verifyToken, async (req, res) => {
  const { userId, activityId, hodStatus } = req.body;
  const user = await UserModel.findById(userId);

  if (!user || !user.activities[activityId]) {
    return res.status(404).json({ message: "Activity not found" });
  }

  user.activities[activityId].hodStatus = hodStatus;
  await user.save();
  res.status(200).json({ message: "HoD status updated" });
});
