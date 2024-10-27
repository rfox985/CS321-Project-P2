
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '@/src/app/Backend/database';

// Ensures that only post requests can be made
export default async function requestHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405);
    }

    // Get info from request in the form of JSON data
    // email: string, password: string, rememberMe: any 
    const {email, password, rememberMe} = req.body;

    try { 
        const userQuery = 'SELECT * FROM users WHERE email = $1'; // Check if the user exists in the database
        const {rows}  = await pool.query(userQuery, [email]);

        // If the user doesn't exist
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // First row that conatains a object with data
        const user = rows[0];

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Remember me token lasts for 30 days
        let tokenExpiration;

        if (rememberMe) {
            tokenExpiration = '30d';
        } else {
            tokenExpiration = '30m';
        }
        
        // Create a JWT token
        const token = jwt.sign(
            {userId: user.uid, email: user.email}, 
            process.env.JWT_SECRET,
            {expiresIn: tokenExpiration } 
        );



        res.status(200).json({message: 'Login successful', token, userId: user.uid, email: user.email, 
                            first_name: user.first_name, last_name: user.last_name });
    } catch{
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}