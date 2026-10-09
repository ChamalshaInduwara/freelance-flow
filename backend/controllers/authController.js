const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        phone: user.phone,
        location: user.location,
        website: user.website,
        bio: user.bio,
        hourlyRate: user.hourlyRate,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while registering user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        phone: user.phone,
        location: user.location,
        website: user.website,
        bio: user.bio,
        hourlyRate: user.hourlyRate,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while logging in",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title || "Freelance Professional",
        phone: user.phone || "",
        location: user.location || "",
        website: user.website || "",
        bio: user.bio || "",
        hourlyRate: user.hourlyRate || 0,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching user profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name !== undefined ? req.body.name : user.name;
    user.email = req.body.email !== undefined ? req.body.email : user.email;
    user.title = req.body.title !== undefined ? req.body.title : user.title;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.website = req.body.website !== undefined ? req.body.website : user.website;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.hourlyRate = req.body.hourlyRate !== undefined ? req.body.hourlyRate : user.hourlyRate;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        title: updatedUser.title,
        phone: updatedUser.phone,
        location: updatedUser.location,
        website: updatedUser.website,
        bio: updatedUser.bio,
        hourlyRate: updatedUser.hourlyRate,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide current and new password" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating password" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  updatePassword,
};