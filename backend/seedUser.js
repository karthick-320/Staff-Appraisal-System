
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserModel = require("../modules/userSchema"); 

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/staffdetails";

const usersToSeed = [
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

async function seed() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB:", MONGO_URI);

  for (const u of usersToSeed) {
    const existing = await UserModel.findOne({ email: u.email });
    if (existing) {
      console.log(`Skipping ${u.email} — already exists`);
      continue;
    }

    const hashed = await bcrypt.hash(u.password, 10);
    const newUser = new UserModel({
      username: u.username,
      email: u.email,
      password: hashed,
      department: u.department,
      role: u.role,
      coordinatorType: u.coordinatorType || "",
    });

    await newUser.save();
    console.log(`Created user: ${u.email}`);
  }

  await mongoose.disconnect();
  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
