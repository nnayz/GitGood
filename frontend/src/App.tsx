import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GithubCallback from './components/Auth/GithubCallback';
import AuthGuard from './components/Auth/AuthGuard';
import Login from './pages/Login';
import Home from './pages/Home';
import axios from 'axios';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(!!localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      
      // Check if we have a token
      const hasToken = !!localStorage.getItem('auth_token');
      if (hasToken) {
        try {
          const token = localStorage.getItem('auth_token');
          const API_URL = import.meta.env.VITE_API_URL;
          
          // Verify token with backend
          await axios.get(`${API_URL}/auth/verify`, {
            headers: {
              'Authorization': token
            }
          });
          
          setAuthenticated(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          setAuthenticated(false);
        }
      } else {
        setAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    
    verifyAuth();
    
    // Listen for storage events (in case another tab logs out)
    const handleStorageChange = () => {
      setAuthenticated(!!localStorage.getItem('auth_token'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          authenticated ? 
            <AuthGuard><Home /></AuthGuard> : 
            <Navigate to="/login" replace />
        } />
        <Route path="/login" element={
          !authenticated ? 
            <Login /> : 
            <Navigate to="/" replace />
        } />
        <Route path="/auth/callback" element={<GithubCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;