import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`navbar ${scrolled ? "scrolled" : ""}`}
    >
      <div className="nav-container">
        {/* Logo */}
      <Link to="/" className="nav-logo">
       <span className="logo-text">
       Sub<span className="logo-accent">Tracker</span>
       </span>
      </Link>

        {/* Desktop Menu */}
        <div className="nav-menu-desktop">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/analytics" className="nav-link">Analytics</Link>
              <button onClick={handleLogout} className="btn-primary">Logout</button>
            </>
          ) : (
            <>
              <a href="#features" className="nav-link">Features</a>
              <a href="#about" className="nav-link">About</a>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isOpen ? "open" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="nav-menu-mobile"
      >
        {user ? (
          <>
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link to="/analytics" onClick={() => setIsOpen(false)}>Analytics</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <a href="#features" onClick={() => setIsOpen(false)}>Features</a>
            <a href="#about" onClick={() => setIsOpen(false)}>About</a>
            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>Get Started</Link>
          </>
        )}
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;