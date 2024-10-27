import React, { useState, useEffect } from 'react';
import './EditProfile.css';
import Navbar from '../Navbar/Navbar'; 

interface EditProfileProps {
    onSwitchForm: (formName: string) => void;
    userId: number
}

const EditProfile: React.FC<EditProfileProps> = ({ onSwitchForm, userId }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Get user's profile data
    useEffect(() => {
        fetch("/api/profile/getprofile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({ userId: userId }),
        }).then(response => {   // Get the response json if ok
            if (response.ok) {
                return response.json();
            }
            throw new Error("Error getting profile from database.");
        })
        .then((data) => {
            console.log(data.user);
            const user = data.user;

            // Update user info
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setEmail(user.email || '');

        // If there is an error with getting the info, return to main page
        }).catch((error) => {
            console.error(error);
            setError(error.message);
            setMessage("");
            setTimeout(() => {onSwitchForm("main")}, 2000);
        })

        console.log(`Got user profile: ${firstName} ${lastName} from ${email}`);

    }, []);

    // When saving:
    const handleSaveChanges = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {       
            // Update the profile in the database with the new values
            const response = fetch("/api/profile/updateprofile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                // Add whatever fields are updated in this: email, first_name, and/or last_name (no specific order)
                body: JSON.stringify({ userId: userId, email: email, first_name: firstName, last_name: lastName }), 
            });

            // If there was an issue updating, throw an error
            if (!(await response).ok) {
                throw new Error("Update was not successful");
            }

            // Else print success message and go back to main page
            setMessage("Profile updated successfully!");
            setLoading(false);
            setTimeout(() => onSwitchForm('main'), 2000);
        } catch (e) {
            setError('Failed to save profile. Please try again.');
            setLoading(false);
        }
    };

    return (

        <div className="wrapper">
            <h1>Edit Profile</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder="First Name"
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder="Last Name"
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="email" 
                        placeholder="Email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder="Password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => onSwitchForm('main')} 
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
