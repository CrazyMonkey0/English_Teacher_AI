import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/users/me", { withCredentials: true });
                setUser(res.data);
                setIsAuthenticated(true);
            } catch {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setCheckingAuth(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const formData = new URLSearchParams();
            formData.append("grant_type", "password");
            formData.append("username", email);
            formData.append("password", password);
            formData.append("scope", "");
            formData.append("client_id", "");
            formData.append("client_secret", "");

            const res = await api.post("/auth/login", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                withCredentials: true,
            });
            setUser(res.data.user);
            setIsAuthenticated(true);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setError("Invalid email or password");
                } else {
                    setError("Server error, please try again later");
                }
            } else {
                setError("Unknown error");
            }
            setIsAuthenticated(false);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, checkingAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}