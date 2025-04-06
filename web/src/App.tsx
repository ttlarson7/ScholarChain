// src/App.tsx

import React, { JSX } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import Home from "@/pages/Home";

// Context
import { UserTypeProvider, useUserType } from "@/contexts/UserTypeContext";

// Import for future pages (commented out for now)
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

import "@mysten/dapp-kit/dist/index.css";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const networks = {
  devnet: { url: getFullnodeUrl("devnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
};

// Protected route component
const ProtectedRoute = ({
  children,
  requiredUserType,
}: {
  children: JSX.Element;
  requiredUserType: "student" | "validator" | "sponsor";
}) => {
  const { userType, isLoggedIn } = useUserType();

  if (!isLoggedIn || userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Placeholder components for dashboard pages
// You'll replace these with actual implementations later
const StudentDashboard = () => <div>Student Dashboard</div>;
const ValidatorDashboard = () => <div>Validator Dashboard</div>;
const SponsorDashboard = () => <div>Sponsor Dashboard</div>;

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>
          <UserTypeProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />

                {/* Student Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute requiredUserType="student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Validator Routes */}
                <Route
                  path="/validator/dashboard"
                  element={
                    <ProtectedRoute requiredUserType="validator">
                      <ValidatorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Sponsor Routes */}
                <Route
                  path="/sponsor/dashboard"
                  element={
                    <ProtectedRoute requiredUserType="sponsor">
                      <SponsorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </UserTypeProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default App;
