const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/schema.sql');

// Function to get all products
const getAllProducts = (callback) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

// Function to get a product by ID
const getProductById = (id, callback) => {
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
};

// Function to add a new product
const addProduct = (product, callback) => {
    const { name, description, price, imageUrl } = product;
    db.run('INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)', 
        [name, description, price, imageUrl], 
        function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, { id: this.lastID, ...product });
            }
        });
};

// Function to update a product
const updateProduct = (id, product, callback) => {
    const { name, description, price, imageUrl } = product;
    db.run('UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?', 
        [name, description, price, imageUrl, id], 
        function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, { id, ...product });
            }
        });
};

// Function to delete a product
const deleteProduct = (id, callback) => {
    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { deletedId: id });
        }
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};