import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Sprawdzenie stanu zalogowania po reloadzie
    useEffect(() => {
        const loggedIn = sessionStorage.getItem("loggedIn") === "true";
        setIsAuthenticated(loggedIn);
        setCheckingAuth(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const formData = new URLSearchParams();
            formData.append("grant_type", "password");
            formData.append("username", email);
            formData.append("password", password);

            await api.post("/auth/login", formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                withCredentials: true,
            });

            // zapisujemy tylko fakt, że user jest zalogowany
            setIsAuthenticated(true);
            sessionStorage.setItem("loggedIn", "true");

        } catch (err) {
            setIsAuthenticated(false);
            sessionStorage.removeItem("loggedIn");

            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) setError("Invalid email or password");
                else setError("Server error, please try again later");
            } else {
                setError("Unknown error");
            }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
        } catch { }
        setIsAuthenticated(false);
        sessionStorage.removeItem("loggedIn");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, checkingAuth, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
