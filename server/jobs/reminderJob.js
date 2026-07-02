const cron = require("node-cron");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const reminderJob = {
    start: () => {
        // Runs every day at 9:00 AM
        cron.schedule("0 9 * * *", async () => {
            console.log("⏰ Running reminder job...");

            try {
                const today = new Date();

                // Get all active subscriptions
                const subscriptions = await Subscription.find({
                    isActive: true,
                }).populate("userId", "name email reminderEnabled");

                for (const sub of subscriptions) {
                    // Skip if user disabled reminders
                    if (!sub.userId.reminderEnabled) continue;

                    // Calculate days until renewal
                    const renewal = new Date(sub.nextRenewalDate);
                    const diffTime = renewal - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    // Send reminder if within reminderDays
                    if (diffDays === sub.reminderDays) {
                        await sendEmail({
                            to: sub.userId.email,
                            subject: `⚠️ ${sub.name} renews in ${diffDays} days!`,
                            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; padding: 40px; border-radius: 16px;">
                  
                  <h1 style="color: #6c63ff; margin-bottom: 8px;">SubTracker</h1>
                  <p style="color: #888; margin-bottom: 32px;">Subscription Reminder</p>
                  
                  <div style="background: #12121a; padding: 24px; border-radius: 12px; border-left: 4px solid ${sub.color};">
                    <h2 style="margin: 0 0 8px 0;">${sub.name}</h2>
                    <p style="color: #888; margin: 0;">renews in <strong style="color: #ff6584;">${diffDays} days</strong></p>
                  </div>

                  <div style="margin-top: 24px;">
                    <p>💰 Amount: <strong>$${sub.amount}</strong></p>
                    <p>📅 Renewal Date: <strong>${new Date(sub.nextRenewalDate).toDateString()}</strong></p>
                    <p>🔄 Billing: <strong>${sub.billingCycle}</strong></p>
                  </div>

                  <a href="${process.env.CLIENT_URL}/dashboard" 
                     style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #6c63ff; color: white; text-decoration: none; border-radius: 8px;">
                    View Dashboard
                  </a>

                  <p style="margin-top: 32px; color: #555; font-size: 12px;">
                    You received this because you have reminders enabled in SubTracker.
                  </p>
                </div>
              `,
                        });

                        console.log(`📧 Reminder sent to ${sub.userId.email} for ${sub.name}`);
                    }
                }
            } catch (error) {
                console.error("Reminder job error:", error);
            }
        });
    },
};

module.exports = reminderJob;