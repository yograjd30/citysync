import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SimulationProvider } from './context/SimulationContext';
import { LivingBackground } from './components/layout/LivingBackground';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AuthCallback } from './pages/AuthCallback';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <LivingBackground stability={85}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LivingBackground>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SimulationProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </SimulationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
