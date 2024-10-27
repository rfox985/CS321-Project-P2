import pool from '@/src/app/Backend/database';

// Ensures that only post requests can be made
export default async function requestHandler(req, res) {
    if (req.method !== 'POST') {
        res.status(405);
    }

    // Get info from request in the form of JSON data
    // Body: exerciseName: string; muscleGroup: string
    const {exerciseName, muscleGroup} = req.body;

    try {
        // Insert into database
        const insert = 
            `INSERT INTO exercises (ename, muscle_group) 
            VALUES ($1, $2) 
            RETURNING eid`;

        // Insert new exercise into the database
        const result = await pool.query(insert, [exerciseName, muscleGroup]);
        
        res.status(201).json({message: 'Exercise created successfully', exerciseId: result.rows[0].eid});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Database error', error});
    }
}
