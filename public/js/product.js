document.addEventListener('DOMContentLoaded', async () => {
	const container = document.getElementById('product-detail');
	if (!container) return;
	const params = new URLSearchParams(window.location.search);
	const id = params.get('id');
	if (!id) {
		container.innerHTML = '<p>Product ID missing.</p>';
		return;
	}
	try {
		const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
		if (!res.ok) {
			container.innerHTML = '<p>Product not found.</p>';
			return;
		}
		const p = await res.json();
		const img = p.imageUrl || 'assets/images/product1.jpg';
		container.innerHTML = `
			<div class="product-page container">
				<div class="product-media">
					<img src="${img}" alt="${escapeHtml(p.name || '')}" loading="lazy" />
				</div>
				<div class="product-meta">
					<h1>${escapeHtml(p.name || 'Product')}</h1>
					<p class="price">$${p.price ?? ''}</p>
					<p class="desc">${escapeHtml(p.description || '')}</p>
					<div class="actions"><button class="btn add-to-cart">Add to Cart</button></div>
				</div>
			</div>
		`;
		// hook add to cart (local only)
		const addBtn = container.querySelector('.add-to-cart');
		addBtn?.addEventListener('click', () => {
			const count = Number(localStorage.getItem('cartCount') || 0) + 1;
			localStorage.setItem('cartCount', String(count));
			const cartLink = document.querySelector('.cart-link');
			if (cartLink) cartLink.textContent = `Cart (${count})`;
			addBtn.textContent = 'Added';
			addBtn.disabled = true;
			setTimeout(() => { addBtn.textContent = 'Add to Cart'; addBtn.disabled = false; }, 900);
		});
	} catch (err) {
		console.error(err);
		container.innerHTML = '<p>Error loading product.</p>';
	}

	// small helper to avoid injecting raw HTML
	function escapeHtml(s) {
		return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]);
	}
});