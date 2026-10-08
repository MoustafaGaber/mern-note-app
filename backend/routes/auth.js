import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts, try again later" },
});


// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login",loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
});

// Me
router.get("/me", protect, async (req, res) => {
  res.status(200).json(req.user);
});



export default router;