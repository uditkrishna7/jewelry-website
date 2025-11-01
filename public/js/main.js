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
      const title = card?.querySelector('h3')?.textContent || 'Item';
      cartCount += 1;
      updateCartUI();
      // visual feedback
      btn.textContent = 'Added';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.disabled = false;
      }, 1000);
      // For later: send request to server to save cart
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
});