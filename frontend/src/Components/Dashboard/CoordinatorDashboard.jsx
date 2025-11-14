import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Sidebar from "./SideBar";

const CoordinatorDashboard = () => {
  const [pendingActivities, setPendingActivities] = useState([]);
  const [role, setRole] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchPending = async () => {
    const token = localStorage.getItem("User");
    const res = await fetch(`${API_BASE}/pending-activities`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setPendingActivities(data);
  };

  const handleAction = async (userId, activityId, status) => {
    const token = localStorage.getItem("User");
    await fetch(`${API_BASE}/update-activity-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, activityId, status }),
    });

    fetchPending(); // Refresh after action
  };

  useEffect(() => {
    fetchPending();
    const token = localStorage.getItem("User");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setRole(decoded.role);
      } catch (err) {
        console.error("Token decode failed");
      }
    }
  }, []);

  return (
    <div className="dashboard">
      <Sidebar role={role} />
      <main className="main">
        <h2>Coordinator - Pending Approvals</h2>
        {pendingActivities.length === 0 ? (
          <p>No pending activities</p>
        ) : (
          <ul>
            {pendingActivities.map((item, i) => (
              <li key={i}>
                <strong>{item.staffName}</strong> submitted: {item.eventType} (
                {item.mode}) from {item.startDate} to {item.endDate}
                <br />
                <button
                  onClick={() =>
                    handleAction(item.userId, item.activityId, "approved")
                  }
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    handleAction(item.userId, item.activityId, "rejected")
                  }
                >
                  Reject
                </button>
                <hr />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default CoordinatorDashboard;
