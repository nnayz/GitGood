import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { verifyAuth, getUserData } from "../services/auth/github";
import { User } from "../models/user";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string, userData: User) => Promise<void>;
    logout: () => void;
}

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(getUserData());
    const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        if (token) {
            verifyToken();
        }
    }, [token]);

    const verifyToken = async () => {
        try {
            const isAuth = await verifyAuth();
            if (isAuth) {
                setIsAuthenticated(true);
                // Update user data from localStorage
                setUser(getUserData());
            } else {
                logout();
            }
        } catch (error) {
            console.error("Token verification failed", error);
            logout();
        }
    }

    const login = async (token: string, userData: User) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            token, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}