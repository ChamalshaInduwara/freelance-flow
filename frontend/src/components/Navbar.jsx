import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  WalletCards,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      if (scrollPos > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const mainEl = document.querySelector(".main-content");
    if (mainEl) {
      mainEl.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (mainEl) {
        mainEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/clients", label: "Clients", icon: Users },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/payments", label: "Payments", icon: WalletCards },
    { to: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <header className={`navbar-header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand / Logo section - Vertically Centered */}
        <div className="navbar-brand">
          <NavLink to="/dashboard" className="logo-link">
            <Logo size="normal" />
          </NavLink>
        </div>

        {/* Desktop Navigation Links - Vertically Centered */}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-tab ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop User Section - Vertically Centered */}
        <div className="desktop-user-section">
          <NavLink to="/profile" className="user-profile-badge-link">
            <div className="user-profile-badge">
              <div className="user-avatar-circle">
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={14} />}
              </div>
              <span className="user-name">{user?.name || "User"}</span>
            </div>
          </NavLink>

          <button onClick={handleLogout} className="navbar-logout-btn" title="Sign out">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Responsive Mobile Hamburger Toggle Button */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="mobile-menu-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <Logo size="small" />
              <button
                className="mobile-close-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
              <div className="mobile-user-card">
                <div className="user-avatar-circle large">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
                </div>
                <div className="mobile-user-info">
                  <p className="mobile-user-name">{user?.name || "User"}</p>
                  <p className="mobile-user-email">{user?.email || "freelancer@flow.com"}</p>
                </div>
              </div>
            </NavLink>

            <nav className="mobile-nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `mobile-nav-item ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="mobile-menu-footer">
              <button onClick={handleLogout} className="mobile-logout-btn">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
