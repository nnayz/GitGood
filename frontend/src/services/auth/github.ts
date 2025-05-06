import axios from "axios";

// Define environment variables with clear fallbacks
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';

// Log the environment variables for debugging
console.log('API_URL:', API_URL);
console.log('GITHUB_CLIENT_ID:', GITHUB_CLIENT_ID);

export const startGithubAuth = async () => {
    if (!GITHUB_CLIENT_ID) {
        console.error('GitHub Client ID is not defined in environment variables');
        alert('Authentication configuration error. Please contact the administrator.');
        return;
    }
    
    const redirectUri = window.location.origin + "/auth/callback";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email,repo`;
};

export const handleGithubCallback = async (code: string) => {
    if (!code || code.trim() === '') {
        throw new Error('No authorization code provided');
    }
    
    try {
        // Exchange the code for an access token
        const response = await axios.post(`${API_URL}/auth/github/callback`, { code });
        return response.data;
    } catch (error) {
        console.error("Github auth error", error);
        if (axios.isAxiosError(error) && error.response) {
            console.error("Error response data:", error.response?.data);
            console.error("Error response status:", error.response?.status);
        }
        throw error;
    }
}

export const verifyAuth = async () => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        return false;
    }
    
    try {
        const response = await axios.get(`${API_URL}/auth/verify`, {
            headers: {
                'Authorization': token
            }
        });
        return response.data.authenticated;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
};

export const isAuthenticated = () => {
    return localStorage.getItem("auth_token") !== null;
}

export const getToken = () => {
    return localStorage.getItem("auth_token");
}

export const getUserData = () => {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
}

export const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    window.location.href = "/";
}

