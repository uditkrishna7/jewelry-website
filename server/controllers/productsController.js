const db = require('../db/queries');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await db.getAllProducts();
        res.status(200).json(products || []);
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await db.getProductById(id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).json({ message: 'Error retrieving product', error: error.message });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    const { name, description, price, image_url, category, stock } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }

    try {
        const product = {
            name,
            description: description || '',
            price: parseFloat(price),
            image_url: image_url || 'assets/images/product1.jpg',
            category: category || '',
            stock: stock || 0
        };
        const createdProduct = await db.createProduct(product);
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image_url, category, stock } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }

    try {
        const updatedProduct = {
            name,
            description: description || '',
            price: parseFloat(price),
            image_url: image_url || 'assets/images/product1.jpg',
            category: category || '',
            stock: stock || 0
        };
        const result = await db.updateProduct(id, updatedProduct);
        if (result) {
            res.status(200).json({ message: 'Product updated successfully', product: result });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.deleteProduct(id);
        if (result) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};