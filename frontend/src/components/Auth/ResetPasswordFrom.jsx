import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/auth";
import "./auth.css";

export default function ResetPasswordForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate("/", { replace: true });
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setError("Hasła nie są takie same");
            return;
        }

        try {
            await resetPassword(token, newPassword);
            navigate("/login", { replace: true });
        } catch (err) {
            if (err.response?.status === 400 || err.response?.status === 403) {
                setError("Link do resetu hasła jest nieprawidłowy lub wygasł");
            } else {
                setError("Błąd podczas resetowania hasła");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form-wrapper">
                <h2>Ustaw nowe hasło</h2>
                {error && (
                    <p className="auth-error-message">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-input-group">
                        <input
                            type="password"
                            placeholder="Nowe hasło"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-input-group">
                        <input
                            type="password"
                            placeholder="Potwierdź nowe hasło"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Resetowanie..." : "Zresetuj hasło"}
                    </button>
                </form>
            </div>
        </div>
    );
}