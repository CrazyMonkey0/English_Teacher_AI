import "./auth.css";

export default function ForgotPasswordSent() {
    return (
        <div className="auth-page">
            <div className="confirmation-card">
                <div className="confirmation-icon">✓</div>
                <h2>Sprawdź email</h2>
                <p>
                    Jeśli konto z tym adresem email istnieje,
                    wysłaliśmy link do zmiany hasła.
                </p>
            </div>
        </div>
    );
}
