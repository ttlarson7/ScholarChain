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

import '@mysten/dapp-kit/dist/index.css';

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const networks = {
	devnet: { url: getFullnodeUrl('devnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={networks} defaultNetwork="testnet">
      <WalletProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
        </WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
  );
};

export default App;
