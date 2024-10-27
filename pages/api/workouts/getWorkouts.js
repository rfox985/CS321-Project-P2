import pool from '@/src/app/Backend/database';

// Ensures that only get or post requests can be made
export default async function requestHandler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        res.status(405);
    }

    // Get info from request in the form of JSON data
    // NOTE: timeFromNow should be in format "<int> <unit>" like "30 day"
    // userId: integer, timeFromNow: string like above
    const {userId, timeFromNow=null} = req.body;

    try {
        // Get the workouts by the current user and the time difference from now
        let timeStr = '';

        if (timeFromNow != null) {
            timeStr = `AND done_on > now() - '${timeFromNow}'::interval`;
        }

        const getWorkouts = `SELECT wid, done_on, how_long FROM workouts WHERE uid = $1 ${timeStr}`;
        console.log(getWorkouts);

        const {rows} = await pool.query(getWorkouts, [userId]);    
        
        res.status(201).json({message: 'Got workouts successfully', workouts: rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Database error', error});
    }
}
