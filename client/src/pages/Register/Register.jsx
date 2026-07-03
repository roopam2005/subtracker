import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import gsap from "gsap";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register, user } = useAuth();
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
        stagger: 0.08,
        delay: 0.3,
        ease: "power3.out",
        clearProps: "all", // 👈 This ensures elements stay visible after animation
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success("Account created successfully! 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "#ef4444";
    if (passwordStrength <= 3) return "#f59e0b";
    return "#10b981";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
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
            <h1>Create Account 🚀</h1>
            <p>Start managing your subscriptions today</p>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        background: getStrengthColor(),
                      }}
                    ></div>
                  </div>
                  <span
                    className="strength-text"
                    style={{ color: getStrengthColor() }}
                  >
                    {getStrengthText()}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔐</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <span className="password-mismatch">
                    ⚠️ Passwords do not match
                  </span>
                )}
            </div>

            {/* Terms */}
            <label className="checkbox-label terms-label">
              <input type="checkbox" required />
              <span>
                I agree to the{" "}
                <a href="#" className="auth-link">Terms</a> and{" "}
                <a href="#" className="auth-link">Privacy Policy</a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                <>Create Account →</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Sign in link */}
          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
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

export default Register;