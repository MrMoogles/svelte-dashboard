const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

// Function that handles database Connection and Reconnection if error is encountered
let db;
function connectToDatabase(){
    // MySQL configuration
    const dbConfig = {
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'db',
        port: 3306
    };

    // Create the connection
    db = mysql.createConnection(dbConfig);

    // Initial Connection
    db.connect(err => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            setTimeout(connectToDatabase, 2000); // Reconnect after 2 seconds
        } else {
            console.log('Connected to MySQL database');
        }
    });

    // Handles DB Connection Error
    db.on('error', err => {
        console.error('MySQL error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            connectToDatabase(); // Reconnect if the connection is lost
        } else {
            throw err;
        }
    });
}

// Initialize MySQL connection
connectToDatabase()

// API endpoint to fetch all projects
app.get('/api/projects', (req, res) => {
    const query = 'SELECT * FROM projects';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results);
        }
    });
});

// API endpoint to fetch data for enviroment posted
app.get('/api/environments/:project_id', (req, res) => {
    const environment = req.params.project_id;
    const query = `SELECT * FROM environments WHERE project_id = ?`;

    db.query(query, [environment], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results);
        }
    });
});


// API endpoint to fetch all environments
app.get('/api/environments', (req, res) => {
    const query = 'SELECT * FROM environments';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results);
        }
    });
});

// API endpoint to fetch data for enviroment posted
app.get('/api/environments/:environment', (req, res) => {
    const environment = req.params.environment;
    const query = `SELECT * FROM environments WHERE id = ?`;

    db.query(query, [environment], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results);
        }
    });
});


// Combined API endpoint to fetch test runs, optionally based on environment and project
app.get('/api/test-runs', (req, res) => {
    let query = 'SELECT * FROM test_runs';
    const params = [];

    const environmentId = req.query.environment;
    const projectId = req.query.project;

    // Check if both environment and project parameters are provided
    if (environmentId && projectId) {
        query += ' WHERE project_id = ? AND environment_id = ?';
        params.push(projectId, environmentId);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results);
        }
    });
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
