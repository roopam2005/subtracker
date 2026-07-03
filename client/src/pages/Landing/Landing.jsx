import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Landing.css";

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // HERO ANIMATIONS (immediate)
        const tl = gsap.timeline();

        tl.from(".hero-badge", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        })
          .from(
            ".hero-title span",
            {
              y: 60,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
            },
            "-=0.4"
          )
          .from(
            ".hero-subtitle",
            {
              y: 30,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.4"
          )
          .from(
            ".hero-buttons > *",
            {
              y: 30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: "power3.out",
            },
            "-=0.4"
          )
          .from(
            ".hero-stats > *",
            {
              y: 30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
            },
            "-=0.2"
          );

        // SCROLL ANIMATIONS (with proper trigger)
        gsap.utils.toArray(".animate-on-scroll").forEach((elem) => {
          gsap.from(elem, {
            scrollTrigger: {
              trigger: elem,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        });

        // Refresh ScrollTrigger after animations set up
        ScrollTrigger.refresh();
      });

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing">
      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Stop wasting money on forgotten subs</span>
            </div>

            <h1 className="hero-title">
              <span>Track</span> <span>Every</span> <span>Subscription</span>
              <br />
              <span className="gradient-text">In One Place</span>
            </h1>

            <p className="hero-subtitle">
              The average person wastes <strong>$348/year</strong> on unused
              subscriptions. SubTracker helps you find, manage, and cancel them
              before you get charged.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="btn-primary btn-lg">
                Get Started Free →
              </Link>
              <Link to="/login" className="btn-secondary btn-lg">
                Sign In
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <h3>$348</h3>
                <p>Avg. Yearly Waste</p>
              </div>
              <div className="stat">
                <h3>12+</h3>
                <p>Subs Per Person</p>
              </div>
              <div className="stat">
                <h3>70%</h3>
                <p>Forget Free Trials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="container">
          <p className="trust-title">
            Track subscriptions from all your favorite services
          </p>
          <div className="trust-logos">
            {["Netflix", "Spotify", "Adobe", "GitHub", "Notion", "Figma", "Amazon", "YouTube"].map(
              (brand, i) => (
                <div key={i} className="trust-item">
                  {brand}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Problem</span>
            <h2 className="section-title">
              You're probably <span className="gradient-text">losing money</span> right now
            </h2>
          </div>

          <div className="problem-grid">
            <div className="problem-card animate-on-scroll">
              <div className="problem-icon">💸</div>
              <h3>$348</h3>
              <p>Average yearly waste on unused subscriptions</p>
            </div>
            <div className="problem-card animate-on-scroll">
              <div className="problem-icon">📉</div>
              <h3>70%</h3>
              <p>Of people forget to cancel free trials</p>
            </div>
            <div className="problem-card animate-on-scroll">
              <div className="problem-icon">⏰</div>
              <h3>12+</h3>
              <p>Active subscriptions on average per person</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">
              Everything you need to <span className="gradient-text">take control</span>
            </h2>
            <p className="section-subtitle">
              Powerful features designed to save you time and money
            </p>
          </div>

          <div className="features-grid">
            {[
              { icon: "📊", title: "Smart Analytics", desc: "Beautiful charts showing spending trends and category breakdowns." },
              { icon: "🔔", title: "Email Reminders", desc: "Get notified before every renewal. Never get charged for unwanted subs." },
              { icon: "📅", title: "Payment Calendar", desc: "Visual calendar showing all upcoming payments to plan your budget." },
              { icon: "💰", title: "Save Money", desc: "Instantly see which subs to cancel and take control of expenses." },
              { icon: "🌍", title: "Multi-Currency", desc: "Track subscriptions in USD, EUR, GBP, INR, JPY, and more." },
              { icon: "🔒", title: "Bank-Level Security", desc: "Your data is encrypted with AES-256. We never share your info." },
              { icon: "📱", title: "Works Everywhere", desc: "Fully responsive design. Access from phone, tablet, or laptop." },
              { icon: "⚡", title: "Lightning Fast", desc: "Built with modern tech. Add a subscription in less than 10 seconds." },
              { icon: "🎨", title: "Beautiful UI", desc: "Award-winning design that makes managing finances enjoyable." },
            ].map((feature, i) => (
              <div key={i} className="feature-card glass-card animate-on-scroll">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">
              Get started in <span className="gradient-text">3 simple steps</span>
            </h2>
          </div>

          <div className="steps-container">
            {[
              { num: "01", icon: "🚀", title: "Sign Up Free", desc: "Create your account in 30 seconds. No credit card required." },
              { num: "02", icon: "➕", title: "Add Subscriptions", desc: "Add Netflix, Spotify, Adobe, and any other services." },
              { num: "03", icon: "💎", title: "Save Money", desc: "Get reminders and cancel what you don't use." },
            ].map((step, i) => (
              <div key={i} className="step-card animate-on-scroll">
                <div className="step-number">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title">
              Loved by <span className="gradient-text">early users</span>
            </h2>
          </div>

          <div className="testimonials-grid">
            {[
              { name: "Sarah Johnson", role: "Product Designer", avatar: "SJ", text: "Saved me $60/month by finding subscriptions I forgot about." },
              { name: "Mike Chen", role: "Software Developer", avatar: "MC", text: "Best subscription tracker I've used. The UI is stunning." },
              { name: "Emma Wilson", role: "Marketing Manager", avatar: "EW", text: "Finally, a tool that helps me manage all my subs in one place." },
              { name: "David Park", role: "Freelancer", avatar: "DP", text: "The calendar view is a game-changer for planning my budget." },
              { name: "Lisa Anderson", role: "Student", avatar: "LA", text: "Beautiful design. Cancelled 4 unused subs in the first week!" },
              { name: "Tom Rodriguez", role: "Business Owner", avatar: "TR", text: "Tracking business subscriptions was a nightmare. Not anymore." },
            ].map((t, i) => (
              <div key={i} className="testimonial-card glass-card animate-on-scroll">
                <div className="stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.avatar}</div>
                  <div>
                    <h4>{t.name}</h4>
                    <p>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIG STATS */}
      <section className="big-stats">
        <div className="container">
          <div className="big-stats-grid">
            <div className="big-stat-item animate-on-scroll">
              <h2>$348</h2>
              <p>Avg. Yearly Waste</p>
            </div>
            <div className="big-stat-item animate-on-scroll">
              <h2>12+</h2>
              <p>Subs Per Person</p>
            </div>
            <div className="big-stat-item animate-on-scroll">
              <h2>70%</h2>
              <p>Forget Free Trials</p>
            </div>
            <div className="big-stat-item animate-on-scroll">
              <h2>100%</h2>
              <p>Free Forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          <div className="faq-container">
            {[
              { q: "Is my financial data safe?", a: "Absolutely. SubTracker does NOT connect to your bank account. You manually enter subscription details, so we never see your credit card numbers. All data is encrypted with AES-256." },
              { q: "How do the email reminders work?", a: "You set a 'Reminder Days' value for each subscription (e.g., 3 days). Our system automatically emails you before the renewal date." },
              { q: "Can I track free trials?", a: "Yes! Add a free trial with its end date, and we'll remind you before you get charged so you can cancel in time." },
              { q: "What can I track with SubTracker?", a: "Anything with recurring payments! Netflix, Spotify, Adobe, GitHub, gym memberships, cloud storage - literally any subscription." },
              { q: "Does it work on my phone?", a: "Yes! SubTracker is fully responsive and works beautifully on mobile, tablet, and desktop." },
              { q: "Do you support multiple currencies?", a: "Yes! You can track subscriptions in USD, EUR, GBP, INR, JPY, and many other currencies." },
              { q: "Can I categorize my subscriptions?", a: "Absolutely. Organize into Entertainment, Music, Software, Gaming, Fitness, and more categories." },
              { q: "How is my data stored?", a: "Your data is stored securely in encrypted MongoDB databases with industry-standard security practices." },
            ].map((item, i) => (
              <div key={i} className="faq-item glass-card animate-on-scroll">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-card glass-card animate-on-scroll">
            <h2>
              Ready to <span className="gradient-text">take control?</span>
            </h2>
            <p>Start managing your subscriptions the smart way. Zero cost, zero hassle.</p>
            <Link to="/register" className="btn-primary btn-lg">
              Get Started Now →
            </Link>
            <p className="cta-note">100% Free • No Credit Card • Setup in 30 Seconds</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="nav-logo">
                <span className="logo-text">
                  Sub<span className="logo-accent">Tracker</span>
                </span>
              </div>
              <p>The smartest way to manage subscriptions.</p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#about">How it works</a>
                <a href="#">Dashboard</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Blog</a>
                <a href="#">Help</a>
                <a href="#">Contact</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Security</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 SubTracker. Built with ❤️ for smart subscribers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;