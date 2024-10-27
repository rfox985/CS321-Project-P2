// HOW TO RUN: Node src/app/Backend/dbsetup.js <keep | reset>
// Must run from "CS321-Project" folder
// NOTE: need to do "npm install dotenv" for this to work

// Get the Postgres module and the postgres login
const { Pool } = require("pg");
require("dotenv").config({path: ".env.local"});

// Command-line args: keep current users table vs full reset
if (process.argv.length != 3 || (process.argv[2] != 'keep' && process.argv[2] != 'reset')) {
    console.log("\nPlease run this file as: \x1b[31m Node src/app/Backend/dbsetup.js <keep | reset> \x1b[0m");
    console.log("If 'keep': your current users are saved, and only the columns are altered.");
    console.log("If 'reset': your current users table starts from scratch again.");
    console.log("  If you have no previous tables created, please use 'reset' as well.\n\n");
    process.exit(-1);
}

// Get the postgres credentials from .env.local in project
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

let userQuery = '';

// Keep users: just alter the columns
if (process.argv[2] == 'keep') {
    userQuery = `
        DO
        $$
            BEGIN
                ALTER TABLE users
                    RENAME COLUMN id TO uid;
            EXCEPTION
                WHEN undefined_column THEN
            END;
        $$;

        ALTER TABLE users ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS max_streak integer DEFAULT 0;`;
}

// Reset users: drop current table and create new one
else {
    userQuery = `DROP TABLE IF EXISTS users;

                CREATE TABLE users (
                    uid SERIAL PRIMARY KEY,                                 
                    email VARCHAR(255) UNIQUE NOT NULL, 
                    password VARCHAR(255) NOT NULL,     
                    first_name VARCHAR(100) NOT NULL,   
                    last_name VARCHAR(100) NOT NULL,    
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    current_streak integer DEFAULT 0,
                    max_streak integer DEFAULT 0
                );`
}

// The final query for the tables
// Drop the new tables if something went wrong before
const query = 
    `
    DROP TABLE IF EXISTS exercises, workouts, performed;
    ${userQuery}

    CREATE TABLE exercises (
        eid SERIAL PRIMARY KEY,
        ename VARCHAR(50) UNIQUE NOT NULL, 
        muscle_group VARCHAR(50) NOT NULL   
    );

    CREATE TABLE workouts (
        wid SERIAL PRIMARY KEY,          
        uid integer REFERENCES users ON DELETE CASCADE,
        done_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        how_long integer CHECK (how_long > 0)
    );

    CREATE TABLE performed (
        wid integer REFERENCES workouts ON DELETE CASCADE,
        eid integer REFERENCES exercises ON DELETE CASCADE,                                 
        num_sets integer NOT NULL,
        weight decimal CHECK (weight > 0),
        PRIMARY KEY (wid, eid)
    );`;       

// Do the operations
async function doQuery() {
    try {
        // Wait for query to finish
        await pool.query(query);
        console.log("Successfully Updated Database");
      } catch (error) {
        console.error('Error executing query:', error);
      } finally {
        // Release the client back to the pool
        await pool.end(); 
      }
}

doQuery();