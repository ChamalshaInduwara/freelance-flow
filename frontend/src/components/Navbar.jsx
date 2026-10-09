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
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Responsive Mobile Navigation Dropdown (Comes Down smoothly) */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-dropdown-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-dropdown-header">
              <span className="mobile-dropdown-title">Navigation</span>
            </div>

            <nav className="mobile-dropdown-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `mobile-dropdown-item ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={19} className="mobile-dropdown-icon" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="mobile-dropdown-divider" />

            <div className="mobile-dropdown-user-row">
              <NavLink to="/profile" className="mobile-dropdown-profile-link" onClick={() => setMobileMenuOpen(false)}>
                <div className="user-avatar-circle">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={14} />}
                </div>
                <div className="mobile-dropdown-user-text">
                  <span className="mobile-dropdown-user-name">{user?.name || "User"}</span>
                  <span className="mobile-dropdown-user-email">{user?.email || "freelancer@flow.com"}</span>
                </div>
              </NavLink>

              <button onClick={handleLogout} className="mobile-dropdown-logout-btn" title="Logout">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
