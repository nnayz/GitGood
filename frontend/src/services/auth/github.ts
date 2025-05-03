import axios from "axios";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET;
const API_URL = import.meta.env.VITE_API_URL;

export const startGithubAuth = async () => {
    const redirectUrl = window.location.origin + "/auth/callback";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email,repo`;
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