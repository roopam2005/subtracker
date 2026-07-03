import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSubscription } from "../../context/SubscriptionContext";
import SubscriptionCard from "../../components/SubscriptionCard/SubscriptionCard";
import AddSubscriptionModal from "../../components/AddSubscriptionModal/AddSubscriptionModal";
import { motion, AnimatePresence } from "framer-motion";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    subscriptions,
    summary,
    loading,
    fetchSubscriptions,
    fetchSummary,
  } = useSubscription();

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSubscriptions();
    fetchSummary();
  }, [fetchSubscriptions, fetchSummary]);

  const filteredSubs = subscriptions.filter((sub) => {
    if (filter === "all") return true;
    return sub.category === filter;
  });

  const categories = ["all", ...new Set(subscriptions.map((s) => s.category))];

  const handleEdit = (subscription) => {
    setEditData(subscription);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditData(null);
  };

  // Get upcoming renewals (next 7 days)
  const upcomingRenewals = subscriptions
    .filter((sub) => {
      const days = Math.ceil(
        (new Date(sub.nextRenewalDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate))
    .slice(0, 4);

  // Top expensive subscriptions
  const topExpensive = [...subscriptions]
    .sort((a, b) => {
      const aMonthly =
        a.billingCycle === "yearly" ? a.amount / 12 : a.amount;
      const bMonthly =
        b.billingCycle === "yearly" ? b.amount / 12 : b.amount;
      return bMonthly - aMonthly;
    })
    .slice(0, 3);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-top"
      >
        <div>
          <p className="greeting">{greeting()}</p>
          <h1 className="dashboard-heading">
            {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
        </div>

        <button onClick={() => setShowModal(true)} className="new-sub-btn">
          <span className="btn-plus">+</span>
          <span>New Subscription</span>
        </button>
      </motion.div>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Big Monthly Cost Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bento-card bento-hero"
        >
          <div className="bento-hero-content">
            <div className="hero-label">
              <span className="hero-dot"></span>
              Monthly Spending
            </div>
            <h2 className="hero-amount">
              <span className="currency-sym">$</span>
              {summary?.monthlyTotal.toFixed(2) || "0.00"}
            </h2>
            <div className="hero-meta">
              <div className="meta-item">
                <span className="meta-label">Yearly</span>
                <span className="meta-value">
                  ${summary?.yearlyTotal.toFixed(0) || "0"}
                </span>
              </div>
              <div className="meta-divider"></div>
              <div className="meta-item">
                <span className="meta-label">Daily</span>
                <span className="meta-value">
                  ${summary?.dailyTotal.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
          <div className="hero-decoration">
            <div className="glow-orb glow-1"></div>
            <div className="glow-orb glow-2"></div>
          </div>
        </motion.div>

        {/* Total Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bento-card bento-stat"
        >
          <div className="stat-icon-wrap">
            <div className="stat-icon">📊</div>
          </div>
          <div>
            <p className="stat-label">Active Subs</p>
            <h3 className="stat-value">{summary?.totalSubscriptions || 0}</h3>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-card bento-stat"
        >
          <div className="stat-icon-wrap" style={{ background: "rgba(255, 101, 132, 0.1)" }}>
            <div className="stat-icon">🏷️</div>
          </div>
          <div>
            <p className="stat-label">Categories</p>
            <h3 className="stat-value">{categories.length - 1}</h3>
          </div>
        </motion.div>

        {/* Upcoming Renewals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bento-card bento-upcoming"
        >
          <div className="bento-card-header">
            <h3>Upcoming Renewals</h3>
            <span className="badge-count">{upcomingRenewals.length}</span>
          </div>

          <div className="upcoming-list">
            {upcomingRenewals.length === 0 ? (
              <p className="empty-text">No renewals in next 7 days ✨</p>
            ) : (
              upcomingRenewals.map((sub) => {
                const days = Math.ceil(
                  (new Date(sub.nextRenewalDate) - new Date()) /
                    (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={sub._id} className="upcoming-item">
                    <div
                      className="upcoming-dot"
                      style={{ background: sub.color }}
                    ></div>
                    <div className="upcoming-info">
                      <p className="upcoming-name">{sub.name}</p>
                      <p className="upcoming-date">
                        {days === 0
                          ? "Today"
                          : days === 1
                          ? "Tomorrow"
                          : `in ${days} days`}
                      </p>
                    </div>
                    <span className="upcoming-amount">${sub.amount}</span>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Top Expensive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bento-card bento-top"
        >
          <div className="bento-card-header">
            <h3>Top Expenses</h3>
            <span className="header-badge">💰</span>
          </div>

          <div className="top-list">
            {topExpensive.length === 0 ? (
              <p className="empty-text">No subscriptions yet</p>
            ) : (
              topExpensive.map((sub, i) => (
                <div key={sub._id} className="top-item">
                  <span className="top-rank">{i + 1}</span>
                  <div
                    className="top-color"
                    style={{ background: sub.color }}
                  ></div>
                  <div className="top-info">
                    <p className="top-name">{sub.name}</p>
                    <p className="top-cycle">{sub.billingCycle}</p>
                  </div>
                  <span className="top-amount">${sub.amount}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Subscriptions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="subs-section"
      >
        <div className="subs-section-header">
          <div>
            <h2 className="section-heading">Your Subscriptions</h2>
            <p className="section-desc">Manage all your subs in one place</p>
          </div>

          {/* Filter */}
          {subscriptions.length > 0 && (
            <div className="filter-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`pill ${filter === cat ? "active" : ""}`}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-box">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="empty-box">
            <div className="empty-illustration">
              <div className="empty-circle"></div>
              <span className="empty-emoji">📭</span>
            </div>
            <h3>Start tracking your first subscription</h3>
            <p>Add Netflix, Spotify, or any recurring service to begin</p>
            <button
              onClick={() => setShowModal(true)}
              className="empty-cta"
            >
              + Add Subscription
            </button>
          </div>
        ) : (
          <div className="subs-grid">
            <AnimatePresence>
              {filteredSubs.map((sub, index) => (
                <SubscriptionCard
                  key={sub._id}
                  subscription={sub}
                  onEdit={handleEdit}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AddSubscriptionModal
            onClose={handleCloseModal}
            editData={editData}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;