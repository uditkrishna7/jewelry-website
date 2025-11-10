const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Define the main routes
router.get('/', (req, res) => {
    res.send('Welcome to the Jewelry Website!');
});
// Note: API product routes are mounted under /api in server/app.js

module.exports = router;