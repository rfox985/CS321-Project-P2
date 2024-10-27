import pool from '@/src/app/Backend/database';

// Ensures that only post requests can be made
export default async function requestHandler(req, res) {
    if (req.method !== 'POST') {
        res.status(405);
    }

    // Get info from request in the form of JSON data
    // userId: integer, newCurrentStreak: integer, newMaxStreak: integer
    const {userId, newCurrentStreak, newMaxStreak=null} = req.body;

    try {
        // Add the newMaxStreak to query if not null
        const updateStreak = `UPDATE users SET current_streak = $2
                            ${newMaxStreak != null ? ', max_streak = $3' : ''}
                            WHERE uid = $1 
                            RETURNING *`; // Checks if the email already exists
        let paramList = [userId, newCurrentStreak];

        if (newMaxStreak)
            paramList.push(newMaxStreak);

        const result = await pool.query(updateStreak, paramList);    
        
        // No users found in database
        if (result.rowCount == 0) {
            return res.status(400).json({message: 'User not found in database'});
        }

        res.status(201).json({message: 'User streaks updated successfully', user: result.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Database error', error});
    }
}
