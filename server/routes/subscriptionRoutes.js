const express = require("express");
const router = express.Router();
const {
    getSubscriptions,
    getSubscription,
    addSubscription,
    updateSubscription,
    deleteSubscription,
} = require("../controllers/subscriptionController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.route("/")
    .get(getSubscriptions)
    .post(addSubscription);

router.route("/:id")
    .get(getSubscription)
    .put(updateSubscription)
    .delete(deleteSubscription);

module.exports = router;