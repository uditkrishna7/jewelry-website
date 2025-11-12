const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const customersController = require('../controllers/customersController');

// Product routes
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

// Customer routes
// Get all customers
router.get('/customers', customersController.getAllCustomers);

// Get single customer
router.get('/customers/:id', customersController.getCustomerById);

// Create new customer
router.post('/customers', customersController.createCustomer);

// Update customer
router.put('/customers/:id', customersController.updateCustomer);

// Delete customer
router.delete('/customers/:id', customersController.deleteCustomer);

// Get newsletter subscribers
router.get('/newsletter/subscribers', customersController.getNewsletterSubscribers);

// Subscribe to newsletter
router.post('/newsletter/subscribe', customersController.subscribeNewsletter);

// Send newsletter
router.post('/newsletter/send', customersController.sendNewsletter);

module.exports = router;