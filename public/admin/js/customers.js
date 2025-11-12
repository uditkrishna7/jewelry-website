// Customer Management Script for Admin Dashboard
let customers = [];
let subscribers = [];
let currentCustomer = null;

// Load customers on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Add Customer button
    const addCustomerBtn = document.getElementById('add-customer');
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', openAddCustomerModal);
    }

    // Send Newsletter button
    const sendNewsletterBtn = document.getElementById('send-newsletter');
    if (sendNewsletterBtn) {
        sendNewsletterBtn.addEventListener('click', openNewsletterModal);
    }

    // Search and filter
    const customerSearch = document.getElementById('customer-search');
    const customerFilter = document.getElementById('customer-filter');
    
    if (customerSearch) {
        customerSearch.addEventListener('input', filterCustomers);
    }
    if (customerFilter) {
        customerFilter.addEventListener('change', filterCustomers);
    }

    // Export customers
    const exportBtn = document.getElementById('export-customers');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportCustomers);
    }

    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Modal form submissions
    const customerForm = document.getElementById('customer-form');
    if (customerForm) {
        customerForm.addEventListener('submit', handleCustomerFormSubmit);
    }

    const preferencesForm = document.getElementById('preferences-form');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', handlePreferencesSubmit);
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Tab buttons in modal
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            showTab(tabName);
        });
    });
}

// Load customers from API
function loadCustomers() {
    fetch('/api/customers')
        .then(res => res.json())
        .then(data => {
            customers = data || [];
            renderCustomersTable();
            updateStats();
        })
        .catch(err => {
            console.error('Error loading customers:', err);
            alert('Failed to load customers');
        });
}

// Render customers table
function renderCustomersTable() {
    const tbody = document.querySelector('#customers-table tbody');
    if (!tbody) return;

    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No customers found</td></tr>';
        return;
    }

    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>
                <div style="font-weight: 500;">${escapeHtml(customer.name)}</div>
            </td>
            <td>${escapeHtml(customer.email)}</td>
            <td>${customer.total_orders || 0}</td>
            <td>$${(customer.total_spent || 0).toFixed(2)}</td>
            <td>${customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'N/A'}</td>
            <td>
                <span class="badge badge-${customer.status === 'active' ? 'success' : 'secondary'}">
                    ${customer.status}
                </span>
            </td>
            <td>
                <button class="btn-icon" title="View details" onclick="viewCustomerDetails(${customer.id})">👁️</button>
                <button class="btn-icon" title="Edit" onclick="editCustomer(${customer.id})">✏️</button>
                <button class="btn-icon" title="Delete" onclick="deleteCustomer(${customer.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Filter customers
function filterCustomers() {
    const searchText = (document.getElementById('customer-search')?.value || '').toLowerCase();
    const filterStatus = document.getElementById('customer-filter')?.value || '';

    const filtered = customers.filter(customer => {
        const matchesSearch = 
            customer.name.toLowerCase().includes(searchText) ||
            customer.email.toLowerCase().includes(searchText);
        
        let matchesFilter = true;
        if (filterStatus === 'active') matchesFilter = customer.status === 'active';
        if (filterStatus === 'inactive') matchesFilter = customer.status === 'inactive';

        return matchesSearch && matchesFilter;
    });

    const tbody = document.querySelector('#customers-table tbody');
    if (tbody) {
        tbody.innerHTML = filtered.length === 0 
            ? '<tr><td colspan="7" style="text-align: center; padding: 20px;">No customers match your search</td></tr>'
            : filtered.map(customer => `
                <tr>
                    <td>
                        <div style="font-weight: 500;">${escapeHtml(customer.name)}</div>
                    </td>
                    <td>${escapeHtml(customer.email)}</td>
                    <td>${customer.total_orders || 0}</td>
                    <td>$${(customer.total_spent || 0).toFixed(2)}</td>
                    <td>${customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                        <span class="badge badge-${customer.status === 'active' ? 'success' : 'secondary'}">
                            ${customer.status}
                        </span>
                    </td>
                    <td>
                        <button class="btn-icon" title="View details" onclick="viewCustomerDetails(${customer.id})">👁️</button>
                        <button class="btn-icon" title="Edit" onclick="editCustomer(${customer.id})">✏️</button>
                        <button class="btn-icon" title="Delete" onclick="deleteCustomer(${customer.id})">🗑️</button>
                    </td>
                </tr>
            `).join('');
    }
}

// View customer details
function viewCustomerDetails(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    currentCustomer = customer;
    const modal = document.getElementById('customer-modal');
    if (!modal) return;

    // Fill in the profile info
    document.getElementById('customer-name').value = customer.name;
    document.getElementById('customer-email').value = customer.email;
    document.getElementById('customer-phone').value = customer.phone || '';
    document.getElementById('customer-status').value = customer.status;
    document.getElementById('customer-notes').value = customer.notes || '';

    // Show the modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Edit customer
function editCustomer(customerId) {
    viewCustomerDetails(customerId);
}

// Delete customer
function deleteCustomer(customerId) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    fetch(`/api/customers/${customerId}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            alert('Customer deleted successfully');
            loadCustomers();
        })
        .catch(err => {
            console.error('Error deleting customer:', err);
            alert('Failed to delete customer');
        });
}

// Open add customer modal
function openAddCustomerModal() {
    currentCustomer = null;
    const modal = document.getElementById('customer-modal');
    if (!modal) return;

    // Clear form
    document.getElementById('customer-form').reset();
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Handle customer form submit
function handleCustomerFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const status = document.getElementById('customer-status').value;
    const notes = document.getElementById('customer-notes').value.trim();

    if (!name || !email) {
        alert('Name and email are required');
        return;
    }

    const customerData = { name, email, phone, status, notes };

    if (currentCustomer && currentCustomer.id) {
        // Update existing customer
        fetch(`/api/customers/${currentCustomer.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData)
        })
            .then(res => res.json())
            .then(data => {
                alert('Customer updated successfully');
                document.getElementById('customer-modal').style.display = 'none';
                document.body.style.overflow = 'auto';
                loadCustomers();
            })
            .catch(err => {
                console.error('Error updating customer:', err);
                alert('Failed to update customer');
            });
    } else {
        // Create new customer
        fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData)
        })
            .then(res => res.json())
            .then(data => {
                alert('Customer added successfully');
                document.getElementById('customer-modal').style.display = 'none';
                document.body.style.overflow = 'auto';
                loadCustomers();
            })
            .catch(err => {
                console.error('Error creating customer:', err);
                alert('Failed to add customer');
            });
    }
}

// Handle preferences submit
function handlePreferencesSubmit(e) {
    e.preventDefault();

    if (!currentCustomer) return;

    const preferences = {
        newsletter: document.getElementById('pref-newsletter').checked,
        promotions: document.getElementById('pref-promotions').checked,
        order_updates: document.getElementById('pref-orders').checked
    };

    // Update customer with preferences
    fetch(`/api/customers/${currentCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentCustomer, preferences })
    })
        .then(res => res.json())
        .then(data => {
            alert('Preferences updated successfully');
            loadCustomers();
        })
        .catch(err => {
            console.error('Error updating preferences:', err);
            alert('Failed to update preferences');
        });
}

// Open newsletter modal
function openNewsletterModal() {
    const modal = document.getElementById('newsletter-modal');
    if (!modal) return;

    // Load subscribers
    fetch('/api/newsletter/subscribers')
        .then(res => res.json())
        .then(data => {
            subscribers = data || [];
            console.log(`Loaded ${subscribers.length} newsletter subscribers`);
        })
        .catch(err => console.error('Error loading subscribers:', err));

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Handle newsletter submit
function handleNewsletterSubmit(e) {
    e.preventDefault();

    const subject = document.getElementById('newsletter-subject').value.trim();
    const content = document.getElementById('newsletter-content').value.trim();
    const testSend = document.querySelector('input[name="test_send"]').checked;

    if (!subject || !content) {
        alert('Subject and content are required');
        return;
    }

    if (subscribers.length === 0 && !testSend) {
        alert('No subscribers available. Please add subscribers first.');
        return;
    }

    fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            subject,
            content,
            test_send: testSend
        })
    })
        .then(res => res.json())
        .then(data => {
            alert(`Newsletter sent to ${data.recipients || 'test'} recipient(s)`);
            document.getElementById('newsletter-form').reset();
            document.getElementById('newsletter-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        })
        .catch(err => {
            console.error('Error sending newsletter:', err);
            alert('Failed to send newsletter');
        });
}

// Show tab content
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }

    // Mark button as active
    event.target.classList.add('active');
}

// Update stats
function updateStats() {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalSpent = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
    const avgSpent = totalCustomers > 0 ? (totalSpent / totalCustomers).toFixed(2) : 0;

    // Update stat cards
    const statCards = document.querySelectorAll('.stat-value');
    if (statCards[0]) statCards[0].textContent = totalCustomers;
    if (statCards[1]) statCards[1].textContent = activeCustomers;
    if (statCards[2]) statCards[2].textContent = `$${totalSpent.toFixed(2)}`;
    if (statCards[3]) statCards[3].textContent = `$${avgSpent}`;
}

// Export customers to CSV
function exportCustomers() {
    if (customers.length === 0) {
        alert('No customers to export');
        return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Orders', 'Total Spent', 'Created Date'];
    const rows = customers.map(c => [
        c.id,
        c.name,
        c.email,
        c.phone || '',
        c.status,
        c.total_orders || 0,
        c.total_spent || 0,
        new Date(c.created_at).toLocaleDateString()
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
