import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/auth";
import { useAuth } from "../../context/useAuth";

export default function ForgotPasswordForm() {
    const { checkingAuth, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!checkingAuth && isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [checkingAuth, isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await forgotPassword(email);
            navigate("/forgot-password/sent", { replace: true });
        } catch (err) {
            setError(err.response?.data?.detail || "Błąd podczas resetowania hasła");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <h2>Resetowanie hasła</h2>
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
                        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
                    {loading ? "Wysyłanie..." : "Wyślij link do resetowania hasła"}
                </button>
            </form>
        </div>
    );
}
