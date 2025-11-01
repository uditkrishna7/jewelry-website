const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Route to get all products
router.get('/products', productsController.getAllProducts);

// Route to get a single product by ID
router.get('/products/:id', productsController.getProductById);

// Route to create a new product
router.post('/products', productsController.createProduct);

// Route to update an existing product
router.put('/products/:id', productsController.updateProduct);

// Route to delete a product
router.delete('/products/:id', productsController.deleteProduct);

module.exports = router;