const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Define the main routes
router.get('/', (req, res) => {
    res.send('Welcome to the Jewelry Website!');
});

router.use('/products', productsController);

module.exports = router;