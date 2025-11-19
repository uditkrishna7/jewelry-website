// Client-side Orders management using localStorage

(function(){
  const STORAGE_KEY = 'admin_orders';
  const COUNTER_KEY = 'admin_order_counter';

  function getOrders(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e){ return []; }
  }
  function saveOrders(orders){ localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); }

  function getNextCounter(){
    const c = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10) + 1;
    localStorage.setItem(COUNTER_KEY, String(c));
    return c;
  }

  function generateOrderId(){
    const counter = getNextCounter();
    return `BST__${String(counter).padStart(6, '0')}`;
  }

  // Render table
  function renderOrders(){
    const tbody = document.querySelector('#orders-table tbody');
    if(!tbody) return;
    const orders = getOrders();
    if(orders.length === 0){
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px">No orders yet</td></tr>';
      return;
    }

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>${o.id}</td>
        <td>${escapeHtml(o.customer || '')}</td>
        <td>${new Date(o.date).toLocaleString()}</td>
        <td>${o.items.length} items</td>
        <td>₹${(o.total||0).toFixed(2)}</td>
        <td>${o.status}</td>
        <td>
          <button class="btn-icon" data-action="view" data-id="${o.id}">👁️</button>
          <button class="btn-icon" data-action="delete" data-id="${o.id}">🗑️</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]').dataset.action;
        const id = e.target.closest('[data-action]').dataset.id;
        if(action === 'view') viewOrder(id);
        if(action === 'delete') deleteOrder(id);
      });
    });
  }

  function escapeHtml(text){ const d = document.createElement('div'); d.textContent = text; return d.innerHTML; }

  function viewOrder(id){
    const orders = getOrders();
    const order = orders.find(o => o.id === id);
    if(!order) return alert('Order not found');

    // Fill modal
    document.getElementById('detail-id').textContent = order.id;
    document.getElementById('detail-date').textContent = new Date(order.date).toLocaleString();
    document.getElementById('detail-status').textContent = order.status;
    document.getElementById('detail-customer').textContent = order.customer;
    document.getElementById('detail-email').textContent = order.email || '';
    document.getElementById('detail-phone').textContent = order.phone || '';
    document.getElementById('detail-address').textContent = order.address || '';

    const itemsTbody = document.getElementById('detail-items');
    itemsTbody.innerHTML = order.items.map(it => `
      <tr>
        <td>${escapeHtml(it.name)}</td>
        <td>${it.quantity}</td>
        <td>₹${it.price.toFixed(2)}</td>
        <td>₹${(it.price*it.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    document.getElementById('detail-subtotal').textContent = '₹' + (order.subtotal||0).toFixed(2);
    document.getElementById('detail-shipping').textContent = '₹' + (order.shipping||0).toFixed(2);
    document.getElementById('detail-total').textContent = '₹' + (order.total||0).toFixed(2);

    // Show modal
    const modal = document.getElementById('order-modal');
    if(modal){ modal.style.display = 'flex'; }
  }

  function deleteOrder(id){
    if(!confirm('Delete order ' + id + '?')) return;
    let orders = getOrders();
    orders = orders.filter(o => o.id !== id);
    saveOrders(orders);
    renderOrders();
    alert('Order deleted');
  }

  // Create order UI
  function openCreateOrderModal(){
    const modal = document.getElementById('create-order-modal');
    if(!modal) return;
    modal.style.display = 'flex';
    // reset form
    const form = document.getElementById('create-order-form');
    form.reset();
    document.getElementById('items-list').innerHTML = '';
    addItemRow();
  }

  function closeModals(){
    document.querySelectorAll('.modal').forEach(m => { m.style.display = 'none'; });
  }

  function addItemRow(item){
    const container = document.getElementById('items-list');
    const idx = container.children.length;
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '0.5rem';
    div.style.marginBottom = '0.5rem';
    div.innerHTML = `
      <input placeholder="Product name" class="item-name" style="flex:2" value="${item?escapeHtml(item.name):''}" required />
      <input type="number" placeholder="Qty" class="item-qty" style="width:80px" value="${item?item.quantity:1}" min="1" required />
      <input type="number" placeholder="Price" class="item-price" style="width:100px" value="${item?item.price:0}" step="0.01" required />
      <button type="button" class="btn btn-small btn-remove-item">Remove</button>
    `;
    container.appendChild(div);
    div.querySelector('.btn-remove-item').addEventListener('click', () => { div.remove(); });
  }

  function collectItems(){
    const container = document.getElementById('items-list');
    const rows = Array.from(container.children);
    return rows.map(r => {
      const name = r.querySelector('.item-name').value.trim();
      const quantity = parseInt(r.querySelector('.item-qty').value) || 1;
      const price = parseFloat(r.querySelector('.item-price').value) || 0;
      return { name, quantity, price };
    }).filter(i => i.name);
  }

  function calculateTotals(items){
    const subtotal = items.reduce((s, it) => s + it.price*it.quantity, 0);
    const shipping = subtotal > 0 ? 50 : 0; // flat shipping for demo
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }

  function handleCreateOrderSubmit(e){
    e.preventDefault();
    const customer = document.getElementById('order-customer').value.trim();
    const email = document.getElementById('order-email').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    const address = document.getElementById('order-address').value.trim();
    const status = document.getElementById('order-status').value || 'pending';

    if(!customer){ alert('Customer name is required'); return; }

    const items = collectItems();
    if(items.length === 0){ alert('Add at least one item'); return; }

    const totals = calculateTotals(items);
    const id = generateOrderId();
    const order = {
      id,
      customer,
      email,
      phone,
      address,
      items,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      status,
      date: new Date().toISOString()
    };

    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    closeModals();
    renderOrders();
    alert('Order ' + id + ' created');
  }

  function exportOrders(){
    const orders = getOrders();
    if(orders.length === 0){ alert('No orders to export'); return; }
    const csv = [];
    csv.push('Order ID,Customer,Email,Phone,Date,Status,Items,Subtotal,Shipping,Total');
    orders.forEach(o => {
      const itemsSummary = o.items.map(i => `${i.name} x${i.quantity}`).join('; ');
      csv.push(`"${o.id}","${o.customer}","${o.email}","${o.phone}","${o.date}","${o.status}","${itemsSummary}","${o.subtotal}","${o.shipping}","${o.total}"`);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'orders.csv'; a.click(); URL.revokeObjectURL(url);
  }

  // Attach listeners
  document.addEventListener('DOMContentLoaded', () => {
    renderOrders();

    document.getElementById('create-order')?.addEventListener('click', openCreateOrderModal);
    document.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', closeModals));

    document.getElementById('add-item')?.addEventListener('click', () => addItemRow());

    document.getElementById('create-order-form')?.addEventListener('submit', handleCreateOrderSubmit);

    document.getElementById('export-orders')?.addEventListener('click', exportOrders);

    document.getElementById('order-search')?.addEventListener('input', () => {
      // basic client-side filter
      const q = (document.getElementById('order-search').value||'').toLowerCase();
      const orders = getOrders();
      const filtered = orders.filter(o => o.id.toLowerCase().includes(q) || (o.customer||'').toLowerCase().includes(q));
      const tbody = document.querySelector('#orders-table tbody');
      if(!tbody) return;
      tbody.innerHTML = filtered.map(o => `
      <tr>
        <td>${o.id}</td>
        <td>${escapeHtml(o.customer||'')}</td>
        <td>${new Date(o.date).toLocaleString()}</td>
        <td>${o.items.length} items</td>
        <td>₹${(o.total||0).toFixed(2)}</td>
        <td>${o.status}</td>
        <td>
          <button class="btn-icon" data-action="view" data-id="${o.id}">👁️</button>
          <button class="btn-icon" data-action="delete" data-id="${o.id}">🗑️</button>
        </td>
      </tr>
      `).join('');

      tbody.querySelectorAll('[data-action]')?.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const action = e.target.closest('[data-action]').dataset.action;
          const id = e.target.closest('[data-action]').dataset.id;
          if(action === 'view') viewOrder(id);
          if(action === 'delete') deleteOrder(id);
        });
      });

    });

    document.getElementById('status-filter')?.addEventListener('change', () => {
      const status = document.getElementById('status-filter').value;
      const orders = getOrders();
      const filtered = status ? orders.filter(o => o.status === status) : orders;
      const tbody = document.querySelector('#orders-table tbody');
      tbody.innerHTML = filtered.map(o => `
      <tr>
        <td>${o.id}</td>
        <td>${escapeHtml(o.customer||'')}</td>
        <td>${new Date(o.date).toLocaleString()}</td>
        <td>${o.items.length} items</td>
        <td>₹${(o.total||0).toFixed(2)}</td>
        <td>${o.status}</td>
        <td>
          <button class="btn-icon" data-action="view" data-id="${o.id}">👁️</button>
          <button class="btn-icon" data-action="delete" data-id="${o.id}">🗑️</button>
        </td>
      </tr>
      `).join('');

      tbody.querySelectorAll('[data-action]')?.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const action = e.target.closest('[data-action]').dataset.action;
          const id = e.target.closest('[data-action]').dataset.id;
          if(action === 'view') viewOrder(id);
          if(action === 'delete') deleteOrder(id);
        });
      });
    });

    // Close order details modal when clicking outside
    document.getElementById('order-modal')?.addEventListener('click', (e) => { if(e.target.id === 'order-modal') e.target.style.display = 'none'; });

  });

})();
