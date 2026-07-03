import { createContext, useContext, useState, useCallback } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all subscriptions
  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/subscriptions");
      setSubscriptions(res.data.subscriptions);
    } catch (error) {
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch summary
  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.get("/analytics/summary");
      setSummary(res.data.summary);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Add subscription
  const addSubscription = async (data) => {
    try {
      const res = await api.post("/subscriptions", data);
      setSubscriptions([...subscriptions, res.data.subscription]);
      fetchSummary();
      toast.success("Subscription added! 🎉");
      return res.data.subscription;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add");
      throw error;
    }
  };

  // Update subscription
  const updateSubscription = async (id, data) => {
    try {
      const res = await api.put(`/subscriptions/${id}`, data);
      setSubscriptions(
        subscriptions.map((s) => (s._id === id ? res.data.subscription : s))
      );
      fetchSummary();
      toast.success("Subscription updated! ✅");
      return res.data.subscription;
    } catch (error) {
      toast.error("Failed to update");
      throw error;
    }
  };

  // Delete subscription
  const deleteSubscription = async (id) => {
    try {
      await api.delete(`/subscriptions/${id}`);
      setSubscriptions(subscriptions.filter((s) => s._id !== id));
      fetchSummary();
      toast.success("Subscription deleted 🗑️");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        summary,
        loading,
        fetchSubscriptions,
        fetchSummary,
        addSubscription,
        updateSubscription,
        deleteSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);