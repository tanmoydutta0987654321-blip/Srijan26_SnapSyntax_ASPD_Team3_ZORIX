document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let state = {
        lang: localStorage.getItem('zorix-lang') || 'en',
        theme: localStorage.getItem('zorix-theme') || 'light',
        cart: JSON.parse(localStorage.getItem('zorix-cart')) || [],
        order: JSON.parse(localStorage.getItem('zorix-order')) || null,
        currentSlide: 0
    };

    // --- DATA ---
    const products = [
        { id: 1, name: 'Whey Isolate Pro 2kg', category: 'Protein', price: 59.99, image: './assets/protein.jpg' },
        { id: 2, name: 'Micronized Creatine 500g', category: 'Creatine', price: 29.99, image: './assets/creatine.jpg' },
        { id: 3, name: 'Mass Gainer Extreme 5kg', category: 'Protein', price: 74.99, image: './assets/gainer.jpg' },
        { id: 4, name: 'Pre-Workout Ignite', category: 'Supplements', price: 34.99, image: './assets/preworkout.jpg' },
        { id: 5, name: 'Adjustable Dumbbell Set', category: 'Workout Kits', price: 149.99, image: './assets/dumbbells.jpg' },
        { id: 6, name: 'Premium Resistance Bands', category: 'Workout Kits', price: 19.99, image: './assets/bands.jpg' }
    ];

    const heroSlides = [
        { title: 'Build Strength Faster', subtitle: 'Premium gear and supplements designed for your peak performance.', img: './assets/hero1.jpg' },
        { title: 'Elite Supplements', subtitle: 'Scientifically formulated for maximum muscle recovery and growth.', img: './assets/hero2.jpg' },
        { title: 'Train Smarter', subtitle: 'Elevate your experience with our professional accessories and gear.', img: './assets/hero3.jpg' }
    ];

    const translations = {
        en: {
            'link-home': 'Home', 'link-products': 'Products', 'link-tracking': 'Tracking', 'link-contact': 'Contact',
            'txt-explore-cat': 'Explore Categories', 'txt-our-products': 'Our Products',
            'txt-your-cart': 'Your Cart', 'txt-total': 'Total:', 'txt-track-order': 'Track Your Order',
            'txt-get-in-touch': 'Get in Touch', 'txt-contact-desc': 'Questions about our products or need advice? We are here to help.',
            'btn-send-msg': 'Send Message', 'txt-quick-links': 'Quick Links'
        },
        hi: {
            'link-home': 'होम', 'link-products': 'उत्पादों', 'link-tracking': 'ट्रैकिंग', 'link-contact': 'संपर्क',
            'txt-explore-cat': 'श्रेणियां देखें', 'txt-our-products': 'हमारे उत्पाद',
            'txt-your-cart': 'आपकी गाड़ी', 'txt-total': 'कुल:', 'txt-track-order': 'ऑर्डर ट्रैक करें',
            'txt-get-in-touch': 'संपर्क करें', 'txt-contact-desc': 'हमारे सप्लीमेंट के बारे में कोई प्रश्न है?',
            'btn-send-msg': 'संदेश भेजें', 'txt-quick-links': 'त्वरित लिंक'
        },
        bn: {
            'link-home': 'হোম', 'link-products': 'পণ্য', 'link-tracking': 'ট্র্যাকিং', 'link-contact': 'যোগাযোগ',
            'txt-explore-cat': 'বিভাগ এক্সপ্লোর করুন', 'txt-our-products': 'আমাদের পণ্য',
            'txt-your-cart': 'আপনার কার্ট', 'txt-total': 'মোট:', 'txt-track-order': 'অর্ডার ট্র্যাক করুন',
            'txt-get-in-touch': 'যোগাযোগ করুন', 'txt-contact-desc': 'সাপ্লিমেন্ট সম্পর্কে কিছু জানতে চান?',
            'btn-send-msg': 'মেসেজ পাঠান', 'txt-quick-links': 'দ্রুত লিঙ্ক'
        }
    };

    // --- ELEMENTS ---
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const slideshow = document.getElementById('hero-slideshow');
    const dotsContainer = document.getElementById('slideshow-dots');
    const productList = document.getElementById('product-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cartCount = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const themeToggle = document.getElementById('theme-toggle');
    const langSelect = document.getElementById('lang-select');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksList = document.getElementById('nav-links');
    const toast = document.getElementById('toast');
    const trackingContent = document.getElementById('tracking-content');
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    // --- INIT ---
    init();

    function init() {
        applyTheme(state.theme);
        applyLanguage(state.lang);
        renderSlides();
        renderProducts('all');
        updateCartUI();
        setupEventListeners();
        startSlideshow();
        handleSPA();
        renderTracking();
        setupRevealOnScroll();
    }

    function applyTheme(theme) {
        body.className = theme + '-mode';
        themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('zorix-theme', theme);
    }

    themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme(state.theme);
    });

    function applyLanguage(lang) {
        state.lang = lang;
        localStorage.setItem('zorix-lang', lang);
        langSelect.value = lang;
        Object.keys(translations[lang]).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = translations[lang][id];
        });
    }

    langSelect.addEventListener('change', (e) => applyLanguage(e.target.value));

    // --- SLIDESHOW ---
    function renderSlides() {
        heroSlides.forEach((slide, i) => {
            const slideEl = document.createElement('div');
            slideEl.className = `slide ${i === 0 ? 'active' : ''}`;
            slideEl.innerHTML = `
                <img src="${slide.img}" alt="${slide.title}">
                <div class="slide-content">
                    <h1>${slide.title}</h1>
                    <p>${slide.subtitle}</p>
                    <button class="btn-primary" onclick="window.location.hash='#products'">Shop Now</button>
                </div>
            `;
            slideshow.appendChild(slideEl);
            const dot = document.createElement('div');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => goToSlide(i);
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        slides[state.currentSlide].classList.remove('active');
        dots[state.currentSlide].classList.remove('active');
        state.currentSlide = (index + slides.length) % slides.length;
        slides[state.currentSlide].classList.add('active');
        dots[state.currentSlide].classList.add('active');
    }

    function startSlideshow() { setInterval(() => goToSlide(state.currentSlide + 1), 4000); }
    document.querySelector('.next-slide').onclick = () => goToSlide(state.currentSlide + 1);
    document.querySelector('.prev-slide').onclick = () => goToSlide(state.currentSlide - 1);

    // --- PRODUCTS ---
    function renderProducts(filter) {
        productList.innerHTML = '';
        const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card reveal';
            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}" class="product-img">
                <div class="product-card-body">
                    <span class="product-category">${p.category}</span>
                    <h3 class="product-name">${p.name}</h3>
                    <span class="product-price">$${p.price.toFixed(2)}</span>
                    <button class="btn-primary" onclick="addToCart(${p.id})">Add to Cart</button>
                </div>
            `;
            productList.appendChild(card);
        });
        setupRevealOnScroll();
    }

    filterBtns.forEach(btn => btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });

    // --- CART ---
    window.addToCart = (id) => {
        const product = products.find(p => p.id === id);
        const item = state.cart.find(i => i.id === id);
        if (item) item.qty++; else state.cart.push({ ...product, qty: 1 });
        updateCartUI();
        showToast(`${product.name} added to cart!`);
    };

    function updateCartUI() {
        localStorage.setItem('zorix-cart', JSON.stringify(state.cart));
        const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = totalItems;

        if (cartItemsList) {
            cartItemsList.innerHTML = '';
            let total = 0;
            if (state.cart.length === 0) {
                cartItemsList.innerHTML = '<p style="text-align:center; padding: 2rem; opacity:0.6;">Your cart is empty.</p>';
            } else {
                state.cart.forEach(item => {
                    total += item.price * item.qty;
                    const el = document.createElement('div');
                    el.className = 'cart-item';
                    el.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div style="flex-grow:1;">
                            <h4>${item.name}</h4>
                            <p style="font-weight:700;">$${item.price.toFixed(2)}</p>
                            <div style="display:flex; align-items:center; gap:1rem; margin-top:0.5rem;">
                                <button onclick="changeQty(${item.id}, -1)" class="btn-qty" style="padding:4px 8px; cursor:pointer;">-</button>
                                <span>${item.qty}</span>
                                <button onclick="changeQty(${item.id}, 1)" class="btn-qty" style="padding:4px 8px; cursor:pointer;">+</button>
                                <button onclick="removeFromCart(${item.id})" style="color:red; background:none; border:none; margin-left:1rem; cursor:pointer;"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    `;
                    cartItemsList.appendChild(el);
                });
            }
            cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        }
    }

    window.changeQty = (id, delta) => {
        const item = state.cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) state.cart = state.cart.filter(i => i.id !== id);
        }
        updateCartUI();
    };

    window.removeFromCart = (id) => {
        state.cart = state.cart.filter(i => i.id !== id);
        updateCartUI();
    };

    // --- CHECKOUT & TRACKING ---
    document.getElementById('proceed-checkout')?.addEventListener('click', () => {
        if (state.cart.length === 0) return showToast('Your cart is empty!');
        
        state.order = {
            id: 'ZRX-' + Math.floor(Math.random() * 100000),
            status: 0,
            date: new Date().toLocaleDateString()
        };
        localStorage.setItem('zorix-order', JSON.stringify(state.order));
        state.cart = [];
        updateCartUI();
        showToast('Order successful! Redirecting...');
        setTimeout(() => { window.location.hash = '#tracking'; handleSPA(); }, 1500);
    });

    function renderTracking() {
        if (!trackingContent) return;
        if (!state.order) {
            trackingContent.innerHTML = '<div style="text-align:center;"><p>No active orders.</p><button class="btn-primary" style="width:auto; margin-top:2rem;" onclick="window.location.hash=\'#products\'">Go Shopping</button></div>';
            return;
        }

        const steps = ['Placed', 'Packed', 'Out for Delivery', 'Delivered'];
        const pWidth = (state.order.status / (steps.length - 1)) * 90;
        
        trackingContent.innerHTML = `
            <div style="text-align:center; margin-bottom: 3rem;">
                <h3>Order ID: ${state.order.id}</h3>
            </div>
            <div class="step-ui">
                <div class="step-progress" style="width: ${pWidth}%"></div>
                ${steps.map((s, i) => `
                    <div class="step ${i <= state.order.status ? (i === state.order.status ? 'active' : 'completed') : ''}">
                        <div class="step-circle">${i < state.order.status ? '✓' : i + 1}</div>
                        <div class="step-text">${s}</div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align:center;">
                <button class="btn-primary" style="width:auto; padding: 1rem 3rem;" onclick="simulateProg()">
                    ${state.order.status < 3 ? 'Simulate Progress' : 'Order Delivered'}
                </button>
            </div>
        `;
    }

    window.simulateProg = () => {
        if (state.order && state.order.status < 3) {
            state.order.status++;
            localStorage.setItem('zorix-order', JSON.stringify(state.order));
            renderTracking();
        }
    };

    // --- SPA ROUTING ---
    function handleSPA() {
        const hash = window.location.hash || '#home';
        sections.forEach(s => s.classList.contains(hash.substring(1)) ? s.classList.add('active') : s.classList.remove('active'));
        // Fallback for simple ID check
        sections.forEach(s => s.id === hash.substring(1) ? s.classList.add('active') : s.classList.remove('active'));
        navLinks.forEach(l => l.getAttribute('href') === hash ? l.classList.add('active') : l.classList.remove('active'));
        navLinksList.classList.remove('mobile-active');
        if (hash === '#tracking') renderTracking();
        window.scrollTo(0,0);
    }
    window.onhashchange = handleSPA;

    // --- UTILS ---
    function showToast(m) {
        toast.textContent = m;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function setupRevealOnScroll() {
        const obs = new IntersectionObserver(ents => {
            ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }

    function setupEventListeners() {
        menuToggle.onclick = () => navLinksList.classList.toggle('mobile-active');
        document.getElementById('cart-nav-btn').onclick = () => window.location.hash = '#cart';
        window.onscroll = () => window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
        
        contactForm? (contactForm.onsubmit = (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const txt = btn.textContent; btn.textContent = 'Sending...';
            setTimeout(() => {
                formFeedback.textContent = 'Message sent! We will contact you soon.';
                formFeedback.style.color = 'var(--secondary)';
                contactForm.reset(); btn.textContent = txt;
                setTimeout(() => formFeedback.textContent = '', 4000);
            }, 1000);
        }) : null;

        document.querySelectorAll('.category-card').forEach(c => c.onclick = () => {
            const cat = c.dataset.category;
            window.location.hash = '#products';
            setTimeout(() => {
                const btn = Array.from(filterBtns).find(b => b.dataset.filter === cat);
                if (btn) btn.click();
            }, 100);
        });
    }
});
