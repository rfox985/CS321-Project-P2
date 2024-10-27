import pool from '@/src/app/Backend/database';

// Ensures that only post requests can be made
export default async function requestHandler(req, res) {
    if (req.method !== 'POST') {
        res.status(405);
    }

    // Get info from request in the form of JSON data
    // To insert timestamp: format = '2020-06-22 19:10:25-07'
    // Input exercise names vs ids?
    // userId: integer, done_on: timestamp string, howLong: integer
    // exercises: [ {eid/name: integer/string, numSets: integer, weight: decimal} ]
    const {userId, done_on=null, howLong, exercises=[]} = req.body;

    try {
        // Insert into database
        const insertWorkout = 
            `INSERT INTO workouts (uid, how_long) 
            VALUES ($1, $2)
            RETURNING wid`;

        // Insert new user into the database
        const result = await pool.query(insertWorkout, [userId, howLong]);
        const wid = result.rows[0].wid;
        
        // Prepare the tuples for insertion (wid, eid, num_sets, weight)
        const inputs = exercises.map((exercise) => {
            return `(${wid}, ${exercise.eid}, ${exercise.numSets}, ${exercise.weight})`;
        });

        // Connect the tuple lists
        const inputStr = inputs.join(",");

        // Insert into database
        const insertExercises = 
            `INSERT INTO performed (wid, eid, num_sets, weight) 
            VALUES ${inputStr}
            RETURNING eid, num_sets, weight`;

        const {rowCount} = await pool.query(insertExercises);
        if (rowCount == 0) {
            res.status(400).json({message: 'The exercises were not successfully linked to your workout'})
        }
            
        res.status(201).json({message: 'Workout added successfully', workoutId: result.rows[0].wid});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Database error', error});
    }
}
