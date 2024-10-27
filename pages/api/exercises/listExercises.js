import pool from '@/src/app/Backend/database';

// Ensures that only get or post requests can be made
export default async function requestHandler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        res.status(405);
    }

    // Empty request body

    try {
        // Select all the exercises
        const getExercises = 'SELECT * FROM exercises ORDER BY ename';
        const {rows} = await pool.query(getExercises, []);    

        res.status(201).json({message: 'Got exercises successfully', rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Database error', error});
    }
}
