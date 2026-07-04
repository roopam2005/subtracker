import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSubscription } from "../../context/SubscriptionContext";
import CustomSelect from "../CustomSelect/CustomSelect";
import "./AddSubscriptionModal.css";

const AddSubscriptionModal = ({ onClose, editData }) => {
  const { addSubscription, updateSubscription } = useSubscription();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Entertainment",
    amount: "",
    currency: "USD",
    billingCycle: "monthly",
    startDate: new Date().toISOString().split("T")[0],
    reminderDays: 3,
    color: "#6c63ff",
    notes: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        startDate: new Date(editData.startDate).toISOString().split("T")[0],
      });
    }
  }, [editData]);

  const categories = [
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
  ];

  const colors = [
    "#6c63ff",
    "#ff6584",
    "#43e97b",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await updateSubscription(editData._id, formData);
      } else {
        await addSubscription(formData);
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{editData ? "Edit Subscription" : "Add New Subscription"}</h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Name */}
          <div className="form-group">
            <label>Service Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Netflix, Spotify..."
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category *</label>
            <CustomSelect
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories.map((cat) => ({
                value: cat,
                label: cat,
              }))}
            />
          </div>

          {/* Amount & Currency */}
          <div className="form-row">
            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="9.99"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Currency</label>
              <CustomSelect
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                options={[
                  { value: "USD", label: "USD ($)" },
                  { value: "EUR", label: "EUR (€)" },
                  { value: "GBP", label: "GBP (£)" },
                  { value: "INR", label: "INR (₹)" },
                  { value: "JPY", label: "JPY (¥)" },
                ]}
              />
            </div>
          </div>

          {/* Billing Cycle & Start Date */}
          <div className="form-row">
            <div className="form-group">
              <label>Billing Cycle *</label>
              <CustomSelect
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                options={[
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                  { value: "yearly", label: "Yearly" },
                ]}
              />
            </div>

            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Reminder Days */}
          <div className="form-group">
            <label>Remind me before (days)</label>
            <input
              type="number"
              name="reminderDays"
              value={formData.reminderDays}
              onChange={handleChange}
              min="1"
              max="30"
            />
          </div>

          {/* Color */}
          <div className="form-group">
            <label>Card Color</label>
            <div className="color-picker">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  className={`color-btn ${
                    formData.color === c ? "active" : ""
                  }`}
                  style={{ background: c }}
                ></button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any notes..."
              rows="2"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? "Saving..."
                : editData
                ? "Update"
                : "Add Subscription"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddSubscriptionModal;