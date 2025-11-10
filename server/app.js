const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Database connection (uses a persistent sqlite file)
const dbFile = './db/database.sqlite';
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database:', dbFile);
    }
});

// If the sqlite DB file doesn't exist, run the init script to create and seed it.
const fs = require('fs');
if (!fs.existsSync(dbFile)) {
    console.log('Database file missing, running initialization...');
    // init-db.js creates server/db/database.sqlite
    try {
        require('./init-db');
    } catch (err) {
        console.error('Failed to initialize DB on startup:', err);
    }
}

// Routes
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

app.use('/', indexRouter);
app.use('/api', apiRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});