import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleGithubCallback } from '../../services/auth/github';

const GithubCallback = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
        const data = await handleGithubCallback(code);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        navigate('/');
      } catch (err) {
        setError('Failed to authenticate');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    processAuth();
  }, [location, navigate]);

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