import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./css/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role || "";

  const navigate = useNavigate();

  const tabs = [
    { label: "Home", path: "/home" },
    { label: "Add Subjects", path: "/home/add-subjects", allowedRoles: ["admin", "teacher"] },
    { label: "Delete Subject", path: "/home/delete-subject", allowedRoles: ["admin", "teacher"] },
    { label: "Add Teachers", path: "/home/add-teachers", allowedRoles: ["admin"] },
    { label: "Delete Teachers", path: "/home/delete-teachers", allowedRoles: ["admin"] },
    { label: "Add Labs & Classes", path: "/home/add-labs-classes", allowedRoles: ["admin"] },
    { label: "Delete Labs & Classes", path: "/home/delete-labs-classes", allowedRoles: ["admin"] },
    { label: "Add Time Slots", path: "/home/add-time-slots", allowedRoles: ["admin"] },
    { label: "Timetable Builder", path: "/home/timetable-builder", allowedRoles: ["admin", "teacher"] },
    { label: "Timetable View", path: "/home/timetable-view", allowedRoles: ["admin", "teacher"] },
    { label: "Change Password", path: "/home/change-password", allowedRoles: ["admin", "teacher"] },
    { label: "Your Time Table", path: "/home/user-timetable", allowedRoles: ["teacher"] },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // 🔒 Filter tabs based on allowedRoles
  const visibleTabs = tabs.filter(
    (tab) => !tab.allowedRoles || tab.allowedRoles.includes(role)
  );

  return (
    <div className="neon-dashboard">
      <aside className="sidebar">
        <h2 className="logo">Time Table Generator</h2>
        <nav className="nav">
          {visibleTabs.map((tab) => (
            <NavLink
              key={tab.label}
              to={tab.path}
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <NavLink to="/" onClick={handleLogout}>
            Logout
          </NavLink>
        </div>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
