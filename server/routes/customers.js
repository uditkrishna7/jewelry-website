const router = require('express').Router();
const pool = require('../db');

// Get all customers
router.get('/', async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = `
            SELECT c.*,
                   COUNT(DISTINCT o.id) as total_orders,
                   SUM(o.total_amount) as total_spent,
                   MAX(o.created_at) as last_order_date
            FROM customers c
            LEFT JOIN orders o ON c.id = o.customer_id
            WHERE 1=1
        `;
        const values = [];
        let paramCount = 1;

        if (search) {
            query += ` AND (c.name ILIKE $${paramCount} OR c.email ILIKE $${paramCount})`;
            values.push(`%${search}%`);
            paramCount++;
        }

        if (status) {
            query += ` AND c.status = $${paramCount}`;
            values.push(status);
            paramCount++;
        }

        query += ` GROUP BY c.id ORDER BY c.created_at DESC`;

        const { rows } = await pool.query(query, values);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Get single customer with details
router.get('/:id', async (req, res) => {
    try {
        // Get customer details
        const customerResult = await pool.query(
            `SELECT c.*, 
                    json_agg(DISTINCT jsonb_build_object(
                        'id', o.id,
                        'date', o.created_at,
                        'total', o.total_amount,
                        'status', o.status
                    )) as orders,
                    json_build_object(
                        'newsletter', cp.newsletter,
                        'promotions', cp.promotions,
                        'order_updates', cp.order_updates
                    ) as preferences
             FROM customers c
             LEFT JOIN orders o ON c.id = o.customer_id
             LEFT JOIN customer_preferences cp ON c.id = cp.customer_id
             WHERE c.id = $1
             GROUP BY c.id, cp.id`,
            [req.params.id]
        );

        if (customerResult.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(customerResult.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Create new customer
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { name, email, phone, preferences } = req.body;

        // Check if email already exists
        const existingCustomer = await client.query(
            'SELECT id FROM customers WHERE email = $1',
            [email]
        );

        if (existingCustomer.rows.length > 0) {
            throw new Error('Email already registered');
        }

        // Create customer
        const customerResult = await client.query(
            `INSERT INTO customers (name, email, phone, status)
             VALUES ($1, $2, $3, 'active')
             RETURNING id`,
            [name, email, phone]
        );

        const customerId = customerResult.rows[0].id;

        // Add preferences if provided
        if (preferences) {
            await client.query(
                `INSERT INTO customer_preferences (customer_id, newsletter, promotions, order_updates)
                 VALUES ($1, $2, $3, $4)`,
                [customerId, preferences.newsletter, preferences.promotions, preferences.order_updates]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Customer created successfully',
            customer_id: customerId
        });
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.message === 'Email already registered') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    } finally {
        client.release();
    }
});

// Update customer
router.put('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { name, email, phone, status, preferences } = req.body;

        // Update customer
        const customerResult = await client.query(
            `UPDATE customers
             SET name = COALESCE($1, name),
                 email = COALESCE($2, email),
                 phone = COALESCE($3, phone),
                 status = COALESCE($4, status),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING *`,
            [name, email, phone, status, req.params.id]
        );

        if (customerResult.rows.length === 0) {
            throw new Error('Customer not found');
        }

        // Update preferences if provided
        if (preferences) {
            await client.query(
                `INSERT INTO customer_preferences (customer_id, newsletter, promotions, order_updates)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (customer_id) DO UPDATE
                 SET newsletter = $2,
                     promotions = $3,
                     order_updates = $4`,
                [req.params.id, preferences.newsletter, preferences.promotions, preferences.order_updates]
            );
        }

        await client.query('COMMIT');

        res.json(customerResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.message === 'Customer not found') {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    } finally {
        client.release();
    }
});

// Get customer analytics
router.get('/analytics/summary', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                COUNT(*) as total_customers,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_customers,
                COUNT(DISTINCT CASE WHEN cp.newsletter THEN c.id END) as newsletter_subscribers,
                AVG(
                    CASE 
                        WHEN o.total_amount > 0 
                        THEN o.total_amount 
                    END
                ) as average_order_value
            FROM customers c
            LEFT JOIN customer_preferences cp ON c.id = cp.customer_id
            LEFT JOIN orders o ON c.id = o.customer_id`
        );

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Newsletter subscription management
router.post('/newsletter/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        const result = await pool.query(
            `INSERT INTO newsletter_subscribers (email)
             VALUES ($1)
             ON CONFLICT (email) DO NOTHING
             RETURNING *`,
            [email]
        );

        res.status(201).json({
            message: 'Subscription successful',
            subscribed: result.rows.length > 0
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

router.post('/newsletter/send', async (req, res) => {
    try {
        const { subject, content, test_email } = req.body;

        // In a real implementation, you would:
        // 1. Validate the content
        // 2. Use an email service (SendGrid, AWS SES, etc.)
        // 3. Track delivery status

        if (test_email) {
            // Send test email logic here
            res.json({ message: 'Test email sent successfully' });
        } else {
            // Get all subscribers
            const { rows } = await pool.query(
                'SELECT email FROM newsletter_subscribers WHERE active = true'
            );

            // Send to all subscribers logic here
            res.json({
                message: 'Newsletter queued for sending',
                recipient_count: rows.length
            });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

module.exports = router;