// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "@/pages/Home";

//// Student Pages
//import StudentDashboard from "@/pages/student/Dashboard";
//import StudentProfile from "@/pages/student/Profile";
//import StudentApplications from "@/pages/student/Applications";
//import StudentDocuments from "@/pages/student/Documents";
//
//// Validator Pages
//import ValidatorDashboard from "@/pages/validator/Dashboard";
//import ValidatorReview from "@/pages/validator/Review";
//
//// Sponsor Pages
//import SponsorDashboard from "@/pages/sponsor/Dashboard";
//import SponsorScholarships from "@/pages/sponsor/Scholarships";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
