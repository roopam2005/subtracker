const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Import cron job
const reminderJob = require("./jobs/reminderJob");

// Import db connection
const connectDB = require("./config/db");

// Connect to database
connectDB();

const app = express();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//         MIDDLEWARE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//           ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SubTracker API is running 🚀",
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       404 HANDLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//      GLOBAL ERROR HANDLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       START SERVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚀 Server running on port ${PORT}
  🌍 Mode: ${process.env.NODE_ENV}
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);

    // Start cron job
    reminderJob.start();
    console.log("⏰ Reminder cron job started");
});