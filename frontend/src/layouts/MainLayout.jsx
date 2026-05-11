import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  TrendingUp,
  FileText,
  Star,
  Activity,
  Search,
} from "lucide-react";

import { useSelector } from "react-redux";
import { useAuth } from "../hooks/auth";

const MainLayout = () => {
  const navigate = useNavigate();
  const { logout, getWhoAmI } = useAuth();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    getWhoAmI();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Candidate Detail", path: "/search-candidate", icon: Search },
    { name: "Candidates List", path: "/candidates", icon: Users },
    { name: "Add Candidate", path: "/add-candidate", icon: Users },
    { name: "Set Score", path: "/set-score", icon: Star },
    { name: "Performance", path: "/performance", icon: TrendingUp },
    { name: "AI Generated Summary", path: "/summary", icon: FileText },
    { name: "Stream Scores", path: "/stream-scores", icon: Activity },
  ];

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div
          className="logo"
          style={{
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "var(--primary)",
              borderRadius: "8px",
            }}
          ></div>
          <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>
            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
          </span>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <item.icon />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={handleLogout}
            className="nav-item"
            style={{
              background: "none",
              border: "none",
              width: "100%",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <LogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
