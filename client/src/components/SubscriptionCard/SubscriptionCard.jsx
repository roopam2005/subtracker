import { motion } from "framer-motion";
import { useSubscription } from "../../context/SubscriptionContext";
import "./SubscriptionCard.css";

const SubscriptionCard = ({ subscription, onEdit, index }) => {
  const { deleteSubscription } = useSubscription();

  const handleDelete = async () => {
    if (window.confirm(`Delete ${subscription.name}?`)) {
      await deleteSubscription(subscription._id);
    }
  };

  // Calculate days until renewal
  const daysUntilRenewal = () => {
    const today = new Date();
    const renewal = new Date(subscription.nextRenewalDate);
    const diff = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const days = daysUntilRenewal();

  const getStatusColor = () => {
    if (days <= 3) return "#ef4444";
    if (days <= 7) return "#f59e0b";
    return "#10b981";
  };

  const getStatusText = () => {
    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  return (
    <motion.div
     layout
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, scale: 0.9 }}
     transition={{ delay: index * 0.05 }}
     className="sub-card"
     style={{ 
    "--card-color": subscription.color || "#6c63ff",
    borderTop: `3px solid ${subscription.color || "#6c63ff"}`
     }}
  >
      {/* Header */}
      <div className="sub-header">
        <div>
          <h3 className="sub-name">{subscription.name}</h3>
          <span className="sub-category">{subscription.category}</span>
        </div>

        <div className="sub-actions">
          <button onClick={() => onEdit(subscription)} className="action-btn">
            ✏️
          </button>
          <button onClick={handleDelete} className="action-btn delete">
            🗑️
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="sub-amount">
        <span className="currency">{subscription.currency === "USD" ? "$" : subscription.currency}</span>
        <span className="value">{subscription.amount}</span>
        <span className="cycle">/{subscription.billingCycle}</span>
      </div>

      {/* Renewal */}
      <div className="sub-footer">
        <div className="renewal-info">
          <span className="renewal-label">Renews in</span>
          <span
            className="renewal-days"
            style={{ color: getStatusColor() }}
          >
            {getStatusText()}
          </span>
        </div>

        <div className="renewal-date">
          📅 {new Date(subscription.nextRenewalDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(100, ((30 - Math.max(0, days)) / 30) * 100)}%`,
            background: getStatusColor(),
          }}
        ></div>
      </div>
    </motion.div>
  );
};

export default SubscriptionCard;