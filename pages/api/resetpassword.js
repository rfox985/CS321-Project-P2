import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '@/src/app/Backend/database';

// Ensures that only POST requests can be made
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get info from request in the form of JSON data
    // token: string, newPassword: string
    const { token, newPassword } = req.body;

    try {
        // Verify the token to extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        const result = await pool.query(
            'UPDATE users SET password = $1 WHERE uid = $2 RETURNING id, email', [hashedPassword, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Password reset successful', user: result.rows[0] });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Invalid or expired token', error });
    }
}
