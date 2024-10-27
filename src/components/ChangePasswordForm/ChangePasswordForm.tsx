'use client'

import React, {useState, useEffect } from 'react';
import './ChangePasswordForm.css';
import {FaLock} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
// import jwt from 'jsonwebtoken';

interface ChangePasswordFormProps {
  onSwitchForm: (form: string) => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSwitchForm }) => {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Example: localhost:3000/?token=abcdef&test=123
    // Domain = localhost:3000; Search params are the things after the question mark: token=abcdef and test=123 
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');
    const router = useRouter();

    // If an empty array is given as the second argument, the input function is run when page is first rendered
    useEffect(() => {
      // If there is no token or if the token is invalid, display the error and go back to login page 
      if (!token) {
        setError('Missing token. Please retry the link in your email or request for a new email.');
        setTimeout(() => {onSwitchForm("login")}, 2000);
      }
      
      // try {
      //   jwt.verify(token, process.env.JWT_SECRET);
      // }
      // catch (err) {
      //   setError('Invalid token. Please create a new token to change your password.');
      //   setTimeout(() => {onSwitchForm("login")}, 2000);
      // }

    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

    try {
        // Call API handler to reset password in database with token
        const response = await fetch('/api/resetpassword', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }), 
        });

        const data = await response.json();

        if (response.ok) {
            router.replace('/');
            setSuccess('Password has been reset successfully.');
            setError('');
            setTimeout(() => {onSwitchForm("login")}, 2000);  // Note: simply goes to default App page; is currently Login page 
        } else {
            setError(data.message || 'Failed to reset password.');
        }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }
    };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Change Password</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div className="input-box">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>
        <button type="submit">Change Password</button>
        <div className="register-link">
          <p>
            Already have an account?{' '}
            <a href="#" onClick={() => onSwitchForm("login")}>Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;