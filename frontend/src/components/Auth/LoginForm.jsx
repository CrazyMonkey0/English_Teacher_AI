import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function LoginForm() {
    const { login, error, loading, isAuthenticated, checkingAuth } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // If already authenticated, redirect to chat
    useEffect(() => {
        if (!checkingAuth && isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [checkingAuth, isAuthenticated, navigate]);

    if (checkingAuth) return <p>Sprawdzanie autoryzacji...</p>; // albo spinner



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(email, password);
            // po poprawnym logowaniu
            navigate("/", { replace: true });
        } catch {
            // błąd jest obsłużony w useAuth (error state)
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
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
