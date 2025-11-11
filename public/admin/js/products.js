document.addEventListener('DOMContentLoaded', async () => {
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const addBtn = document.getElementById('add-product');
  const closeBtn = modal.querySelector('.close-modal');
  const cancelBtn = form.querySelector('[data-action="cancel"]');
  const tableBody = document.getElementById('products-table').querySelector('tbody');
  const searchInput = document.getElementById('product-search');
  const categoryFilter = document.getElementById('category-filter');

  let products = [];
  let editingId = null;

  // Fetch and display products
  async function loadProducts() {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      products = await res.json();
      renderTable();
    } catch (err) {
      console.error('Error loading products:', err);
      alert('Failed to load products: ' + err.message);
    }
  }

  function renderTable() {
    tableBody.innerHTML = '';
    const filtered = products.filter(p => {
      const matchesSearch = !searchInput.value || p.name.toLowerCase().includes(searchInput.value.toLowerCase());
      const matchesCategory = !categoryFilter.value || p.category === categoryFilter.value;
      return matchesSearch && matchesCategory;
    });

    filtered.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${p.image_url || 'assets/images/product1.jpg'}" alt="${escapeHtml(p.name)}" style="height:50px;object-fit:cover;border-radius:4px"></td>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.category || 'Uncategorized')}</td>
        <td>$${parseFloat(p.price || 0).toFixed(2)}</td>
        <td>${p.stock || 0}</td>
        <td><span class="status active">${p.status || 'active'}</span></td>
        <td>
          <button class="btn-icon" data-action="edit" data-id="${p.id}" style="cursor:pointer;background:none;border:none;font-size:1.2rem">✏️</button>
          <button class="btn-icon" data-action="delete" data-id="${p.id}" style="cursor:pointer;background:none;border:none;font-size:1.2rem">🗑️</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Attach edit/delete listeners
    tableBody.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]').dataset.action;
        const id = e.target.closest('[data-action]').dataset.id;
        if (action === 'edit') editProduct(parseInt(id));
        if (action === 'delete') deleteProduct(parseInt(id));
      });
    });
  }

  function openModal() {
    editingId = null;
    form.reset();
    modal.querySelector('.modal-header h2').textContent = 'Add New Product';
    modal.style.display = 'flex';
    form.dataset.action = 'create';
  }

  function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    editingId = id;
    form.dataset.action = 'edit';
    modal.querySelector('.modal-header h2').textContent = 'Edit Product';
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category || '';
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock || 0;
    document.getElementById('product-description').value = product.description || '';
    modal.style.display = 'flex';
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      alert('Product deleted');
      loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete: ' + err.message);
    }
  }

  async function saveProduct(data) {
    try {
      const method = form.dataset.action === 'create' ? 'POST' : 'PUT';
      const url = form.dataset.action === 'create' ? '/api/products' : `/api/products/${editingId}`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save product');
      alert('Product saved successfully');
      modal.style.display = 'none';
      form.reset();
      loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error: ' + err.message);
    }
  }

  function closeModal() {
    modal.style.display = 'none';
    form.reset();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Event listeners
  addBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('product-name').value,
      category: document.getElementById('product-category').value,
      price: parseFloat(document.getElementById('product-price').value),
      stock: parseInt(document.getElementById('product-stock').value) || 0,
      description: document.getElementById('product-description').value,
      image_url: 'assets/images/product1.jpg', // placeholder
    };
    await saveProduct(data);
  });

  searchInput.addEventListener('input', renderTable);
  categoryFilter.addEventListener('change', renderTable);

  // Initial load
  loadProducts();
});