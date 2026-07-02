const Subscription = require("../models/Subscription");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  GET /api/subscriptions
//   @desc   Get all subscriptions
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({
            userId: req.user._id,
        }).sort({ nextRenewalDate: 1 }); // Sort by renewal date

        res.status(200).json({
            success: true,
            count: subscriptions.length,
            subscriptions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  GET /api/subscriptions/:id
//   @desc   Get single subscription
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const getSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }

        // Make sure user owns subscription
        if (subscription.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        res.status(200).json({
            success: true,
            subscription,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  POST /api/subscriptions
//   @desc   Add new subscription
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const addSubscription = async (req, res) => {
    try {
        const {
            name,
            category,
            amount,
            currency,
            billingCycle,
            startDate,
            reminderDays,
            color,
            icon,
            notes,
            website,
        } = req.body;

        // Calculate next renewal date
        const nextRenewalDate = calculateNextRenewal(
            new Date(startDate),
            billingCycle
        );

        const subscription = await Subscription.create({
            userId: req.user._id,
            name,
            category,
            amount,
            currency: currency || req.user.currency,
            billingCycle,
            startDate,
            nextRenewalDate,
            reminderDays: reminderDays || 3,
            color: color || "#6c63ff",
            icon: icon || "default",
            notes,
            website,
        });

        res.status(201).json({
            success: true,
            subscription,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  PUT /api/subscriptions/:id
//   @desc   Update subscription
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const updateSubscription = async (req, res) => {
    try {
        let subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }

        // Make sure user owns subscription
        if (subscription.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        // Recalculate renewal date if billing cycle or start date changed
        if (req.body.billingCycle || req.body.startDate) {
            req.body.nextRenewalDate = calculateNextRenewal(
                new Date(req.body.startDate || subscription.startDate),
                req.body.billingCycle || subscription.billingCycle
            );
        }

        subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            subscription,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   @route  DELETE /api/subscriptions/:id
//   @desc   Delete subscription
//   @access Private
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }

        // Make sure user owns subscription
        if (subscription.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        await Subscription.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Subscription deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   Helper: Calculate Next Renewal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const calculateNextRenewal = (startDate, billingCycle) => {
    const today = new Date();
    let nextDate = new Date(startDate);

    // Keep adding cycle until we get a future date
    while (nextDate <= today) {
        if (billingCycle === "monthly") {
            nextDate.setMonth(nextDate.getMonth() + 1);
        } else if (billingCycle === "yearly") {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        } else if (billingCycle === "weekly") {
            nextDate.setDate(nextDate.getDate() + 7);
        }
    }

    return nextDate;
};

module.exports = {
    getSubscriptions,
    getSubscription,
    addSubscription,
    updateSubscription,
    deleteSubscription,
};