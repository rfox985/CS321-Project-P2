import React, { useState, useEffect } from "react";
import "./Navbar.css";

interface NavbarProps {
    onSwitchForm: (form: string) => void;
    name: string;
}

const greetingMessage = (name: string) => {
    const currentTime = new Date().toLocaleTimeString().split(":");
    const morningOrNight = currentTime[2].split(" ")[1];

    if (parseInt(currentTime[0]) <= 11 && morningOrNight === "AM") {
        return `☀️ Good Morning, ${name}`;
    } else if (parseInt(currentTime[0]) >= 4 && morningOrNight === "PM") {
        return `🌙 Good Evening, ${name}`;
    }
    return `☀️ Good Afternoon, ${name}`;
};

const Navbar: React.FC<NavbarProps> = ({ onSwitchForm, name }) => {
    const [isLightMode, setIsLightMode] = useState(false);

    const handleToggle = () => {
        setIsLightMode(!isLightMode);
    };

    useEffect(() => {
        if (isLightMode) {
            document.body.classList.add("light-mode");
            document.body.classList.remove("dark");
        } else {
            document.body.classList.add("dark");
            document.body.classList.remove("light-mode");
        }
    }, [isLightMode]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        onSwitchForm("login");
    };

    return (
        <>
            {/* Sidebar */}
            <div className={`sidebar ${isLightMode ? "light" : ""}`}>
                {/* <div className="welcome-message">{greetingMessage(name)}</div> */}
                <div className="logo-content">
                    <div className="logo">
                        <img
                            src="/logo2.png"
                            alt="Logo"
                            className="logo-icon"
                        />
                    </div>
                </div>
                <ul className="nav-list">
                    <li>
                        <a href="#" onClick={() => onSwitchForm("main")}>
                            <i className="bx bx-home"></i>
                            <span className="links-name">Home</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={() => onSwitchForm("calorieCalculator")}
                        >
                            <i className="bx bx-calculator"></i>
                            <span className="links-name">
                                Calorie Calculator
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => onSwitchForm("editProfile")}>
                            <i className="bx bx-user"></i>
                            <span className="links-name">Edit Profile</span>
                        </a>
                    </li>
                </ul>
                <div className="bottom-controls">
                    <div className="sign-out">
                        <a href="#" onClick={handleLogout}>
                            <i className="bx bx-log-out"></i>
                            <span className="links-name">Sign Out</span>
                        </a>
                    </div>

                    <div className="theme-toggle" onClick={handleToggle}>
                        <i
                            className={`bx ${
                                isLightMode ? "bx-moon" : "bx-sun"
                            }`}
                        ></i>
                        {isLightMode ? "Dark Mode" : "Light Mode"}
                    </div>
                </div>
            </div>
            {/* Main Content */}
        </>
    );
};

export default Navbar;
