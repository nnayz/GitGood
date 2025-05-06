import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { handleGithubCallback } from '../../services/auth/github';
import axios from 'axios';

const GithubCallback = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');
    
    if (!code) {
      setError('No authorization code found');
      setLoading(false);
      return;
    }

    const processAuth = async () => {
      try {
        // Exchange code for token
        const data = await handleGithubCallback(code);
        
        // Store data in localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        // Verify the token before redirecting
        try {
          const API_URL = import.meta.env.VITE_API_URL;
          await axios.get(`${API_URL}/auth/verify`, {
            headers: {
              'Authorization': data.token
            }
          });
          
          // Force a complete page reload to refresh the app state
          window.location.href = '/';
        } catch (verifyError) {
          console.error('Token verification failed:', verifyError);
          // Still redirect if verification fails, as we already have the token
          window.location.href = '/';
        }
      } catch (err) {
        setError('Failed to authenticate');
        console.error('Auth error:', err);
        setLoading(false);
      }
    };

    processAuth();
  }, [location]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return null;
};

export default GithubCallback;