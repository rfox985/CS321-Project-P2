'use client'

import React, {useState} from "react";
import {FaUser, FaLock} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import "./LoginForm.css";


interface LoginFormProps {
    onSwitchForm: (form: string) => void;
    setCurrentName: (name: string) => void;
    setCurrentId: (uid: number) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchForm, setCurrentName, setCurrentId }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({ email: username, password }), 
            });

            const data = await response.json(); 

            if (response.ok) {
                localStorage.setItem("token", data.token);

                localStorage.setItem("userId", data.userId);
                localStorage.setItem("first_name", data.first_name);


                setSuccess(data.message); 
                setError(""); 
                setCurrentId(data.userId);
                setCurrentName(data.first_name);
                onSwitchForm('main');
            } else {
                setError(data.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="wrapper">
            <img src="logo.png" alt="Logo" className="logo" />
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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

                <div className="remember-forgot">
                    <label>
                        <input type="checkbox" />
                        Remember Me
                    </label>
                    <a href="#" onClick={() => onSwitchForm("forgotPassword")}>
                        Forgot Password
                    </a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>
                        Don't have an account?{" "}
                        <a href="#" onClick={() => onSwitchForm("register")}>
                            Register
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;