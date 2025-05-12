import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { handleGithubCallback } from '../services/auth/github';

export function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            handleGithubCallback(code)
                .then((data) => {
                    login(data.token, data.user);
                    navigate('/');
                })
                .catch((error) => {
                    console.error('Authentication failed:', error);
                    navigate('/login');
                });
        } else {
            navigate('/login');
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
} 