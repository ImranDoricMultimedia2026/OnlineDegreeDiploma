import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingContact } from './components/layout/FloatingContact';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { HomePage } from './pages/HomePage';
import { CollegesPage } from './pages/CollegesPage';
import { CollegeDetailPage } from './pages/CollegeDetailPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ApplyNowPage } from './pages/ApplyNowPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// ScrollToTop Helper
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main Layout Component
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] font-sans text-[#333333]">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
          {/* Public Routes with Main Navbar & Footer */}
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route
            path="/about"
            element={
              <MainLayout>
                <AboutPage />
              </MainLayout>
            }
          />
          <Route
            path="/colleges"
            element={
              <MainLayout>
                <CollegesPage />
              </MainLayout>
            }
          />
          <Route
            path="/colleges/:slug"
            element={
              <MainLayout>
                <CollegeDetailPage />
              </MainLayout>
            }
          />
          <Route
            path="/programs"
            element={
              <MainLayout>
                <ProgramsPage />
              </MainLayout>
            }
          />
          <Route
            path="/programs/:slug"
            element={
              <MainLayout>
                <ProgramDetailPage />
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            }
          />
          <Route
            path="/apply"
            element={
              <MainLayout>
                <ApplyNowPage />
              </MainLayout>
            }
          />
          <Route
            path="/login"
            element={
              <MainLayout>
                <LoginPage />
              </MainLayout>
            }
          />
          <Route
            path="/register"
            element={
              <MainLayout>
                <RegisterPage />
              </MainLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <MainLayout>
                <ForgotPasswordPage />
              </MainLayout>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <MainLayout>
                <ResetPasswordPage />
              </MainLayout>
            }
          />

          {/* Protected Student Dashboard */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <StudentDashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Dashboard */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdminRole={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 Route */}
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFoundPage />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  </ErrorBoundary>
);
}
