// Authentication handling
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    
    if (loginForm) {
        const msgEl = loginForm.querySelector('.login-message');
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!username || !password) {
                msgEl.textContent = 'Please enter both username and password';
                return;
            }
            
            try {
                // For demo: Accept default credentials
                if (username === 'admin' && password === 'admin123') {
                    localStorage.setItem('adminToken', 'demo-token');
                    localStorage.setItem('adminUser', username);
                    window.location.href = 'index.html';
                    return;
                }
                
                // This would normally go to your authentication API
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminUser', username);
                    window.location.href = 'index.html';
                } else {
                    throw new Error('Invalid credentials');
                }
            } catch (err) {
                msgEl.textContent = 'Invalid username or password';
                console.warn('Login failed:', err);
            }
        });
    }
});