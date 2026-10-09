import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <h1>FreelanceFlow</h1>
          <p>
            Manage your clients, projects, and freelance
            income in one place.
          </p>
        </div>

        <div className="auth-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;