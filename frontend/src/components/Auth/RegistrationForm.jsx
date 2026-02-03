// src/components/Auth/RegistrationForm.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { registerUser } from "../../services/auth";
import "./auth.css";

export default function RegistrationForm() {
    const navigate = useNavigate();
    const { isAuthenticated, checkingAuth } = useAuth();
    const [form, setForm] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!checkingAuth && isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [checkingAuth, isAuthenticated, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError("Hasła nie są takie same");
            return;
        }

        setLoading(true);
        try {
            await registerUser({
                email: form.email,
                password: form.password,
                username: form.username,
                first_name: form.firstName,
                last_name: form.lastName,
            });
            navigate("/login", {
                state: { registered: true },
            });
        } catch (err) {
            setError(err.response?.data?.detail || "Błąd rejestracji");
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="auth-checking">
                <div className="auth-checking-spinner"></div>
                <p>Sprawdzanie autoryzacji...</p>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-form-wrapper">
                <h2>Rejestracja</h2>
                {error && <p className="auth-error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-input-group">
                        <input
                            name="username"
                            placeholder="Nazwa użytkownika"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-group">
                        <input
                            name="firstName"
                            placeholder="Imię"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-group">
                        <input
                            name="lastName"
                            placeholder="Nazwisko"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-group">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Hasło"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Potwierdź hasło"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Rejestracja..." : "Zarejestruj się"}
                    </button>
                </form>
            </div>
        </div>
    );
}