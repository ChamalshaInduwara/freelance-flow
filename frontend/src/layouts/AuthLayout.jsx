import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import { CheckCircle2, TrendingUp, ShieldCheck, Zap } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        {/* Left Side: Brand & Feature Showcase */}
        <div className="auth-brand">
          <div className="auth-brand-ambient-glow"></div>
          
          <div className="auth-logo-wrapper">
            <Logo size="large" />
          </div>

          <div className="auth-hero-text">
            <h1>The Intelligent CRM for Modern Freelancers</h1>
            <p className="auth-brand-tagline">
              Track projects, manage client relationships, and automate payment flows effortlessly in one unified dashboard.
            </p>
          </div>

          <div className="auth-features-grid">
            <div className="auth-feature-card">
              <div className="feature-icon-box">
                <TrendingUp size={20} />
              </div>
              <div>
                <h4>Revenue Analytics</h4>
                <p>Real-time monthly revenue & payment tracking</p>
              </div>
            </div>

            <div className="auth-feature-card">
              <div className="feature-icon-box">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4>Secure & Organized</h4>
                <p>Keep client contacts & invoices in one place</p>
              </div>
            </div>

            <div className="auth-feature-card">
              <div className="feature-icon-box">
                <Zap size={20} />
              </div>
              <div>
                <h4>Fast Project Pipeline</h4>
                <p>Kanban project status & milestone manager</p>
              </div>
            </div>
          </div>

          <div className="auth-trust-badge">
            <div className="avatar-group">
              <span className="mini-avatar av1">A</span>
              <span className="mini-avatar av2">M</span>
              <span className="mini-avatar av3">S</span>
            </div>
            <p>Trusted by thousands of freelancers worldwide</p>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="auth-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;