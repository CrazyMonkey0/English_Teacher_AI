// src/components/Auth/LoginForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function LoginForm() {
    const { login, error, loading, isAuthenticated, checkingAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const registered = location.state?.registered;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!checkingAuth && isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [checkingAuth, isAuthenticated, navigate]);

    useEffect(() => {
        if (location.state?.registered) {
            navigate(location.pathname, { replace: true });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/", { replace: true });
        } catch {
            // error handling is done in the context
        }
    };

    if (checkingAuth) {
        return (
            <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center", padding: "50px" }}>
                <p>Sprawdzanie autoryzacji...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            {registered && (
                <p style={{ color: "green" }}>
                    Rejestracja zakończona sukcesem 🎉 Zaloguj się poniżej.
                </p>
            )}
            <h2>Zaloguj się</h2>
            {error && (
                <p style={{ color: "red", marginBottom: 10 }}>
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 10 }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Logowanie..." : "Zaloguj"}
                </button>
            </form>
        </div>
    );
}