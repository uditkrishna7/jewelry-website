const sqlite3 = require('sqlite3').verbose();
// Use a persistent sqlite file (not the SQL schema file)
const db = new sqlite3.Database('./db/database.sqlite');

// Promise-wrapped DB helpers so controllers can use async/await
function getAllProducts() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM products', [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function getProductById(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function createProduct(product) {
    const { name, description, price, imageUrl } = product;
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)',
            [name, description, price, imageUrl],
            function (err) {
                if (err) return reject(err);
                resolve({ id: this.lastID, name, description, price, imageUrl });
            }
        );
    });
}

function updateProduct(id, product) {
    const { name, description, price, imageUrl } = product;
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?',
            [name, description, price, imageUrl, id],
            function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                resolve({ id, name, description, price, imageUrl });
            }
        );
    });
}

function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
            if (err) return reject(err);
            resolve(this.changes > 0);
        });
    });
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};