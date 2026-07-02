const cron = require("node-cron");

const reminderJob = {
    start: () => {
        // Runs every day at 9:00 AM
        cron.schedule("0 9 * * *", () => {
            console.log("⏰ Running reminder job...");
            // Email logic coming later
        });
    },
};

module.exports = reminderJob;