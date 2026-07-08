import { useState, useEffect } from "react";
import { useSubscription } from "../../context/SubscriptionContext";
import { motion, AnimatePresence } from "framer-motion";
import "./Calendar.css";

const Calendar = () => {
  const { subscriptions, fetchSubscriptions } = useSubscription();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("month"); // month or list

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year;

  // Get renewals for each day
  const getRenewalsForDay = (day) => {
    return subscriptions.filter((sub) => {
      const renewalDate = new Date(sub.nextRenewalDate);
      return (
        renewalDate.getDate() === day &&
        renewalDate.getMonth() === month &&
        renewalDate.getFullYear() === year
      );
    });
  };

  // Get all renewals in current month
  const monthRenewals = subscriptions.filter((sub) => {
    const renewalDate = new Date(sub.nextRenewalDate);
    return (
      renewalDate.getMonth() === month && renewalDate.getFullYear() === year
    );
  });

  // Calculate month total
  const monthTotal = monthRenewals.reduce(
    (sum, sub) => sum + parseFloat(sub.amount),
    0
  );

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  // Get selected date renewals
  const selectedRenewals = selectedDate
    ? getRenewalsForDay(selectedDate)
    : [];

  // Days of week
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar days
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="calendar-page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="calendar-header"
      >
        <div>
          <p className="page-tag">Calendar</p>
          <h1 className="page-heading">Payment Schedule</h1>
        </div>

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "month" ? "active" : ""}`}
            onClick={() => setViewMode("month")}
          >
            📅 Month
          </button>
          <button
            className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            ☰ List
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="calendar-summary"
      >
        <div className="summary-item">
          <p className="summary-label">This Month</p>
          <h2 className="summary-value">${monthTotal.toFixed(2)}</h2>
          <p className="summary-desc">{monthRenewals.length} payments</p>
        </div>

        <div className="summary-item highlight">
          <p className="summary-label">Next Payment</p>
          {monthRenewals.length > 0 ? (
            <>
              <h2 className="summary-value">
                {new Date(
                  monthRenewals.sort(
                    (a, b) =>
                      new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate)
                  )[0].nextRenewalDate
                ).getDate()}
              </h2>
              <p className="summary-desc">
                {monthRenewals[0].name} • ${monthRenewals[0].amount}
              </p>
            </>
          ) : (
            <>
              <h2 className="summary-value">—</h2>
              <p className="summary-desc">No payments scheduled</p>
            </>
          )}
        </div>

        <div className="summary-item">
          <p className="summary-label">Busiest Day</p>
          <h2 className="summary-value">
            {(() => {
              const dayCount = {};
              monthRenewals.forEach((sub) => {
                const day = new Date(sub.nextRenewalDate).getDate();
                dayCount[day] = (dayCount[day] || 0) + 1;
              });
              const busiest = Object.keys(dayCount).sort(
                (a, b) => dayCount[b] - dayCount[a]
              )[0];
              return busiest || "—";
            })()}
          </h2>
          <p className="summary-desc">of {monthName}</p>
        </div>
      </motion.div>

      {viewMode === "month" ? (
        /* CALENDAR VIEW */
        <div className="calendar-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="calendar-widget"
          >
            {/* Calendar Navigation */}
            <div className="calendar-nav">
              <button onClick={goToPreviousMonth} className="nav-btn">
                ‹
              </button>

              <div className="nav-title">
                <h2>
                  {monthName} <span>{year}</span>
                </h2>
                {!isCurrentMonth && (
                  <button onClick={goToToday} className="today-btn">
                    Today
                  </button>
                )}
              </div>

              <button onClick={goToNextMonth} className="nav-btn">
                ›
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="calendar-weekdays">
              {weekDays.map((day) => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="calendar-grid">
              {days.map((day, index) => {
                const renewals = day ? getRenewalsForDay(day) : [];
                const isToday =
                  isCurrentMonth && day === today.getDate();
                const isSelected = day === selectedDate;
                const hasRenewals = renewals.length > 0;

                return (
                  <div
                    key={index}
                    className={`calendar-day ${!day ? "empty" : ""} ${
                      isToday ? "today" : ""
                    } ${isSelected ? "selected" : ""} ${
                      hasRenewals ? "has-payment" : ""
                    }`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <>
                        <span className="day-number">{day}</span>
                        {hasRenewals && (
                          <div className="day-indicators">
                            {renewals.slice(0, 3).map((sub, i) => (
                              <span
                                key={i}
                                className="day-dot"
                                style={{ background: sub.color }}
                              ></span>
                            ))}
                            {renewals.length > 3 && (
                              <span className="day-more">
                                +{renewals.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        {hasRenewals && (
                          <span className="day-amount">
                            ${renewals.reduce(
                              (sum, s) => sum + parseFloat(s.amount),
                              0
                            ).toFixed(0)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Selected Day Details */}
          <AnimatePresence mode="wait">
            {selectedDate && selectedRenewals.length > 0 && (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="day-details"
              >
                <div className="details-header">
                  <div>
                    <p className="details-tag">Payments on</p>
                    <h3 className="details-date">
                      {monthName} {selectedDate}, {year}
                    </h3>
                  </div>
                  <button
                    className="close-details"
                    onClick={() => setSelectedDate(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="details-list">
                  {selectedRenewals.map((sub) => (
                    <div key={sub._id} className="detail-item">
                      <div
                        className="detail-color"
                        style={{ background: sub.color }}
                      ></div>
                      <div className="detail-info">
                        <p className="detail-name">{sub.name}</p>
                        <p className="detail-category">{sub.category}</p>
                      </div>
                      <div className="detail-amount">
                        <span className="amount">${sub.amount}</span>
                        <span className="cycle">/{sub.billingCycle}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="details-total">
                  <span>Total for this day</span>
                  <strong>
                    $
                    {selectedRenewals
                      .reduce((sum, s) => sum + parseFloat(s.amount), 0)
                      .toFixed(2)}
                  </strong>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* LIST VIEW */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="list-view"
        >
          <div className="list-header">
            <h3>{monthName} {year}</h3>
            <div className="list-nav">
              <button onClick={goToPreviousMonth} className="nav-btn small">‹</button>
              <button onClick={goToNextMonth} className="nav-btn small">›</button>
            </div>
          </div>

          {monthRenewals.length === 0 ? (
            <div className="list-empty">
              <span className="empty-icon">📅</span>
              <p>No payments scheduled this month</p>
            </div>
          ) : (
            <div className="list-items">
              {monthRenewals
                .sort(
                  (a, b) =>
                    new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate)
                )
                .map((sub) => {
                  const date = new Date(sub.nextRenewalDate);
                  const isToday =
                    date.toDateString() === today.toDateString();
                  const isPast = date < today;

                  return (
                    <motion.div
                      key={sub._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`list-item ${isToday ? "today" : ""} ${
                        isPast ? "past" : ""
                      }`}
                    >
                      <div className="list-date">
                        <span className="date-day">{date.getDate()}</span>
                        <span className="date-month">
                          {date.toLocaleString("default", { month: "short" })}
                        </span>
                      </div>

                      <div
                        className="list-color"
                        style={{ background: sub.color }}
                      ></div>

                      <div className="list-info">
                        <p className="list-name">{sub.name}</p>
                        <p className="list-category">
                          {sub.category} • {sub.billingCycle}
                        </p>
                      </div>

                      <div className="list-amount">${sub.amount}</div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Calendar;