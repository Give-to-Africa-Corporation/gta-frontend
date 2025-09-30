import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import AfricaYouthCouncil from "./components/ayc/AfricaYouthCouncil";
import { Navbar } from "./components/shared/Navbar";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Contact from "./pages/Contact";
import FrontlineFund from "./pages/FrontLine";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CampaignDetail from "./pages/campaigns/CampaignDetail";
import CampaignEmbed from "./pages/campaigns/CampaignEmbed";
import CampaignsPage from "./pages/campaigns/CampaignsPage";
import CreateCampaign from "./pages/campaigns/CreateCampaign";
import Dashboard from "./pages/dashboard/Dashboard";
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import Registration from "./pages/registration/Registration";
import VerificationPending from "./pages/registration/VerificationPending";
import VerificationRejected from "./pages/registration/VerificationRejected";
import NgoCampaignPage from "./pages/ngocampaignpage/NgoCampaignPage";
import NgoSearchPage from "./pages/ngocampaignpage/NgoSearchPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/frontline-fund" element={<FrontlineFund />} />
            <Route
              path="/frontline-fund/payment/success"
              element={<PaymentSuccess />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/registration" element={<Registration />} />
            <Route
              path="/verification-pending"
              element={<VerificationPending />}
            />
            <Route
              path="/verification-rejected"
              element={<VerificationRejected />}
            />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/campaigns/:id/donate" element={<PaymentPage />} />
            <Route
              path="/campaigns/:id/payment/success"
              element={<PaymentSuccess />}
            />
            <Route path="/campaigns/:id/embed" element={<CampaignEmbed />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected NGO Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="ngo">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/campaigns/new"
              element={
                <ProtectedRoute role="ngo">
                  <CreateCampaign />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/campaigns/edit/:campaignId"
              element={
                <ProtectedRoute role="ngo">
                  <CreateCampaign />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* Africa Youth Council Routes */}
            <Route path="/ayc" element={<AfricaYouthCouncil />} />
            <Route path="/ngos" element={<NgoSearchPage />} />
            <Route path="ngo-campaigns/:id" element={<NgoCampaignPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
  
);

export default App;
