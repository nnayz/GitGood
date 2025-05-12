import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthCallback } from './pages/AuthCallback';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuth } from './contexts/AuthContext';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? 
          <ProtectedRoute><Dashboard /></ProtectedRoute> : 
          <Navigate to="/login" replace />
      } />
      <Route path="/login" element={
        !isAuthenticated ? 
          <Login /> : 
          <Navigate to="/" replace />
      } />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;