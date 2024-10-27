import pool from '@/src/app/Backend/database';

// Ensures that only get or post requests can be made
export default async function requestHandler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        res.status(405);
    }

    // Get info from request in the form of JSON data
    // userId: integer
    const {userId} = req.body;

    try {
        // Get the row in user table
        const getStreak = 'SELECT current_streak, max_streak FROM users WHERE uid = $1'; // Checks if the email already exists
        const result = await pool.query(getStreak, [userId]);    

        if (result.rowCount == 0) {
            res.status(400).json({message: 'Could not find user in database'});
        }

        // Get the streaks
        const current_streak = result.rows[0].current_streak;
        const max_streak = result.rows[0].max_streak;

        res.status(201).json({message: 'Streak found successfully', current_streak, max_streak});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Database error', error});
    }
}
