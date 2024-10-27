
import pool from '@/src/app/Backend/database';

// Ensures that only POST requests can be made
// req body: the user id and the fields they want to update (MUST match database col names)
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
    }

    // Get info from request in the form of JSON data
    const body = req.body;

    try {
        console.log(objToString(body));

        // Update the user's password in the database
        const result = await pool.query(
            `UPDATE users SET ${objToString(body)} WHERE uid = ${body.userId}`
        );

        if (result.rowCount == 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile update successful', user: result.rows[0] });
    } catch (error) {
        console.error('Error during profile update:', error);
        res.status(500).json({ message: 'Invalid or expired token', error });
    }
}

// Function that converts object to a readable format for SQL: key1 = val1, key2 = val2, etc.
function objToString(object) {
    const pairs = [];
    let index = 0;
    
    // For every pair in object, add the string version to the pairs array 
    for (const [key, value] of Object.entries(object)) {
        if (typeof(value) == "string") {
            // For some reason, you need to specify the apostrophes with this syntax
            pairs[index++] = `${key} = '${value}'`;
        }
        else {   
            pairs[index++] = `${key} = ${value}`;
        }
    }

    // Join the strings with a ", " separating them
    return pairs.join(", ");
}
