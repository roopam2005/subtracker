const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // Never return password in queries
        },
        avatar: {
            type: String,
            default: "",
        },
        currency: {
            type: String,
            default: "USD",
            enum: ["USD", "EUR", "GBP", "INR", "JPY"],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        reminderEnabled: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   Hash password before save
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   Compare password method
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);