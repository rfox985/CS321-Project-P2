"use client";

import React, { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm/LoginForm";
import CreateAccountForm from "../components/CreateAccountForm/CreateAccountForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm/ForgotPasswordForm";
import ChangePasswordForm from "../components/ChangePasswordForm/ChangePasswordForm";
import { Streak } from "@/components/Streak/Streak";
import { WeeklyCalendar } from "@/components/WeeklyCalendar/WeeklyCalendar";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar/Navbar";
import CalorieCalculatorForm from "../components/CalorieCalculatorForm/CalorieCalculatorForm";
import EditProfileForm from "../components/EditProfileForm/EditProfile"; 
import { WorkoutGraph } from "@/components/WorkoutGraph/WorkoutGraph";
import "./globals.css"

export default function App() {
    const [currentForm, setCurrentForm] = useState("main");

    const router = useRouter();
    const searchParams = useSearchParams();
    const form = searchParams?.get("form");
    const [currentName, setCurrentName] = useState("Default");
    const [currentId, setCurrentId] = useState(-1);

    useEffect(() => {
        if (form) {
            setCurrentForm(form);
            console.log(form);
            // router.replace('/');
        }
    }, []);

    const renderForm = () => {
        switch (currentForm) {
            case "login":
                return <LoginForm onSwitchForm={setCurrentForm} setCurrentName={setCurrentName} setCurrentId={setCurrentId}/>;
            case "register":
                return <CreateAccountForm onSwitchForm={setCurrentForm} />;
            case "forgotPassword":
                return <ForgotPasswordForm onSwitchForm={setCurrentForm} />;
            case "changePassword":
                return <ChangePasswordForm onSwitchForm={setCurrentForm} />;
            case "main":
                return <>
                    <Navbar onSwitchForm={setCurrentForm} name={currentName} />
                    <WorkoutGraph />
                    <Streak />
                    <WeeklyCalendar />
                </>;
            case "calorieCalculator":
                return <>
                    <Navbar onSwitchForm={setCurrentForm} name={currentName} />
                    <CalorieCalculatorForm onSwitchForm={setCurrentForm} />
                </>;
            case "editProfile":
                return <EditProfileForm onSwitchForm={setCurrentForm} userId={currentId} />;
            default:
                return <LoginForm onSwitchForm={setCurrentForm} setCurrentName={setCurrentName} setCurrentId={setCurrentId} />;
        }
    };

    return (
        <>
            {/* Logo outside the login box */}
            {renderForm()}
        </>
    );
}
