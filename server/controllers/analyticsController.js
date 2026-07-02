const Subscription = require("../models/Subscription");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  GET /api/analytics/summary
//   @desc   Get expense summary
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const getSummary = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({
            userId: req.user._id,
            isActive: true,
        });

        // Calculate totals
        let monthlyTotal = 0;
        let yearlyTotal = 0;

        subscriptions.forEach((sub) => {
            if (sub.billingCycle === "monthly") {
                monthlyTotal += sub.amount;
                yearlyTotal += sub.amount * 12;
            } else if (sub.billingCycle === "yearly") {
                monthlyTotal += sub.amount / 12;
                yearlyTotal += sub.amount;
            } else if (sub.billingCycle === "weekly") {
                monthlyTotal += sub.amount * 4;
                yearlyTotal += sub.amount * 52;
            }
        });

        res.status(200).json({
            success: true,
            summary: {
                totalSubscriptions: subscriptions.length,
                monthlyTotal: parseFloat(monthlyTotal.toFixed(2)),
                yearlyTotal: parseFloat(yearlyTotal.toFixed(2)),
                dailyTotal: parseFloat((monthlyTotal / 30).toFixed(2)),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  GET /api/analytics/category
//   @desc   Get spending by category
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const getByCategory = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({
            userId: req.user._id,
            isActive: true,
        });

        // Group by category
        const categoryMap = {};

        subscriptions.forEach((sub) => {
            let monthlyAmount = 0;

            if (sub.billingCycle === "monthly") monthlyAmount = sub.amount;
            else if (sub.billingCycle === "yearly") monthlyAmount = sub.amount / 12;
            else if (sub.billingCycle === "weekly") monthlyAmount = sub.amount * 4;

            if (categoryMap[sub.category]) {
                categoryMap[sub.category] += monthlyAmount;
            } else {
                categoryMap[sub.category] = monthlyAmount;
            }
        });

        // Convert to array for charts
        const categoryData = Object.keys(categoryMap).map((category) => ({
            category,
            amount: parseFloat(categoryMap[category].toFixed(2)),
        }));

        res.status(200).json({
            success: true,
            categoryData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  GET /api/analytics/upcoming
//   @desc   Get upcoming renewals
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const getUpcoming = async (req, res) => {
    try {
        const today = new Date();
        const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        const upcoming = await Subscription.find({
            userId: req.user._id,
            isActive: true,
            nextRenewalDate: {
                $gte: today,
                $lte: next30Days,
            },
        }).sort({ nextRenewalDate: 1 });

        res.status(200).json({
            success: true,
            count: upcoming.length,
            upcoming,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  GET /api/analytics/monthly
//   @desc   Get monthly spending trend
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const getMonthlyTrend = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({
            userId: req.user._id,
            isActive: true,
        });

        // Generate last 6 months data
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push({
                month: date.toLocaleString("default", { month: "short" }),
                year: date.getFullYear(),
                amount: 0,
            });
        }

        // Calculate monthly spending for each month
        subscriptions.forEach((sub) => {
            let monthlyAmount = 0;
            if (sub.billingCycle === "monthly") monthlyAmount = sub.amount;
            else if (sub.billingCycle === "yearly") monthlyAmount = sub.amount / 12;
            else if (sub.billingCycle === "weekly") monthlyAmount = sub.amount * 4;

            // Add to all months (subscription was active)
            months.forEach((m) => {
                m.amount += monthlyAmount;
            });
        });

        // Round amounts
        months.forEach((m) => {
            m.amount = parseFloat(m.amount.toFixed(2));
        });

        res.status(200).json({
            success: true,
            monthlyTrend: months,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getSummary,
    getByCategory,
    getUpcoming,
    getMonthlyTrend,
};