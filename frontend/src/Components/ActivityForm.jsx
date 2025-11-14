// ActivityForm.jsx
import React, { useState } from "react";

const ActivityForm = () => {
  const [activities, setActivities] = useState({
    organized: {
      conferences: "",
      workshops: "",
      seminars: "",
      aicte_sttp: "",
      atal_fdp: "",
      au_fdp: "",
    },
    attended: {
      atal_fdp: "",
      swayam_fdp: "",
      aicte_sttp: "",
      nitttr_fdp: "",
      internships: "",
    },
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e, category, type) => {
    setActivities((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/api/user/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(activities),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Activity saved successfully!");
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Organized Activities</h2>
      <input
        type="text"
        placeholder="Conferences"
        value={activities.organized.conferences}
        onChange={(e) => handleChange(e, "organized", "conferences")}
      />
      <input
        type="text"
        placeholder="Workshops"
        value={activities.organized.workshops}
        onChange={(e) => handleChange(e, "organized", "workshops")}
      />
      {/* Add other organized fields similarly */}

      <h2>Attended Activities</h2>
      <input
        type="text"
        placeholder="ATAL FDP"
        value={activities.attended.atal_fdp}
        onChange={(e) => handleChange(e, "attended", "atal_fdp")}
      />
      {/* Add other attended fields similarly */}

      <button type="submit">Submit Activities</button>
    </form>
  );
};

export default ActivityForm;
