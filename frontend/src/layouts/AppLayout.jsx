import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AppLayout = () => {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <div className="main-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;