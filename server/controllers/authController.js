const User = require("../models/User");
const { sendTokenResponse } = require("../utils/generateToken");
const { validationResult } = require("express-validator");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  POST /api/auth/register
//   @desc   Register new user
//   @access Public
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const register = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg,
            });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Send token response
        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration",
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  POST /api/auth/login
//   @desc   Login user
//   @access Public
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const login = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg,
            });
        }

        const { email, password } = req.body;

        // Find user with password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Send token response
        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  GET /api/auth/me
//   @desc   Get current user
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  PUT /api/auth/updateprofile
//   @desc   Update user profile
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const updateProfile = async (req, res) => {
    try {
        const { name, currency, reminderEnabled } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, currency, reminderEnabled },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  POST /api/auth/logout
//   @desc   Logout user
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const logout = async (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

module.exports = { register, login, getMe, updateProfile, logout };