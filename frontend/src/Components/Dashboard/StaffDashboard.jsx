// File: Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
// import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [submittedActivities, setSubmittedActivities] = useState([]);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [pendingForHod, setPendingForHod] = useState([]);
  const [role, setRole] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchAll = async () => {
    const token = localStorage.getItem("User");
    const res = await fetch(`${API_BASE}/activities`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setSubmittedActivities(data);
  };

  const fetchPending = async () => {
    const token = localStorage.getItem("User");
    const res = await fetch(`${API_BASE}/pending-activities`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setPendingActivities(data);
  };

  const fetchPendingForHod = async () => {
    const token = localStorage.getItem("User");
    const res = await fetch(`${API_BASE}/pending-for-hod`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setPendingForHod(data);
  };

 const getTimeAgo = (dateString) => {
   const date = new Date(dateString);
   const now = new Date();
   const diffInMs = now - date;
   const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

   if (diffInDays === 0) return "Today";
   if (diffInDays === 1) return "1 day ago";
   if (diffInDays < 7) return `${diffInDays} days ago`;
   if (diffInDays < 14) return "1 week ago";
   if (diffInDays < 21) return "2 weeks ago";
   if (diffInDays < 30) return "3 weeks ago";
   if (diffInDays < 60) return "1 month ago";
   return `${Math.floor(diffInDays / 30)} months ago`;
 };

  useEffect(() => {
    fetchAll();
    const token = localStorage.getItem("User");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setRole(decoded.role);
        if (decoded.role === "coordinator") fetchPending();
        if (decoded.role === "hod") fetchPendingForHod();
      } catch (err) {
        console.error("Token decode failed");
      }
    }
  }, []);

  const total = submittedActivities.length;
  const approved = submittedActivities.filter(
    (a) => a.status === "approved" && a.hodStatus === "approved"
  ).length;
 const pending = submittedActivities.filter((a) => {
   if (a.status === "pending") return true;
   if (a.status === "approved" && a.hodStatus === "pending") return true;
   return false;
 }).length;
  const rejected = submittedActivities.filter(
    (a) => a.status === "rejected" || a.hodStatus === "rejected"
  ).length;

  const handleAction = async (userId, activityId, status, isHod = false) => {
    const token = localStorage.getItem("User");
    const endpoint = isHod ? "update-hod-status" : "update-activity-status";
    const body = isHod
      ? { userId, activityId, hodStatus: status }
      : { userId, activityId, status };

    await fetch(`${API_BASE}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    fetchPending();
    fetchPendingForHod();
    fetchAll();
  };

  return (
    <div className="dashboard">
      {/* <Sidebar role={role} />git add . */}

      <main className="main">
        <h1>Staff Dashboard</h1>
        <div className="cards">
          <div className="card total">Total Activities: {total}</div>
          <div className="card approved">Approved: {approved}</div>
          <div className="card pending">Pending: {pending}</div>
          <div className="card rejected">Rejected: {rejected}</div>
        </div>

        <h2>My Activities</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Mode</th>
              <th>Start</th>
              <th>End</th>
              <th>Submitted</th>
              <th>Coordinator</th>
              <th>HoD</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {submittedActivities.map((a, i) => (
              <tr key={i}>
                <td>{a.eventType}</td>
                <td>{a.mode}</td>
                <td>{a.startDate}</td>
                <td>{a.endDate}</td>
                <td>
                  <span className="text-gray-600 text-sm">
                    {getTimeAgo(a.submittedAt)}
                  </span>
                </td>
                <td>{a.status}</td>
                <td>{a.status === "rejected" ? "-" : a.hodStatus}</td>
                <td>{a.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Dashboard;
