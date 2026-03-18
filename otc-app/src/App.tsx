import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth } from './components/layout/RequireAuth';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Auth pages
import { SignUp } from './pages/SignUp';
import { Verification } from './pages/Verification';
import { SignIn } from './pages/SignIn';
import { MfaChallenge } from './pages/MfaChallenge';

// Protected pages
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Kyc } from './pages/Kyc';
import { Wallets } from './pages/Wallets';
import { Requests } from './pages/Requests';
import { RequestDetail } from './pages/RequestDetail';
import { CreateRequest } from './pages/create-request';
import { ApiDocs } from './pages/ApiDocs';
import { Security } from './pages/Security';
import { Support } from './pages/Support';

// Governance pages
import { GovernanceLayout } from './governance/components/layout/governance-layout';
import { DashboardPage } from './governance/pages/dashboard';
import { CommunityPage } from './governance/pages/community';
import { VotePage } from './governance/pages/vote/page';
import { ResultsPage } from './governance/pages/results/page';
import { CreateProposalPage } from './governance/pages/proposals/create';
import { FaqPage } from './governance/pages/faq';

export default function App() {
  return (
    <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public auth routes */}
            <Route path="/otc-uat/signup" element={<SignUp />} />
            <Route path="/otc-uat/verify" element={<Verification />} />
            <Route path="/otc-uat/signin" element={<SignIn />} />
            <Route path="/otc-uat/mfa" element={<MfaChallenge />} />

            {/* Protected routes */}
            <Route element={<RequireAuth />}>
              <Route element={<DashboardLayout />}>
                <Route path="/otc-uat/dashboard" element={<Dashboard />} />
                <Route path="/otc-uat/profile" element={<Profile />} />
                <Route path="/otc-uat/kyc" element={<Kyc />} />
                <Route path="/otc-uat/wallets" element={<Wallets />} />
                <Route path="/otc-uat/requests" element={<Requests />} />
                <Route path="/otc-uat/requests/new" element={<CreateRequest />} />
                <Route path="/otc-uat/requests/:id" element={<RequestDetail />} />
                <Route path="/otc-uat/api-docs" element={<ApiDocs />} />
                <Route path="/otc-uat/security" element={<Security />} />
                <Route path="/otc-uat/support" element={<Support />} />

                {/* Governance routes */}
                <Route element={<GovernanceLayout />}>
                  <Route path="/otc-uat/governance" element={<DashboardPage />} />
                  <Route path="/otc-uat/governance/community" element={<CommunityPage />} />
                  <Route path="/otc-uat/governance/vote/:id" element={<VotePage />} />
                  <Route path="/otc-uat/governance/results/:id" element={<ResultsPage />} />
                  <Route path="/otc-uat/governance/proposals/create" element={<CreateProposalPage />} />
                  <Route path="/otc-uat/governance/faq" element={<FaqPage />} />
                </Route>
              </Route>
            </Route>

            {/* Redirect root to signin */}
            <Route path="/otc-uat" element={<Navigate to="/otc-uat/signin" replace />} />
            <Route path="/otc-uat/" element={<Navigate to="/otc-uat/signin" replace />} />

            {/* Admin routes — uses opaque-session auth (no Amplify) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/otc-uat/signin" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
    </ThemeProvider>
  );
}
