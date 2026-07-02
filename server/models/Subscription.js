const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Subscription name is required"],
            trim: true,
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "Entertainment",
                "Music",
                "Gaming",
                "Software",
                "Education",
                "Fitness",
                "News",
                "Shopping",
                "Cloud",
                "Other",
            ],
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount cannot be negative"],
        },
        currency: {
            type: String,
            default: "USD",
            enum: ["USD", "EUR", "GBP", "INR", "JPY"],
        },
        billingCycle: {
            type: String,
            required: [true, "Billing cycle is required"],
            enum: ["monthly", "yearly", "weekly"],
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        nextRenewalDate: {
            type: Date,
            required: [true, "Next renewal date is required"],
        },
        reminderDays: {
            type: Number,
            default: 3, // Remind 3 days before renewal
            min: 1,
            max: 30,
        },
        color: {
            type: String,
            default: "#6c63ff",
        },
        icon: {
            type: String,
            default: "default",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        notes: {
            type: String,
            maxlength: [200, "Notes cannot exceed 200 characters"],
            default: "",
        },
        website: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   Virtual: Monthly amount
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
subscriptionSchema.virtual("monthlyAmount").get(function () {
    if (this.billingCycle === "monthly") return this.amount;
    if (this.billingCycle === "yearly") return this.amount / 12;
    if (this.billingCycle === "weekly") return this.amount * 4;
    return this.amount;
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   Virtual: Days until renewal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
subscriptionSchema.virtual("daysUntilRenewal").get(function () {
    const today = new Date();
    const renewal = new Date(this.nextRenewalDate);
    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Make virtuals available in JSON
subscriptionSchema.set("toJSON", { virtuals: true });
subscriptionSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);