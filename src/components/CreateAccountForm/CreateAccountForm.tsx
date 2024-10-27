
import React, {useState} from "react";
import {FaUser, FaLock, FaEnvelope} from "react-icons/fa";
import "./CreateAccountForm.css"; // Ensure the correct CSS file is linked

interface CreateAccountFormProps {
    onSwitchForm: (form: string) => void;
}

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ onSwitchForm }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, firstName, lastName }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Signup successful! Redirecting to login...");
                setError("");
                setTimeout(() => {onSwitchForm("login");}, 2000);
            } else {
                setError(data.message || "Failed to sign up");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Create Account</h1>
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
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaLock className="icon" />
                </div>
                <button type="submit">Create Account</button>
                <div className="register-link">
                    <p>
                        Already have an account?{" "}
                        <a href="#" onClick={() => onSwitchForm("login")}>
                            Login
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default CreateAccountForm;