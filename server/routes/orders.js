const router = require('express').Router();
const pool = require('../db');

// Get all orders with optional filtering
router.get('/', async (req, res) => {
    try {
        const { status, customer_id, start_date, end_date } = req.query;
        let query = `
            SELECT o.*, 
                   c.name as customer_name,
                   c.email as customer_email,
                   json_agg(json_build_object(
                       'product_id', oi.product_id,
                       'quantity', oi.quantity,
                       'price', oi.price,
                       'product_name', p.name
                   )) as items
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE 1=1
        `;
        const values = [];
        let paramCount = 1;

        if (status) {
            query += ` AND o.status = $${paramCount}`;
            values.push(status);
            paramCount++;
        }
        if (customer_id) {
            query += ` AND o.customer_id = $${paramCount}`;
            values.push(customer_id);
            paramCount++;
        }
        if (start_date) {
            query += ` AND o.created_at >= $${paramCount}`;
            values.push(start_date);
            paramCount++;
        }
        if (end_date) {
            query += ` AND o.created_at <= $${paramCount}`;
            values.push(end_date);
            paramCount++;
        }

        query += ' GROUP BY o.id, c.id ORDER BY o.created_at DESC';

        const { rows } = await pool.query(query, values);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Get single order with details
router.get('/:id', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT o.*,
                   c.name as customer_name,
                   c.email as customer_email,
                   c.phone as customer_phone,
                   json_agg(json_build_object(
                       'product_id', oi.product_id,
                       'quantity', oi.quantity,
                       'price', oi.price,
                       'product_name', p.name,
                       'product_image', p.images[0]
                   )) as items
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = $1
            GROUP BY o.id, c.id`,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { customer_id, items, shipping_address, payment_method } = req.body;
        
        // Create order
        const orderResult = await client.query(
            `INSERT INTO orders (customer_id, status, shipping_address, payment_method)
             VALUES ($1, 'pending', $2, $3)
             RETURNING id`,
            [customer_id, shipping_address, payment_method]
        );
        
        const orderId = orderResult.rows[0].id;
        
        // Add order items
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.product_id, item.quantity, item.price]
            );
            
            // Update product stock
            await client.query(
                `UPDATE products 
                 SET stock = stock - $1
                 WHERE id = $2`,
                [item.quantity, item.product_id]
            );
        }
        
        await client.query('COMMIT');
        
        res.status(201).json({
            message: 'Order created successfully',
            order_id: orderId
        });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Server error', details: err.message });
    } finally {
        client.release();
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const { rows } = await pool.query(
            `UPDATE orders 
             SET status = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 
             RETURNING *`,
            [status, req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Get order analytics
router.get('/analytics/summary', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        const { rows } = await pool.query(`
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(total_amount) as total_revenue,
                AVG(total_amount) as average_order_value
            FROM orders
            WHERE created_at BETWEEN $1 AND $2`,
            [start_date || '1900-01-01', end_date || 'now()']
        );

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

module.exports = router;