import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  WalletCards,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h2 className="brand">FreelanceFlow</h2>

          <nav className="nav-list">
            <NavLink to="/dashboard" className="nav-link">
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink to="/clients" className="nav-link">
              <Users size={18} />
              Clients
            </NavLink>

            <NavLink to="/projects" className="nav-link">
              <FolderKanban size={18} />
              Projects
            </NavLink>

            <NavLink to="/payments" className="nav-link">
              <WalletCards size={18} />
              Payments
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <p>{user?.name}</p>

          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;