
import React, {useState} from "react";
import {FaEnvelope} from "react-icons/fa";
import "./ForgotPasswordForm.css"; 

interface ForgotPasswordFormProps {
    onSwitchForm: (form: string) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchForm }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/forgotpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Password reset email sent successfully! Please check your inbox.");
                setError("");
                setTimeout(() => {onSwitchForm("login");}, 2000);
            } else {
                setError(data.message || "Failed to send password reset email.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Forgot Password</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FaEnvelope className="icon" />
                </div>
                <button type="submit">Send Reset Link</button>
                <div className="register-link">
                    <p>
                        Remembered your password?{" "}
                        <a href="#" onClick={() => onSwitchForm("login")}>
                            Login
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;