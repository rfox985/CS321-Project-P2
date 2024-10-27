
import bcrypt from 'bcrypt';
import pool from '@/src/app/Backend/database';

// Ensures that only post requests can be made
export default async function requestHandler(req, res) {
    if (req.method !== 'POST') {
        res.status(405);
    }

    // Get info from request in the form of JSON data
    // email: string, password: string, firstName: string, lastName: string
    const {email, password, firstName, lastName} = req.body;

    try {
        const checkEmail = 'SELECT * FROM users WHERE email = $1'; // Checks if the email already exists
        const {rowCount} = await pool.query(checkEmail, [email]);    
        
        if (rowCount > 0) {
            return res.status(400).json({message: 'Email already in use'});
        }

        // Password hashing 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        const insert = 
            `INSERT INTO users (email, password, first_name, last_name) 
            VALUES ($1, $2, $3, $4) 
            RETURNING uid, email, first_name, last_name`;

        // Insert new user into the database
        const result = await pool.query(insert, [email, hashedPassword, firstName, lastName]);
        
        res.status(201).json({message: 'User created successfully', user: result.rows[0]});
} catch (error) {
    console.error(error);
    res.status(500).json({message: 'Database error', error});
    }
}
