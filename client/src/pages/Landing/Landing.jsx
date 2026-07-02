import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Landing.css";

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
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
            y: 100,
            opacity: 0,
            duration: 1,
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
          "-=0.6"
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

      // Trust bar
      gsap.from(".trust-item", {
        scrollTrigger: {
          trigger: ".trust-bar",
          start: "top 90%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
      });

      // Features
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Stats numbers count up
      gsap.utils.toArray(".big-stat-number").forEach((el) => {
        const finalValue = el.getAttribute("data-value");
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          textContent: 0,
          duration: 2,
          ease: "power1.inOut",
          snap: { textContent: 1 },
          onUpdate: function () {
            el.innerHTML =
              Math.ceil(this.targets()[0].textContent).toLocaleString() +
              (el.dataset.suffix || "");
          },
        });
      });

      // How it works
      gsap.from(".step-card", {
        scrollTrigger: {
          trigger: ".steps-container",
          start: "top 80%",
        },
        x: -60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Testimonials
      gsap.from(".testimonial-card", {
        scrollTrigger: {
          trigger: ".testimonials-grid",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      });

      // FAQ
      gsap.from(".faq-item", {
        scrollTrigger: {
          trigger: ".faq-container",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="landing">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         HERO SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hero" ref={heroRef}>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Trusted by 10,000+ users worldwide</span>
            </div>

            <h1 className="hero-title">
              <span>Stop</span> <span>Wasting</span> <span>Money</span>
              <br />
              <span>on</span>{" "}
              <span className="gradient-text">Forgotten Subs</span>
            </h1>

            <p className="hero-subtitle">
              The average person wastes $348/year on unused subscriptions.
              SubTracker helps you track, manage, and cancel subscriptions in
              one beautiful dashboard.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="btn-primary btn-lg">
                Start Tracking Free →
              </Link>
              <Link to="/login" className="btn-secondary btn-lg">
                Sign In
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <h3>10K+</h3>
                <p>Active Users</p>
              </div>
              <div className="stat">
                <h3>$2M+</h3>
                <p>Money Saved</p>
              </div>
              <div className="stat">
                <h3>4.9★</h3>
                <p>User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         TRUST BAR
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="trust-bar">
        <div className="container">
          <p className="trust-title">
            Track subscriptions from all your favorite services
          </p>
          <div className="trust-logos">
            {[
              "Netflix",
              "Spotify",
              "Adobe",
              "GitHub",
              "Notion",
              "Figma",
              "Amazon",
              "YouTube",
            ].map((brand, i) => (
              <div key={i} className="trust-item">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         PROBLEM SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="problem-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Problem</span>
            <h2 className="section-title">
              You're probably <span className="gradient-text">losing money</span>{" "}
              right now
            </h2>
          </div>

          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">💸</div>
              <h3 className="big-stat-number" data-value="348" data-suffix="$">
                0
              </h3>
              <p>Average yearly waste on unused subscriptions</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">📉</div>
              <h3 className="big-stat-number" data-value="42" data-suffix="%">
                0
              </h3>
              <p>Of people forget to cancel free trials</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">⏰</div>
              <h3 className="big-stat-number" data-value="12" data-suffix="+">
                0
              </h3>
              <p>Active subscriptions on average per person</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         FEATURES SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">
              Everything you need to <br />
              <span className="gradient-text">take control</span>
            </h2>
            <p className="section-subtitle">
              Powerful features designed to save you time and money
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: "📊",
                title: "Smart Analytics",
                desc: "Beautiful charts showing spending trends, category breakdowns, and monthly insights.",
              },
              {
                icon: "🔔",
                title: "Email Reminders",
                desc: "Get notified 3 days before every renewal. Never get charged for unwanted subs again.",
              },
              {
                icon: "📅",
                title: "Payment Calendar",
                desc: "Visual calendar showing all upcoming payments so you can plan your budget.",
              },
              {
                icon: "💰",
                title: "Save Money",
                desc: "Instantly see which subs to cancel. Users save an average of $50/month.",
              },
              {
                icon: "🌍",
                title: "Multi-Currency",
                desc: "Track subscriptions in USD, EUR, GBP, INR, and 50+ more currencies.",
              },
              {
                icon: "🔒",
                title: "Bank-Level Security",
                desc: "Your data is encrypted with AES-256. We never share or sell your info.",
              },
              {
                icon: "📱",
                title: "Works Everywhere",
                desc: "Fully responsive design. Access your subs from phone, tablet, or laptop.",
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Built with modern tech. Add a subscription in less than 10 seconds.",
              },
              {
                icon: "🎨",
                title: "Beautiful UI",
                desc: "Award-winning design that makes managing finances actually enjoyable.",
              },
            ].map((feature, i) => (
              <div key={i} className="feature-card glass-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         HOW IT WORKS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="how-it-works" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">
              Get started in <span className="gradient-text">3 simple steps</span>
            </h2>
            <p className="section-subtitle">
              From signup to savings in under 5 minutes
            </p>
          </div>

          <div className="steps-container">
            {[
              {
                num: "01",
                icon: "🚀",
                title: "Sign Up Free",
                desc: "Create your account in 30 seconds. No credit card required. 100% free forever.",
              },
              {
                num: "02",
                icon: "➕",
                title: "Add Subscriptions",
                desc: "Add Netflix, Spotify, Adobe, and any other services. Set renewal dates and amounts.",
              },
              {
                num: "03",
                icon: "💎",
                title: "Save Money",
                desc: "Get email reminders, analyze spending patterns, and cancel unused subscriptions.",
              },
            ].map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         TESTIMONIALS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title">
              Loved by <span className="gradient-text">thousands</span>
            </h2>
          </div>

          <div className="testimonials-grid">
            {[
              {
                name: "Sarah Johnson",
                role: "Product Designer",
                avatar: "SJ",
                text: "Saved me $60/month by finding subscriptions I forgot about. The analytics are incredible!",
                rating: 5,
              },
              {
                name: "Mike Chen",
                role: "Software Developer",
                avatar: "MC",
                text: "Best subscription tracker I've used. The UI is stunning and the reminders actually work.",
                rating: 5,
              },
              {
                name: "Emma Wilson",
                role: "Marketing Manager",
                avatar: "EW",
                text: "Finally, a tool that helps me manage all my subscriptions in one place. Highly recommend!",
                rating: 5,
              },
              {
                name: "David Park",
                role: "Freelancer",
                avatar: "DP",
                text: "The calendar view is a game-changer. I can plan my monthly budget easily now.",
                rating: 5,
              },
              {
                name: "Lisa Anderson",
                role: "Student",
                avatar: "LA",
                text: "Free, beautiful, and useful. Cancelled 4 unused subs in the first week!",
                rating: 5,
              },
              {
                name: "Tom Rodriguez",
                role: "Business Owner",
                avatar: "TR",
                text: "Tracking business subscriptions was a nightmare. SubTracker made it effortless.",
                rating: 5,
              },
            ].map((t, i) => (
              <div key={i} className="testimonial-card glass-card">
                <div className="stars">
                  {"★".repeat(t.rating)}
                </div>
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         BIG STATS SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="big-stats">
        <div className="container">
          <div className="big-stats-grid">
            <div className="big-stat-item">
              <h2 className="big-stat-number" data-value="10000" data-suffix="+">
                0
              </h2>
              <p>Happy Users</p>
            </div>
            <div className="big-stat-item">
              <h2 className="big-stat-number" data-value="50000" data-suffix="+">
                0
              </h2>
              <p>Subscriptions Tracked</p>
            </div>
            <div className="big-stat-item">
              <h2 className="big-stat-number" data-value="2000000" data-suffix="$">
                0
              </h2>
              <p>Money Saved</p>
            </div>
            <div className="big-stat-item">
              <h2 className="big-stat-number" data-value="99" data-suffix="%">
                0
              </h2>
              <p>Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         FAQ SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
              {
                q: "Is SubTracker really free?",
                a: "Yes! SubTracker is 100% free forever. No credit card required, no hidden fees, no premium tiers.",
              },
              {
                q: "Is my data safe?",
                a: "Absolutely. We use bank-level AES-256 encryption. We never share, sell, or access your personal data.",
              },
              {
                q: "How do email reminders work?",
                a: "You'll get an email 3 days before each subscription renews (customizable per subscription).",
              },
              {
                q: "Can I use it on my phone?",
                a: "Yes! SubTracker is fully responsive and works beautifully on mobile, tablet, and desktop.",
              },
              {
                q: "What subscriptions can I track?",
                a: "Any subscription! Netflix, Spotify, Adobe, GitHub, gym memberships, magazines - literally anything with a recurring payment.",
              },
              {
                q: "Do you support multiple currencies?",
                a: "Yes, we support 50+ currencies including USD, EUR, GBP, INR, JPY and more.",
              },
            ].map((item, i) => (
              <div key={i} className="faq-item glass-card">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         CTA SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="cta">
        <div className="container">
          <div className="cta-card glass-card">
            <h2>
              Ready to <span className="gradient-text">save money?</span>
            </h2>
            <p>
              Join 10,000+ smart users who took control of their subscriptions.
              Start saving today, completely free.
            </p>
            <Link to="/register" className="btn-primary btn-lg">
              Get Started Free →
            </Link>
            <p className="cta-note">No credit card • Free forever • 30 second setup</p>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         FOOTER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="nav-logo">
                <div className="logo-icon">
                  <span>S</span>
                </div>
                <span>SubTracker</span>
              </div>
              <p>The smartest way to manage subscriptions.</p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#about">How it works</a>
                <a href="#">Pricing</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Blog</a>
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