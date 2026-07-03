import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import gsap from "gsap";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".auth-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".auth-form > *", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ease: "power3.out",
        clearProps: "all",
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back! 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" ref={formRef}>
      <div className="auth-container">
        <div className="auth-card glass-card">
          {/* Header */}
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-text">
                Sub<span className="logo-accent">Tracker</span>
              </span>
            </Link>
            <h1>Welcome Back 👋</h1>
            <p>Sign in to manage your subscriptions</p>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="auth-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>Sign In →</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Sign up link */}
          <p className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Create one now
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <Link to="/" className="back-home">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default Login;