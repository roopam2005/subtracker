import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSubscription } from "../../context/SubscriptionContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import "./Settings.css";

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const { subscriptions } = useSubscription();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    currency: "USD",
    reminderEnabled: true,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        currency: user.currency || "USD",
        reminderEnabled: user.reminderEnabled !== false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        name: profileData.name,
        currency: profileData.currency,
        reminderEnabled: profileData.reminderEnabled,
      });
      toast.success("Profile updated successfully! ✅");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone!"
      )
    ) {
      toast.error("Account deletion feature coming soon");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "danger", label: "Danger Zone", icon: "⚠️" },
  ];

  // Stats
  const totalSpent = subscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === "monthly") return sum + parseFloat(sub.amount) * 12;
    if (sub.billingCycle === "yearly") return sum + parseFloat(sub.amount);
    return sum + parseFloat(sub.amount) * 52;
  }, 0);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="settings-page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="settings-header"
      >
        <div>
          <p className="page-tag">Settings</p>
          <h1 className="page-heading">Manage Your Account</h1>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="profile-card"
      >
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="profile-info">
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          <div className="profile-meta">
            <span className="meta-badge">
              📅 Member since {memberSince}
            </span>
            <span className="meta-badge">
              📊 {subscriptions.length} subscriptions
            </span>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <p className="stat-label">Yearly Total</p>
            <h3 className="stat-value">${totalSpent.toFixed(0)}</h3>
          </div>
        </div>
      </motion.div>

      {/* Tabs & Content */}
      <div className="settings-container">
        {/* Tabs Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="settings-tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? "active" : ""} ${
                tab.id === "danger" ? "danger" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="settings-content"
        >
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="setting-section">
              <div className="section-title">
                <h3>Profile Information</h3>
                <p>Update your personal details</p>
              </div>

              <form onSubmit={handleSaveProfile} className="setting-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled
                    className="disabled-input"
                  />
                  <span className="input-hint">
                    Email cannot be changed
                  </span>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="setting-section">
              <div className="section-title">
                <h3>Preferences</h3>
                <p>Customize your experience</p>
              </div>

              <form onSubmit={handleSaveProfile} className="setting-form">
                <div className="form-group">
                  <label>Default Currency</label>
                  <CustomSelect
                    name="currency"
                    value={profileData.currency}
                    onChange={handleChange}
                    options={[
                      { value: "USD", label: "USD ($) - US Dollar" },
                      { value: "EUR", label: "EUR (€) - Euro" },
                      { value: "GBP", label: "GBP (£) - British Pound" },
                      { value: "INR", label: "INR (₹) - Indian Rupee" },
                      { value: "JPY", label: "JPY (¥) - Japanese Yen" },
                    ]}
                  />
                  <span className="input-hint">
                    New subscriptions will use this currency by default
                  </span>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Theme</h4>
                    <p>Dark theme is currently active</p>
                  </div>
                  <div className="theme-preview">
                    <div className="theme-dot dark active"></div>
                    <div className="theme-dot light disabled" title="Coming soon"></div>
                  </div>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Language</h4>
                    <p>English (More languages coming soon)</p>
                  </div>
                  <span className="lang-badge">🌍 EN</span>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="setting-section">
              <div className="section-title">
                <h3>Notifications</h3>
                <p>Manage how you receive alerts</p>
              </div>

              <form onSubmit={handleSaveProfile} className="setting-form">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>📧 Email Reminders</h4>
                    <p>Get email alerts before subscription renewals</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="reminderEnabled"
                      checked={profileData.reminderEnabled}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item disabled">
                  <div className="toggle-info">
                    <h4>📱 Push Notifications</h4>
                    <p>Browser notifications (Coming soon)</p>
                  </div>
                  <label className="toggle-switch disabled">
                    <input type="checkbox" disabled />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item disabled">
                  <div className="toggle-info">
                    <h4>📊 Weekly Summary</h4>
                    <p>Get a weekly report of your spending (Coming soon)</p>
                  </div>
                  <label className="toggle-switch disabled">
                    <input type="checkbox" disabled />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item disabled">
                  <div className="toggle-info">
                    <h4>💡 Money-Saving Tips</h4>
                    <p>Personalized tips to save money (Coming soon)</p>
                  </div>
                  <label className="toggle-switch disabled">
                    <input type="checkbox" disabled />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === "danger" && (
            <div className="setting-section">
              <div className="section-title">
                <h3>Danger Zone</h3>
                <p>Irreversible actions</p>
              </div>

              <div className="danger-list">
                <div className="danger-item">
                  <div>
                    <h4>Sign Out</h4>
                    <p>Log out from your account on this device</p>
                  </div>
                  <button
                    onClick={logout}
                    className="danger-btn signout"
                  >
                    Sign Out
                  </button>
                </div>

                <div className="danger-item critical">
                  <div>
                    <h4>Delete Account</h4>
                    <p>
                      Permanently delete your account and all subscriptions.
                      This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="danger-btn delete"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;