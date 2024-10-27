import pool from '@/src/app/Backend/database';

// Ensures that only post requests can be made
export default async function requestHandler(req, res) {
    if (req.method !== 'POST') {
        res.status(405);
    }

    // Get info from request in the form of JSON data
    // eid: integer
    const {eid} = req.body;

    try {
        const deleteWorkout = 'DELETE FROM exercises WHERE eid = $1 RETURNING *';
        const result = await pool.query(deleteWorkout, [eid]);    

        if (result.rowCount == 0) {
            return res.status(400).json({message: 'Exercise never existed.'});
        }

        res.status(201).json({message: 'Exercise deleted successfully', exercise: result.rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Database error', error});
    }
}
