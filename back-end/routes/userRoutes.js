const express = require("express");
const user = require("../models/User.js");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

//@route POST /api/users/register
//@desc Register a new user
//@access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //registration logic
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    user = new User({ name, email, password });
    await user.save();
    // create jwt payload
    const payload = { user: { id: user._id, role: user.role } };

    // sign in and return token with a data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "48h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//@route POST /api/users/login
//@desc Login a user
//@access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //login logic
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const payload = { user: { id: user._id, role: user.role } };

    // sign in and return token with a data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "48h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
//@route POST /api/users/profile
//@desc Get user profile
//@access Private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
