const router = require('express').Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

// File upload configuration
const storage = multer.diskStorage({
    destination: './public/uploads/products',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Error: Images only!'));
    }
}).array('images', 5); // Allow up to 5 images

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = 'SELECT * FROM products WHERE 1=1';
        const values = [];

        if (category) {
            query += ' AND category = $' + (values.length + 1);
            values.push(category);
        }

        if (search) {
            query += ' AND (name ILIKE $' + (values.length + 1) + 
                    ' OR description ILIKE $' + (values.length + 1) + ')';
            values.push(`%${search}%`);
        }

        if (sort) {
            switch(sort) {
                case 'price-asc':
                    query += ' ORDER BY price ASC';
                    break;
                case 'price-desc':
                    query += ' ORDER BY price DESC';
                    break;
                case 'name-asc':
                    query += ' ORDER BY name ASC';
                    break;
                case 'name-desc':
                    query += ' ORDER BY name DESC';
                    break;
            }
        }

        const { rows } = await pool.query(query, values);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Create product
router.post('/', upload, async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const images = req.files ? req.files.map(f => f.filename) : [];

        const { rows } = await pool.query(
            'INSERT INTO products (name, description, price, category, stock, images) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description, price, category, stock, images]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Update product
router.put('/:id', upload, async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const images = req.files ? req.files.map(f => f.filename) : undefined;

        let query = 'UPDATE products SET ';
        const values = [];
        const updates = [];
        let paramCount = 1;

        if (name) {
            updates.push(`name = $${paramCount}`);
            values.push(name);
            paramCount++;
        }
        if (description) {
            updates.push(`description = $${paramCount}`);
            values.push(description);
            paramCount++;
        }
        if (price) {
            updates.push(`price = $${paramCount}`);
            values.push(price);
            paramCount++;
        }
        if (category) {
            updates.push(`category = $${paramCount}`);
            values.push(category);
            paramCount++;
        }
        if (stock) {
            updates.push(`stock = $${paramCount}`);
            values.push(stock);
            paramCount++;
        }
        if (images) {
            updates.push(`images = $${paramCount}`);
            values.push(images);
            paramCount++;
        }

        query += updates.join(', ');
        query += ` WHERE id = $${paramCount} RETURNING *`;
        values.push(req.params.id);

        const { rows } = await pool.query(query, values);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Update stock
router.patch('/:id/stock', async (req, res) => {
    try {
        const { stock } = req.body;
        const { rows } = await pool.query(
            'UPDATE products SET stock = $1 WHERE id = $2 RETURNING *',
            [stock, req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

module.exports = router;