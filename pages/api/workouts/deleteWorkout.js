import pool from '@/src/app/Backend/database';

// Ensures that only post requests can be made
export default async function requestHandler(req, res) {
    if (req.method !== 'POST') {
        res.status(405);
    }

    // Get info from request in the form of JSON data
    // userId: integer, wid: integer, done_on: timestamp string
    const {userId, wid, done_on=null} = req.body;

    try {
        const deleteWorkout = 'DELETE FROM workouts WHERE uid = $1 AND wid = $2 RETURNING *';
        const result = await pool.query(deleteWorkout, [userId, wid]);    

        if (result.rowCount == 0) {
            return res.status(400).json({message: 'Workout never existed.'});
        }

        res.status(201).json({message: 'Workout deleted successfully', workout: result.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Database error', error});
    }
}
