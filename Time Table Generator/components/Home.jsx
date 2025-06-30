import React from "react";
import { NavLink, Outlet } from "react-router-dom"; // ✅ Import NavLink
import "./css/Home.css";

const Home = () => {
    const tabs = [
        { label: "Home", path: "/" },
        { label: "Add Subjects", path: "/add-subjects" },
        { label: "Delete Subject", path: "/delete-subject" },
        { label: "Add Teachers", path: "/add-teachers" },
        { label: "Delete Teachers", path: "/delete-teachers" },
        { label: "Add Labs & Classes", path: "/add-labs-classes" },
        { label: "Delete Labs & Classes", path: "/delete-labs-classes" },
        { label: "Add Time Slots", path: "/add-time-slots" },
        { label: "Timetable Builder", path: "/timetable-builder" },
        { label: "Timetable View", path: "/timetable-view" },
    ];

    return (
        <div className="neon-dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2 className="logo">Time Table Generator</h2>
                <nav className="nav">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.label}
                            to={tab.path}
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                            {tab.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <NavLink to="/">Logout</NavLink>
                </div>
            </aside>
            <main>
                <Outlet/>
            </main>
        </div>
    );
};

export default Home;
