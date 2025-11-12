const router = require('express').Router();
const customersController = require('../controllers/customersController');

// Get all customers
router.get('/', customersController.getAllCustomers);

// Get single customer
router.get('/:id', customersController.getCustomerById);

// Create new customer
router.post('/', customersController.createCustomer);

// Update customer
router.put('/:id', customersController.updateCustomer);

// Delete customer
router.delete('/:id', customersController.deleteCustomer);

// Get newsletter subscribers
router.get('/subscribers/list', customersController.getNewsletterSubscribers);

// Subscribe to newsletter
router.post('/subscribe', customersController.subscribeNewsletter);

// Send newsletter
router.post('/newsletter/send', customersController.sendNewsletter);

module.exports = router;
