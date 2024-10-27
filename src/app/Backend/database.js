// In order to run on your local machine you have https://www.postgresql.org/download/

/*
    Press Win + S and search for "Environment Variables".
    Click on "Edit the system environment variables".
    In the System Properties window, click on "Environment Variables".
    Under "System variables", find and select the Path variable, then click "Edit".
    Click "New" and add the path to the bin folder where psql.exe is located (e.g., C:\Program Files\PostgreSQL\<version>\bin).
    Click "OK" to save and close all dialogs.
*/

// Run "psql -U postgres" to PostgreSQL on command line
// CREATE DATABASE test_db; to createdatabase
// \c test_db;   to select the newly created db

// \dt         -- List tables
// \d users    -- Describe the users table
// SELECT * FROM <table_name>; -- View Table

// Configure .env.local to your local machines credentials 
// Run npm install pg bcrypt jsonwebtoken 

// /Library/PostgreSQL/16/bin/psql -U postgres


/* -----------------------------------------------------------------
10/10: Commands to run in postgres

If you want to keep your old user table, run these 3 commands:
  ALTER TABLE users RENAME COLUMN id TO uid;
  ALTER TABLE users ADD current_streak integer DEFAULT 0;
  ALTER TABLE users ADD max_streak integer DEFAULT 0;

If you want a fresh user table:
CREATE TABLE users (
    uid SERIAL PRIMARY KEY,                                 
    email VARCHAR(255) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL,     
    first_name VARCHAR(100) NOT NULL,   
    last_name VARCHAR(100) NOT NULL,    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_streak integer DEFAULT 0,
    max_streak integer DEFAULT 0
);


Create these tables:
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
);



Added for future reference: (from signup)
Result {                    result.rows[0].id
    command: 'INSERT',
    rowCount: 1,
    oid: 0,
    rows: [
      {
        id: 4,
        email: 'test2@mail.com',
        first_name: 'test2',
        last_name: 'testlast2'
      }
    ],
    fields: [
      Field {
        name: 'id',
        tableID: 16874,
        columnID: 1,
        dataTypeID: 23,
        dataTypeSize: 4,
        dataTypeModifier: -1,
        format: 'text'
      },
      Field {
        name: 'email',
        tableID: 16874,
        columnID: 2,
        dataTypeID: 1043,
        dataTypeSize: -1,
        dataTypeModifier: 259,
        format: 'text'
      },
      Field {
        name: 'first_name',
        tableID: 16874,
        columnID: 4,
        dataTypeID: 1043,
        dataTypeSize: -1,
        dataTypeModifier: 104,
        format: 'text'
      },
      Field {
        name: 'last_name',
        tableID: 16874,
        columnID: 5,
        dataTypeID: 1043,
        dataTypeSize: -1,
        dataTypeModifier: 104,
        format: 'text'
      }
    ],
    _parsers: [
      [Function: parseInteger],
      [Function: noParse],
      [Function: noParse],
      [Function: noParse]
    ],
    _types: TypeOverrides {
      _types: {
        getTypeParser: [Function: getTypeParser],
        setTypeParser: [Function: setTypeParser],
        arrayParser: [Object],
        builtins: [Object]
      },
      text: {},
      binary: {}
    },
    RowCtor: null,
    rowAsArray: false,
    _prebuiltEmptyResultObject: { id: null, email: null, first_name: null, last_name: null }
  }
*/

// Database connection 
import {Pool} from 'pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
  });
  
  module.exports = pool;