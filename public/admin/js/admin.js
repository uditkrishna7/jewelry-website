// Admin authentication
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    const loginMessage = document.querySelector('.login-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                // This should be replaced with your actual authentication endpoint
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    // Store the token
                    localStorage.setItem('adminToken', data.token);
                    // Redirect to dashboard
                    window.location.href = 'index.html';
                } else {
                    throw new Error('Invalid credentials');
                }
            } catch (error) {
                loginMessage.textContent = 'Invalid username or password';
                // Demo only: allow access with default credentials
                if (username === 'admin' && password === 'admin123') {
                    localStorage.setItem('adminToken', 'demo-token');
                    window.location.href = 'index.html';
                }
            }
        });
    }

    // Check authentication on admin pages
    const isAdminPage = document.querySelector('.admin-page');
    const isLoginPage = document.querySelector('.admin-login');
    
    if (isAdminPage && !isLoginPage) {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = 'login.html';
        }
    }

    // Logout
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
        });
    }

    // Mobile sidebar toggle
    const sidebarToggle = document.querySelector('.mobile-sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                e.target !== sidebarToggle) {
                sidebar.classList.remove('active');
            }
        });
    }

    // Quick actions
    const actionButtons = document.querySelectorAll('.quick-actions button');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.toLowerCase();
            switch(action) {
                case 'add product':
                    window.location.href = 'products.html?action=new';
                    break;
                case 'create order':
                    window.location.href = 'orders.html?action=new';
                    break;
                case 'export report':
                    exportReport();
                    break;
                case 'send newsletter':
                    window.location.href = 'customers.html?action=newsletter';
                    break;
            }
        });
    });

    function exportReport() {
        // Demo export functionality
        const today = new Date().toISOString().split('T')[0];
        const data = {
            date: today,
            sales: '$12,450',
            orders: 84,
            products: 156
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${today}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Update dashboard stats periodically
    function updateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length) {
            // In a real app, fetch fresh stats from your API
            console.log('Updating dashboard stats...');
        }
    }

    if (document.querySelector('.dashboard-grid')) {
        setInterval(updateStats, 60000); // Update every minute
    }
});