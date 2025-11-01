const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/schema.sql');

const Product = {
    createTable: function() {
        const sql = `
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                image TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `;
        db.run(sql);
    },

    addProduct: function(name, description, price, image, callback) {
        const sql = `INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)`;
        db.run(sql, [name, description, price, image], function(err) {
            callback(err, this.lastID);
        });
    },

    getAllProducts: function(callback) {
        const sql = `SELECT * FROM products`;
        db.all(sql, [], callback);
    },

    getProductById: function(id, callback) {
        const sql = `SELECT * FROM products WHERE id = ?`;
        db.get(sql, [id], callback);
    },

    updateProduct: function(id, name, description, price, image, callback) {
        const sql = `UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?`;
        db.run(sql, [name, description, price, image, id], function(err) {
            callback(err, this.changes);
        });
    },

    deleteProduct: function(id, callback) {
        const sql = `DELETE FROM products WHERE id = ?`;
        db.run(sql, [id], function(err) {
            callback(err, this.changes);
        });
    }
};

module.exports = Product;