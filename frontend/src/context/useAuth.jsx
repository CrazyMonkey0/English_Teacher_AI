// src/context/useAuth.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, getCurrentUser } from "../services/auth";
import { initCsrf } from "../services/csrf";
import { getCookie } from "../services/cookies";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                if (getCookie('csrftoken') === undefined) {
                    await initCsrf();
                }
                // SPRAWDŹ NAJPIERW localStorage
                const cachedAuth = localStorage.getItem('isAuthenticated');
                const cachedUser = localStorage.getItem('user');

                if (cachedAuth === 'true' && cachedUser) {
                    // Użytkownik był zalogowany - ustaw stan z cache
                    if (isMounted) {
                        setUser(JSON.parse(cachedUser));
                        setIsAuthenticated(true);
                        setCheckingAuth(false);
                    }

                    // OPCJONALNIE: Zweryfikuj w tle (silent refresh)
                    // To nie blokuje UI, ale sprawdza czy token jest nadal ważny
                    try {
                        const userData = await getCurrentUser();
                        if (isMounted) {
                            setUser(userData);
                            localStorage.setItem('user', JSON.stringify(userData));
                        }
                    } catch (err) {
                        // Token wygasł - wyloguj
                        if (isMounted) {
                            setUser(null);
                            setIsAuthenticated(false);
                            localStorage.removeItem('isAuthenticated');
                            localStorage.removeItem('user');
                        }
                    }
                } else {
                    // Brak cache - sprawdź na serwerze
                    const userData = await getCurrentUser();
                    if (isMounted) {
                        setUser(userData);
                        setIsAuthenticated(true);
                        localStorage.setItem('isAuthenticated', 'true');
                        localStorage.setItem('user', JSON.stringify(userData));
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setUser(null);
                    setIsAuthenticated(false);
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('user');
                }
            } finally {
                if (isMounted) {
                    setCheckingAuth(false);
                }
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    const login = async (email, password) => {
        await initCsrf();
        setLoading(true);
        setError(null);
        try {
            const userData = await loginUser(email, password);
            setUser(userData);
            setIsAuthenticated(true);

            // Zapisz w localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
            setError("Nieprawidłowy email lub hasło");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            await initCsrf();
            setUser(null);
            setIsAuthenticated(false);

            // Usuń z localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                checkingAuth,
                error,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);