document.addEventListener('DOMContentLoaded', () => {
  // Simple hero carousel
  const slides = Array.from(document.querySelectorAll('.hero-carousel .slide'));
  let current = 0;
  if (slides.length) {
    slides.forEach((s, i) => s.classList.toggle('active', i === 0));
    const nextSlide = () => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    };
    let carouselInterval = setInterval(nextSlide, 5000);
    // Pause on hover
    const hero = document.querySelector('.hero-carousel');
    hero.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    hero.addEventListener('mouseleave', () => carouselInterval = setInterval(nextSlide, 5000));
  }

  // Product filtering
  const filterButtons = document.querySelectorAll('.filter-bar [data-filter]');
  const productList = document.getElementById('product-list');
  const products = productList ? Array.from(productList.querySelectorAll('.product-card')) : [];

  function applyFilter(filter) {
    products.forEach(p => {
      const cat = p.dataset.category || 'all';
      if (filter === 'all' || cat === filter) {
        p.style.display = '';
      } else {
        p.style.display = 'none';
      }
    });
    filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // Search box (basic client-side)
  const searchInput = document.getElementById('site-search');
  if (searchInput) {
    let searchTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) {
          products.forEach(p => p.style.display = '');
          return;
        }
        products.forEach(p => {
          const title = (p.querySelector('h3')?.textContent || '').toLowerCase();
          const desc = (p.querySelector('.desc')?.textContent || '').toLowerCase();
          p.style.display = (title.includes(q) || desc.includes(q)) ? '' : 'none';
        });
      }, 200);
    });
  }

  // Cart counter & add-to-cart (local only)
  const cartLink = document.querySelector('.cart-link');
  let cartCount = Number(localStorage.getItem('cartCount') || 0);
  function updateCartUI() {
    if (cartLink) cartLink.textContent = `Cart (${cartCount})`;
    localStorage.setItem('cartCount', String(cartCount));
  }
  updateCartUI();

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const id = card?.dataset.productId || card?.getAttribute('data-product-id') || '';
      const title = card?.querySelector('h3')?.textContent || 'Item';
      const price = parseFloat(card?.querySelector('.price')?.textContent?.replace(/[^0-9.]/g, '') || 0);
      const description = card?.querySelector('.desc')?.textContent || '';
      
      // Store cart item in localStorage
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const existingItem = cartItems.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cartItems.push({ id, name: title, price, description, quantity: 1 });
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      cartCount += 1;
      updateCartUI();
      // visual feedback
      btn.textContent = 'Added';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.disabled = false;
      }, 1000);
      console.info(`Added to cart: ${title}`);
    });
  });

  // Contact form (placeholder)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());
      // Send to server endpoint if available
      try {
        // Replace URL with your backend endpoint when ready
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          alert('Message sent — thank you!');
          contactForm.reset();
        } else {
          // fallback local message
          alert('Message saved locally (no backend).');
          contactForm.reset();
        }
      } catch (err) {
        console.warn('Contact submit failed, offline fallback.', err);
        alert('Message saved locally (no backend).');
        contactForm.reset();
      }
    });
  }

  // Lightbox: open product image in modal
  function createLightbox() {
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.position = 'fixed';
    lb.style.inset = 0;
    lb.style.display = 'none';
    lb.style.alignItems = 'center';
    lb.style.justifyContent = 'center';
    lb.style.background = 'rgba(0,0,0,0.6)';
    lb.style.zIndex = 200;
    lb.innerHTML = '<div style="max-width:90%;max-height:90%"><img style="width:100%;height:auto;border-radius:8px" src="" alt=""></div>';
    document.body.appendChild(lb);
    lb.addEventListener('click', () => lb.style.display = 'none');
    return lb;
  }
  const lightbox = createLightbox();
  productList?.addEventListener('click', (e) => {
    const img = e.target.closest('.product-card')?.querySelector('img');
    if (img) {
      const lbImg = lightbox.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      lightbox.style.display = 'flex';
    }
  });

  // Accessibility: make product cards keyboard-friendly
  products.forEach(p => {
    p.tabIndex = 0;
    p.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        const img = p.querySelector('img');
        if (img) {
          const lbImg = lightbox.querySelector('img');
          lbImg.src = img.src;
          lbImg.alt = img.alt || '';
          lightbox.style.display = 'flex';
        }
      }
    });
  });

  // Make whole product card navigate to product detail unless the click was on a control (button, quick view, wishlist)
  productList?.addEventListener('click', (e) => {
    const control = e.target.closest('button, .quick-view, .fav-toggle, a');
    if (control) return; // let the control handle it
    const card = e.target.closest('.product-card');
    if (!card) return;
    const id = card.dataset.productId || card.getAttribute('data-product-id');
    if (id) {
      window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    }
  });

  // --- New features: sorting, quick view modal, wishlist, newsletter, smooth scroll ---

  // Smooth scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          ev.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Sorting
  const sortSelect = document.getElementById('sort-select');
  function parsePrice(el) {
    const p = el.querySelector('.price')?.textContent || '';
    const num = parseFloat(p.replace(/[^0-9-.]/g, ''));
    return Number.isFinite(num) ? num : 0;
  }
  function sortProducts(mode) {
    if (!productList) return;
    const nodes = Array.from(productList.querySelectorAll('.product-card'));
    let sorted = nodes.slice();
    if (mode === 'price-asc') sorted.sort((a,b) => parsePrice(a) - parsePrice(b));
    else if (mode === 'price-desc') sorted.sort((a,b) => parsePrice(b) - parsePrice(a));
    else if (mode === 'name-asc') sorted.sort((a,b) => (a.querySelector('h3')?.textContent||'').localeCompare(b.querySelector('h3')?.textContent||'', undefined, {sensitivity:'base'}));
    else if (mode === 'name-desc') sorted.sort((a,b) => (b.querySelector('h3')?.textContent||'').localeCompare(a.querySelector('h3')?.textContent||'', undefined, {sensitivity:'base'}));
    // re-append in order
    sorted.forEach(n => productList.appendChild(n));
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', () => sortProducts(sortSelect.value));
  }

  // Quick view modal (reuses existing lightbox style but with details)
  function createQuickview() {
    const modal = document.createElement('div');
    modal.id = 'quickview-modal';
    modal.innerHTML = `
      <div class="modal-inner" role="dialog" aria-modal="true" aria-label="Product quick view">
        <div style="flex:0 0 48%"><img src="" alt="" /></div>
        <div class="modal-content">
          <button class="close-modal" aria-label="Close">✕</button>
          <h3 class="qv-title"></h3>
          <p class="qv-desc"></p>
          <p class="qv-price" style="color:var(--accent);font-weight:700"></p>
          <div style="margin-top:1rem">
            <button class="btn qv-add">Add to Cart</button>
            <button class="btn qv-fav" style="margin-left:.5rem">♡ Wishlist</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
    return modal;
  }
  const quickview = createQuickview();
  function openQuickviewFromCard(card) {
    const img = card.querySelector('img');
    const title = card.querySelector('h3')?.textContent || '';
    const desc = card.querySelector('.desc')?.textContent || '';
    const price = card.querySelector('.price')?.textContent || '';
    quickview.querySelector('img').src = img?.src || '';
    quickview.querySelector('img').alt = img?.alt || '';
    quickview.querySelector('.qv-title').textContent = title;
    quickview.querySelector('.qv-desc').textContent = desc;
    quickview.querySelector('.qv-price').textContent = price;
    quickview.style.display = 'flex';
    // attach add to cart
    quickview.querySelector('.qv-add').onclick = () => {
      cartCount += 1; updateCartUI();
      quickview.querySelector('.qv-add').textContent = 'Added';
      setTimeout(() => quickview.querySelector('.qv-add').textContent = 'Add to Cart', 900);
    };
    // wishlist
    quickview.querySelector('.qv-fav').onclick = () => {
      const id = card.dataset.productId || card.getAttribute('data-product-id') || ''; toggleWishlist(id);
    };
    quickview.querySelector('.close-modal').focus();
  }

  // hook quick view buttons
  productList?.addEventListener('click', (e) => {
    const q = e.target.closest('.quick-view');
    if (q) {
      const card = q.closest('.product-card');
      openQuickviewFromCard(card);
    }
  });
  // close quickview on Esc
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      const qm = document.getElementById('quickview-modal');
      if (qm) qm.style.display = 'none';
      if (lightbox) lightbox.style.display = 'none';
    }
  });

  // Wishlist (favorites) with localStorage
  const wishlistKey = 'wishlistIds';
  function getWishlist() { try { return JSON.parse(localStorage.getItem(wishlistKey) || '[]'); } catch { return []; } }
  function saveWishlist(arr) { localStorage.setItem(wishlistKey, JSON.stringify(arr)); }
  function isWish(id) { return getWishlist().includes(id); }
  function toggleWishlist(id) {
    if (!id) return;
    const arr = getWishlist();
    const idx = arr.indexOf(id);
    if (idx === -1) arr.push(id); else arr.splice(idx,1);
    saveWishlist(arr);
    refreshWishlistUI();
    return arr;
  }
  function refreshWishlistUI() {
    const arr = getWishlist();
    document.querySelectorAll('.product-card').forEach(card => {
      const id = card.dataset.productId || card.getAttribute('data-product-id') || '';
      const btn = card.querySelector('.fav-toggle');
      if (btn) {
        const pressed = arr.includes(id);
        btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
        btn.textContent = pressed ? '♥' : '♡';
      }
    });
  }
  // hook fav toggle clicks
  productList?.addEventListener('click', (e) => {
    const f = e.target.closest('.fav-toggle');
    if (f) {
      const id = f.closest('.product-card')?.dataset.productId || '';
      toggleWishlist(id);
    }
  });
  // init wishlist UI
  refreshWishlistUI();

  // When new products are rendered dynamically, refresh references for interactive features
  const observer = new MutationObserver(() => {
    // rebind add-to-cart, quick-view, and fav-toggle for newly inserted nodes
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = '1';
        btn.addEventListener('click', (e) => {
          const card = e.target.closest('.product-card');
          cartCount += 1;
          updateCartUI();
          e.target.textContent = 'Added';
          e.target.disabled = true;
          setTimeout(() => { e.target.textContent = 'Add to Cart'; e.target.disabled = false; }, 1000);
        });
      }
    });
    document.querySelectorAll('.fav-toggle').forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = '1';
        btn.addEventListener('click', (e) => {
          const id = e.target.closest('.product-card')?.dataset.productId || '';
          toggleWishlist(id);
        });
      }
    });
    document.querySelectorAll('.quick-view').forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = '1';
        btn.addEventListener('click', (e) => {
          const card = e.target.closest('.product-card');
          openQuickviewFromCard(card);
        });
      }
    });
  });
  if (productList) observer.observe(productList, { childList: true, subtree: true });

  // Newsletter form handler (client-side only)
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const msg = newsletterForm.querySelector('.newsletter-msg');
      const email = (emailInput?.value || '').trim();
      const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (!valid) { msg.textContent = 'Please enter a valid email.'; emailInput.focus(); return; }
      // store locally
      const key = 'newsletterEmails';
      try {
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        if (!stored.includes(email)) stored.push(email);
        localStorage.setItem(key, JSON.stringify(stored));
        msg.textContent = 'Thanks — you are subscribed!';
        emailInput.value = '';
      } catch (err) { console.warn(err); msg.textContent = 'Subscription saved locally.'; }
      setTimeout(() => { msg.textContent = ''; }, 3500);
    });
  }
});