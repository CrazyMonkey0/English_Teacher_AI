import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/auth";
import { useAuth } from "../../context/useAuth";
import "./auth.css";

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
        <div className="auth-page">
            <div className="auth-form-wrapper">
                <h2>Resetowanie hasła</h2>
                {error && (
                    <p className="auth-error-message">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Wysyłanie..." : "Wyślij link do resetowania hasła"}
                    </button>
                </form>
            </div>
        </div>
    );
}
