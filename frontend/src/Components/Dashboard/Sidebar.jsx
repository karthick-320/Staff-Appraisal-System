// File: components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; 

const Sidebar = ({ role }) => {
  return (
    <aside className="sidebar">
      <h2>Appraisal</h2>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/submit-activity">Submit Activity</Link>
        </li>
        {role === "coordinator" && (
          <li>
            <Link to="/coordinatorpanel">Coordinator Panel</Link>
          </li>
        )}
        {role === "hod" && (
          <li>
            <Link to="/hodpanel">HoD Panel</Link>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
