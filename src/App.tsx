import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GuestRoute } from "./components/GuestRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ProviderDetail from "./pages/ProviderDetail";
import Dashboard from "./pages/Dashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import HowItWorks from "./pages/HowItWorks";
import BecomeProvider from "./pages/BecomeProvider";
import AdminDashboard from "./pages/AdminDashboard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SocketProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/providers/:id" element={<ProviderDetail />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole="CLIENT">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/provider-dashboard" 
              element={
                <ProtectedRoute requiredRole="PROVIDER">
                  <ProviderDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              } 
            />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route 
              path="/forgot-password" 
              element={
                <GuestRoute>
                  <ForgotPassword />
                </GuestRoute>
              } 
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/become-provider" element={<BecomeProvider />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
      </SocketProvider>
    </AuthProvider>
  </QueryClientProvider>
);


export default App;
