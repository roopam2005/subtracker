import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import "./Sidebar.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    { path: "/dashboard", icon: "◈", label: "Dashboard" },
    { path: "/analytics", icon: "◉", label: "Analytics" },
    { path: "/calendar", icon: "◐", label: "Calendar" },
    { path: "/settings", icon: "◎", label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className={`hamburger-line ${mobileOpen ? "open" : ""}`}></span>
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sidebar-overlay"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
      {/* Logo */}
      <div className="sidebar-logo">
      <NavLink to="/dashboard" className="logo-link">
      {!collapsed ? (
      <span className="logo-full">
        Sub<span className="logo-accent">Tracker</span>
      </span>
      ) : (
      <span className="logo-mini">
        S<span className="logo-accent">T</span>
      </span>
    )}
  </NavLink>

  <button
    className="collapse-btn desktop-only"
    onClick={() => setCollapsed(!collapsed)}
  >
    {collapsed ? "→" : "←"}
  </button>
</div>

{/* User Info */}
{!collapsed && (
  <div className="user-info-card">
    <p className="user-greeting">Signed in as</p>
    <p className="user-name-text">{user?.name}</p>
    <p className="user-email-text">{user?.email}</p>
  </div>
)}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {!collapsed && <span className="nav-indicator"></span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">⏻</span>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;