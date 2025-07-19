// server.js
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to serve static files (CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Database Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    console.log('Successfully connected to the database.');
    connection.release();
});


// --- ROUTES ---

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle newsletter subscription
app.post('/subscribe', (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email.' });
    }

    const query = 'INSERT INTO subscribers (email) VALUES (?)';
    db.query(query, [email], (err, result) => {
        if (err) {
            // Check for duplicate entry
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ success: false, message: 'This email is already subscribed.' });
            }
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
        }
        res.status(201).json({ success: true, message: 'Thank you for subscribing!' });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});