const sqlite3 = require('sqlite3').verbose();

// Create database connection
const db = new sqlite3.Database('./db/database.sqlite');

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = `
            SELECT id, name, email, phone, status, total_orders, total_spent, last_order_date, created_at
            FROM customers
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ` AND (name LIKE ? OR email LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (status) {
            query += ` AND status = ?`;
            params.push(status);
        }

        query += ` ORDER BY created_at DESC`;

        db.all(query, params, (err, customers) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to fetch customers' });
            }
            res.json(customers || []);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get single customer
exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        db.get(
            `SELECT * FROM customers WHERE id = ?`,
            [id],
            (err, customer) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Failed to fetch customer' });
                }
                if (!customer) {
                    return res.status(404).json({ error: 'Customer not found' });
                }
                res.json(customer);
            }
        );
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create new customer
exports.createCustomer = async (req, res) => {
    try {
        const { name, email, phone, status = 'active', notes = '' } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Check if email already exists
        db.get(`SELECT id FROM customers WHERE email = ?`, [email], (err, existing) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (existing) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            // Insert customer
            db.run(
                `INSERT INTO customers (name, email, phone, status, notes)
                 VALUES (?, ?, ?, ?, ?)`,
                [name, email, phone || null, status, notes],
                function(err) {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Failed to create customer' });
                    }
                    res.status(201).json({
                        id: this.lastID,
                        name,
                        email,
                        phone: phone || null,
                        status,
                        notes,
                        total_orders: 0,
                        total_spent: 0,
                        created_at: new Date().toISOString()
                    });
                }
            );
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update customer
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, status, notes } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        db.run(
            `UPDATE customers 
             SET name = ?, email = ?, phone = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [name, email, phone || null, status, notes, id],
            function(err) {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Failed to update customer' });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Customer not found' });
                }

                res.json({
                    id: parseInt(id),
                    name,
                    email,
                    phone: phone || null,
                    status,
                    notes,
                    updated_at: new Date().toISOString()
                });
            }
        );
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        db.run(`DELETE FROM customers WHERE id = ?`, [id], function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to delete customer' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            res.json({ success: true, message: 'Customer deleted' });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all newsletter subscribers
exports.getNewsletterSubscribers = async (req, res) => {
    try {
        db.all(
            `SELECT id, email, name, subscribed, created_at FROM newsletter_subscribers WHERE subscribed = 1 ORDER BY created_at DESC`,
            (err, subscribers) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Failed to fetch subscribers' });
                }
                res.json(subscribers || []);
            }
        );
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Subscribe to newsletter
exports.subscribeNewsletter = async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if already subscribed
        db.get(
            `SELECT id FROM newsletter_subscribers WHERE email = ?`,
            [email],
            (err, existing) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (existing) {
                    // Update subscription status
                    db.run(
                        `UPDATE newsletter_subscribers SET subscribed = 1 WHERE email = ?`,
                        [email],
                        (err) => {
                            if (err) {
                                console.error('Database error:', err);
                                return res.status(500).json({ error: 'Failed to subscribe' });
                            }
                            res.json({ success: true, message: 'Already subscribed or reactivated' });
                        }
                    );
                } else {
                    // Insert new subscriber
                    db.run(
                        `INSERT INTO newsletter_subscribers (email, name, subscribed) VALUES (?, ?, 1)`,
                        [email, name || 'Subscriber'],
                        function(err) {
                            if (err) {
                                console.error('Database error:', err);
                                return res.status(500).json({ error: 'Failed to subscribe' });
                            }
                            res.status(201).json({
                                id: this.lastID,
                                email,
                                name: name || 'Subscriber',
                                subscribed: 1,
                                created_at: new Date().toISOString()
                            });
                        }
                    );
                }
            }
        );
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Send newsletter
exports.sendNewsletter = async (req, res) => {
    try {
        const { subject, content, test_send = false } = req.body;

        if (!subject || !content) {
            return res.status(400).json({ error: 'Subject and content are required' });
        }

        // Get subscribers
        db.all(
            `SELECT email FROM newsletter_subscribers WHERE subscribed = 1`,
            (err, subscribers) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Failed to fetch subscribers' });
                }

                if (!subscribers || subscribers.length === 0) {
                    return res.status(400).json({ error: 'No active subscribers' });
                }

                // Log newsletter send
                const recipientCount = test_send ? 1 : subscribers.length;
                db.run(
                    `INSERT INTO newsletter_logs (subject, content, recipient_count)
                     VALUES (?, ?, ?)`,
                    [subject, content, recipientCount],
                    function(err) {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ error: 'Failed to log newsletter' });
                        }

                        // In a real app, you would use an email service here
                        // For now, we'll just log the action
                        console.log(`Newsletter sent to ${recipientCount} recipient(s)`);
                        console.log(`Subject: ${subject}`);

                        res.json({
                            success: true,
                            message: `Newsletter sent to ${recipientCount} recipient(s)`,
                            recipients: recipientCount,
                            test_send
                        });
                    }
                );
            }
        );
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

