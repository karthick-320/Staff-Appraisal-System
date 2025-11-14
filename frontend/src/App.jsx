import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import "./App.css";
import StaffDashboard from "./Components/Dashboard/StaffDashboard";
import CoordinatorDashboard from "./Components/Dashboard/CoordinatorDashboard";
import SubmitActivity from "./Components/Dashboard/SubmitActivity";
import HodDashboard from "./Components/Dashboard/HodDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="/submit-activity" element={<SubmitActivity />} />{" "}
        <Route path="coordinatorpanel" element={<CoordinatorDashboard />} />
        <Route path="/hodpanel" element={<HodDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

