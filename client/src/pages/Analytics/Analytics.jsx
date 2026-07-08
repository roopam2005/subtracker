import { useState, useEffect } from "react";
import { useSubscription } from "../../context/SubscriptionContext";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import api from "../../utils/api";
import "./Analytics.css";

const Analytics = () => {
  const { subscriptions, summary, fetchSubscriptions, fetchSummary } =
    useSubscription();

  const [categoryData, setCategoryData] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
    fetchSummary();
    fetchAnalyticsData();
  }, [fetchSubscriptions, fetchSummary]);

  const fetchAnalyticsData = async () => {
    try {
      const [cat, month, upcoming] = await Promise.all([
        api.get("/analytics/category"),
        api.get("/analytics/monthly"),
        api.get("/analytics/upcoming"),
      ]);

      setCategoryData(cat.data.categoryData);
      setMonthlyTrend(month.data.monthlyTrend);
      setUpcomingRenewals(upcoming.data.upcoming);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Chart colors
  const COLORS = [
    "#6c63ff",
    "#ff6584",
    "#43e97b",
    "#f59e0b",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#a855f7",
  ];

  // Billing cycle breakdown
  const billingBreakdown = subscriptions.reduce((acc, sub) => {
    acc[sub.billingCycle] = (acc[sub.billingCycle] || 0) + 1;
    return acc;
  }, {});

  const billingData = Object.keys(billingBreakdown).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: billingBreakdown[key],
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="tooltip-value" style={{ color: entry.color }}>
              {entry.name}: ${entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="analytics-header"
      >
        <div>
          <p className="page-tag">Analytics</p>
          <h1 className="page-heading">Insights & Trends</h1>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="stats-row">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-block"
        >
          <p className="stat-label">Monthly Spend</p>
          <h2 className="stat-number">
            ${summary?.monthlyTotal.toFixed(2) || "0"}
          </h2>
          <p className="stat-change positive">Active</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-block"
        >
          <p className="stat-label">Yearly Projection</p>
          <h2 className="stat-number">
            ${summary?.yearlyTotal.toFixed(0) || "0"}
          </h2>
          <p className="stat-change">
            ${((summary?.yearlyTotal || 0) / 12).toFixed(2)}/mo avg
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stat-block"
        >
          <p className="stat-label">Total Subs</p>
          <h2 className="stat-number">{subscriptions.length}</h2>
          <p className="stat-change">{categoryData.length} categories</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="stat-block"
        >
          <p className="stat-label">Daily Cost</p>
          <h2 className="stat-number">
            ${summary?.dailyTotal.toFixed(2) || "0"}
          </h2>
          <p className="stat-change">
            ${((summary?.dailyTotal || 0) * 7).toFixed(2)}/week
          </p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Monthly Trend - Big Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="chart-card chart-large"
        >
          <div className="chart-header">
            <div>
              <h3>Monthly Spending Trend</h3>
              <p>Your subscription costs over time</p>
            </div>
            <div className="chart-legend">
              <span className="legend-dot" style={{ background: "#6c63ff" }}></span>
              <span>Total Spend</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6c63ff" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="month"
                stroke="#a0a0b0"
                style={{ fontSize: "0.85rem" }}
              />
              <YAxis
                stroke="#a0a0b0"
                style={{ fontSize: "0.85rem" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6c63ff"
                strokeWidth={2}
                fill="url(#colorSpend)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="chart-card"
        >
          <div className="chart-header">
            <div>
              <h3>Spending by Category</h3>
              <p>Where your money goes</p>
            </div>
          </div>

          {categoryData.length === 0 ? (
            <div className="chart-empty">
              <p>No data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="amount"
                  nameKey="category"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid #2a2a3a",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Legend */}
          {categoryData.length > 0 && (
            <div className="category-legend">
              {categoryData.map((cat, i) => (
                <div key={i} className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ background: COLORS[i % COLORS.length] }}
                  ></span>
                  <span className="legend-name">{cat.category}</span>
                  <span className="legend-value">
                    ${cat.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Billing Cycle Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="chart-card"
        >
          <div className="chart-header">
            <div>
              <h3>Billing Cycles</h3>
              <p>How you're being charged</p>
            </div>
          </div>

          {billingData.length === 0 ? (
            <div className="chart-empty">
              <p>No data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={billingData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis dataKey="name" stroke="#a0a0b0" style={{ fontSize: "0.85rem" }} />
                <YAxis stroke="#a0a0b0" style={{ fontSize: "0.85rem" }} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid #2a2a3a",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {billingData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Upcoming Renewals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="chart-card chart-large"
        >
          <div className="chart-header">
            <div>
              <h3>Upcoming Renewals</h3>
              <p>Payments in the next 30 days</p>
            </div>
            <span className="header-count">{upcomingRenewals.length}</span>
          </div>

          {upcomingRenewals.length === 0 ? (
            <div className="chart-empty">
              <span className="empty-emoji">✨</span>
              <p>No renewals in the next 30 days!</p>
            </div>
          ) : (
            <div className="renewals-list">
              {upcomingRenewals.map((sub) => {
                const days = Math.ceil(
                  (new Date(sub.nextRenewalDate) - new Date()) /
                    (1000 * 60 * 60 * 24)
                );
                const urgency =
                  days <= 3 ? "urgent" : days <= 7 ? "soon" : "normal";

                return (
                  <div key={sub._id} className={`renewal-row ${urgency}`}>
                    <div
                      className="renewal-color"
                      style={{ background: sub.color }}
                    ></div>
                    <div className="renewal-details">
                      <p className="renewal-name">{sub.name}</p>
                      <p className="renewal-category">{sub.category}</p>
                    </div>
                    <div className="renewal-meta">
                      <p className="renewal-days">
                        {days === 0
                          ? "Today"
                          : days === 1
                          ? "Tomorrow"
                          : `${days} days`}
                      </p>
                      <p className="renewal-date">
                        {new Date(sub.nextRenewalDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </p>
                    </div>
                    <div className="renewal-amount">
                      <span className="amount-value">${sub.amount}</span>
                      <span className="amount-cycle">/{sub.billingCycle}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;