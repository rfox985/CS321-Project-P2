
import pool from '@/src/app/Backend/database';

// Ensures that only get or post requests can be made
// req body: { userId: int }
export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        res.status(405);
    }

    // Get the ID of the current user in the request body
    // userId: integer
    const { userId } = req.body;

    try {
        // FIXME: need to get user based on email
        const userQuery = 'SELECT * FROM users WHERE uid = $1'; // Get the user row with the corresponding id
        const {rows, rowCount} = await pool.query(userQuery, [userId]);    
        
        // Should not get here if already logged in
        if (rowCount == 0) {
            res.status(400).json({message: 'User not found.'});
        }

        res.status(201).json({message: 'Got user successfully', user: rows[0]});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Database error', error});
    }
}
