import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Sidebar from "./Sidebar";



const SubmitActivity = () => {
  const [formData, setFormData] = useState({
    eventType: "",
    mode: "",
    startDate: "",
    endDate: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [role, setRole] = useState("");
  const navigate = useNavigate();

  // Decode token to get role on mount
  useEffect(() => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("User");
    const res = await fetch(`${API_BASE}/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Submitted!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar role={role} />

      <main className="main">
        <h1>Submit New Activity</h1>
        <div className="activity-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Event Type</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
              >
                <option value="">Select Event</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="FDP">FDP</option>
                <option value="STTP">STTP</option>
                <option value="Course">Course</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                required
              >
                <option value="">Select Mode</option>
                <option value="Attended">Attended</option>
                <option value="Conducted">Conducted</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit">Submit Activity</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SubmitActivity;
