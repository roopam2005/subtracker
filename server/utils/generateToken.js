const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

const sendTokenResponse = (user, statusCode, res) => {
    // Generate token
    const token = generateToken(user._id);

    // Cookie options
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true, // Cannot be accessed by JS
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    // Remove password from output
    user.password = undefined;

    res
        .status(statusCode)
        .cookie("token", token, cookieOptions)
        .json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                currency: user.currency,
                reminderEnabled: user.reminderEnabled,
            },
        });
};

module.exports = { generateToken, sendTokenResponse };