import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const VITE_GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
// const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET;

export const startGithubAuth = async () => {
    const redirectUri = window.location.origin + "/auth/callback";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${VITE_GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email,repo`;
};

export const handleGithubCallback = async (code: string) => {
    try {
        // Exchange the code for an access token
        const response = await axios.post(`${API_URL}/auth/github/callback`, { code });
        return response.data;
    } catch (error) {
        console.error("Github auth error", error);
        throw error;
    }
}

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

