
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '@/src/app/Backend/database';
import nodemailer from 'nodemailer'

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, // Gmail address
      pass: process.env.EMAIL_PASS, // Gmail password or app-specific password
    },
  });

// Ensures that only post requests can be made
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get info from request in the form of JSON data
    // email: string
    const {email} = req.body;

    try {
        const {rows} = await pool.query('SELECT * FROM users WHERE email = $1', [email]);// Checks if user exisits 

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
      
        // First row that conatins a object with data
        const user = rows[0];
      
        // Create a reset token that expires in 1 hour -> 10 minutes
        const resetToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '10m'});
      
        // Reset URL (adjust for frontend route)
        const resetUrl = `http://localhost:3000/changePassword?token=${resetToken}`;
      
        // Send password reset email
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Sender address
            to: email, // Receiver address
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please use the following link: ${resetUrl}`, // Plain text body
            html: `<p>You requested a password reset. Please use the following link:</p><a href="${resetUrl}">Reset Password</a>`, // HTML body
        });

        res.status(200).json({message: 'Password reset successful'});
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({message: 'Invalid or expired token', error});
  }
}
