import { Controller } from "../controller/controller";

export class ContainerView {
    constructor(data) {
        this.data = data;
        
        // Views
        this.homeView = document.getElementById('homeView');
        this.categoryView = document.getElementById('categoryView');
        this.productDetailView = document.getElementById('productDetailView');
        this.profileView = document.getElementById('profileView');
        
        // Containers
        this.navCategories = document.getElementById('navCategories');
        this.quickCategories = document.getElementById('quickCategories');
        this.categoryProductsGrid = document.getElementById('categoryProductsGrid');
        this.categoryPageTitle = document.getElementById('categoryPageTitle');
        this.cartCount = document.getElementById('cartCount');
        this.mobileCount = document.querySelector('.mobile-count');
        this.cartTotalHeader = document.getElementById('cartTotalHeader');
        
        // Search & Filter
        this.globalSearchInput = document.getElementById('globalSearchInput');
        this.mobileSearchInput = document.getElementById('mobileSearchInput');
        this.sortSelect = document.getElementById('sortSelect');
        
        // State
        this.currentCategory = 'All Products';
        this.sliderInterval = null;
        
        this.controller = new Controller(this.data);
        this.elementList = this.controller.categories(this.data);
        
        this.init();
    }
    
    init() {
        this.renderNavCategories();
        this.renderQuickCategories();
        this.renderHomePage();
        this.setupAutoSlider();
        this.setupRouting();
        this.setupSearchAndFilter();
        this.setupCartModal();
        this.setupEventDelegation();
        this.setupBottomNav();
        this.updateCartUI();
        this.setupScrollAnimations();
        
        this.setActiveView(this.homeView);
        if (window.lucide) lucide.createIcons();
    }

    // ================= MOBILE UI =================
    setupBottomNav() {
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                
                // Update active state
                bottomNavItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                if (view === 'home') {
                    this.showHomeView();
                } else if (view === 'categories') {
                    this.showCategoryView('All Products');
                } else if (view === 'search') {
                    this.mobileSearchInput.focus();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'profile') {
                    this.showProfileView();
                }
            });
        });

        const mobileCartBtn = document.getElementById('mobileCartBtn');
        if (mobileCartBtn) {
            mobileCartBtn.addEventListener('click', () => {
                this.openCartSidebar();
            });
        }
    }

    renderQuickCategories() {
        if (!this.quickCategories) return;
        this.quickCategories.innerHTML = '';
        
        // Take first 8 categories for quick circles
        this.elementList.slice(0, 8).forEach(category => {
            const item = this.controller.filterItems(category)[0];
            if (!item) return;

            const catItem = document.createElement('div');
            catItem.className = 'quick-cat-item';
            catItem.innerHTML = `
                <div class="quick-cat-icon">
                    <img src="${item.src}" alt="${category}" onerror="this.src='/javascript.svg';">
                </div>
                <span>${category}</span>
            `;
            catItem.addEventListener('click', () => this.showCategoryView(category));
            this.quickCategories.appendChild(catItem);
        });
    }

    // ================= ROUTING & VIEWS =================
    setActiveView(activeView) {
        [this.homeView, this.categoryView, this.productDetailView, this.profileView].forEach((view) => {
            if (!view) return;
            view.classList.remove('active');
            view.style.display = 'none';
        });

        if (activeView) {
            activeView.classList.add('active');
            activeView.style.display = 'block';
        }
        
        // Sync bottom nav active state
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(nav => nav.classList.remove('active'));
        
        if (activeView === this.homeView) {
            document.querySelector('.bottom-nav-item[data-view="home"]')?.classList.add('active');
        } else if (activeView === this.categoryView) {
            document.querySelector('.bottom-nav-item[data-view="categories"]')?.classList.add('active');
        } else if (activeView === this.profileView) {
            document.querySelector('.bottom-nav-item[data-view="profile"]')?.classList.add('active');
        }
    }

    setupRouting() {
        document.querySelectorAll('#logoBtn, .logo').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                this.showHomeView();
            });
        });
        
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => this.showProfileView());
        }
        
        document.getElementById('backFromProductBtn').addEventListener('click', () => {
            if(this.currentCategory && this.currentCategory !== 'All Products' && this.currentCategory !== 'Home') {
                this.showCategoryView(this.currentCategory);
            } else {
                this.showHomeView();
            }
        });
    }

    showHomeView() {
        this.currentCategory = 'Home';
        this.setActiveView(this.homeView);
        
        this.updateNavHighlight('Home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showProfileView() {
        this.currentCategory = 'Profile';
        this.setActiveView(this.profileView);
        this.updateNavHighlight('Profile');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showCategoryView(categoryName, searchQuery = '') {
        this.currentCategory = categoryName;
        this.setActiveView(this.categoryView);
        
        this.categoryPageTitle.textContent = categoryName;
        this.sortSelect.value = 'relevance';
        
        this.updateNavHighlight(categoryName);
        this.renderCategoryProducts(categoryName, searchQuery, 'relevance');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showProductDetailView(item) {
        this.setActiveView(this.productDetailView);
        
        const detailContainer = document.getElementById('productDetailContent');
        const discountPercent = Math.round(((item.price - item.discount_price) / item.price) * 100);
        
        detailContainer.innerHTML = `
            <div class="pd-image-wrapper">
                <img src="${item.src}" alt="${item.name}" loading="eager" decoding="async" onerror="this.onerror=null;this.src='/javascript.svg';">
            </div>
            <div class="pd-info">
                <span class="pd-type">${item.type}</span>
                <h2 class="pd-title">${item.name}</h2>
                <div class="pd-price-row">
                    <span class="pd-price">₹${item.discount_price}</span>
                    ${item.price > item.discount_price ? `<span class="pd-mrp">₹${item.price}</span> <span class="pd-discount">${discountPercent}% OFF</span>` : ''}
                </div>
                <p class="pd-desc">Premium quality ${item.name} sourced directly from farms and certified suppliers. Guaranteed freshness and hygiene.</p>
                <div class="pd-actions" data-name="${item.name}">
                    ${!item.quantity ? 
                        `<button class="pd-add-btn add-btn-detail">Add to Cart</button>` :
                        `<div class="pd-qty-controls">
                            <button class="pd-qty-btn subtract-detail">−</button>
                            <span class="pd-qty-display">${item.quantity}</span>
                            <button class="pd-qty-btn add-detail">+</button>
                        </div>`
                    }
                </div>
            </div>
        `;

        // Render Related Products
        const relatedItems = this.controller.filterItems(item.type).filter(i => i.name !== item.name).slice(0, 6);
        const relatedGrid = document.getElementById('relatedProductsGrid');
        relatedGrid.innerHTML = '';
        relatedItems.forEach(relItem => {
            relatedGrid.appendChild(this.createProductCard(relItem));
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.lucide) lucide.createIcons();
    }

    updateNavHighlight(categoryName) {
        document.querySelectorAll('.typeName').forEach(nav => {
            if(nav.dataset.category === categoryName) nav.classList.add('active');
            else nav.classList.remove('active');
        });
    }

    // ================= AUTO SLIDER =================
    setupAutoSlider() {
        const sliderTrack = document.getElementById('sliderTrack');
        if(!sliderTrack) return;
        
        // Get top 5 discounted items as "Top Selling"
        const topItems = [...this.data]
            .sort((a,b) => ((b.price - b.discount_price) - (a.price - a.discount_price)))
            .slice(0, 5);
            
        sliderTrack.innerHTML = '';
        topItems.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'slide-item';
            slide.innerHTML = `
                <img src="${item.src}" alt="${item.name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/javascript.svg';">
                <h4>${item.name}</h4>
                <div class="price">₹${item.discount_price}</div>
            `;
            // clicking a slide goes to product detail
            slide.addEventListener('click', () => this.showProductDetailView(item));
            sliderTrack.appendChild(slide);
        });

        let currentSlide = 0;
        if(this.sliderInterval) clearInterval(this.sliderInterval);
        
        this.sliderInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % topItems.length;
            sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }, 3000);
    }

    // ================= HOME CATEGORY RENDERING =================
    renderHomePage() {
        // We have hardcoded specific sections in HTML:
        // sec-Fresh Fruits (Grid)
        // sec-Kitchen (Featured)
        // sec-Fresh Vegetables (Marquee)
        // sec-Exotic (Coverflow)
        // sec-House Hold (Snap)
        // otherCategories (Fallback Grid)
        
        const otherCategoriesContainer = document.getElementById('otherCategories');
        otherCategoriesContainer.innerHTML = '';

        this.elementList.forEach(category => {
            const items = this.controller.filterItems(category).slice(0, 8); // Max 8 items per section on home
            if (items.length === 0) return;

            const sectionEl = document.getElementById(`sec-${category}`);
            const contentEl = document.getElementById(`content-${category}`);

            if (sectionEl && contentEl) {
                // Section exists in HTML, render according to its specific style
                sectionEl.style.display = 'block';
                contentEl.innerHTML = '';
                
                if (category === 'Kitchen') {
                    // Featured style
                    const heroItem = items[0];
                    const listItems = items.slice(1, 5);
                    
                    const heroDiv = document.createElement('div');
                    heroDiv.className = 'featured-hero';
                    heroDiv.innerHTML = `<img src="${heroItem.src}" alt="${heroItem.name}"><h3>${heroItem.name}</h3><p>Starting at ₹${heroItem.discount_price}</p>`;
                    heroDiv.addEventListener('click', () => this.showProductDetailView(heroItem));
                    
                    const listDiv = document.createElement('div');
                    listDiv.className = 'featured-list';
                    listItems.forEach(item => listDiv.appendChild(this.createProductCard(item)));
                    
                    contentEl.appendChild(heroDiv);
                    contentEl.appendChild(listDiv);
                } 
                else if (category === 'Fresh Vegetables') {
                    // Marquee track needs duplicated content to loop smoothly
                    items.forEach(item => contentEl.appendChild(this.createProductCard(item)));
                    items.forEach(item => contentEl.appendChild(this.createProductCard(item)));
                }
                else {
                    // Grid, Coverflow, Snap
                    items.forEach(item => contentEl.appendChild(this.createProductCard(item)));
                }
            } else {
                // Fallback for categories without specific hardcoded sections
                const newSec = document.createElement('section');
                newSec.className = 'cat-section style-grid container gs-reveal';
                newSec.innerHTML = `
                    <div class="cat-header">
                        <h2>${category}</h2>
                        <button class="view-all-btn" data-category="${category}">View All <i data-lucide="arrow-right"></i></button>
                    </div>
                    <div class="grid-content"></div>
                `;
                const gridContent = newSec.querySelector('.grid-content');
                items.forEach(item => gridContent.appendChild(this.createProductCard(item)));
                otherCategoriesContainer.appendChild(newSec);
            }
        });

        // Bind View All buttons
        document.querySelectorAll('.view-all-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showCategoryView(e.currentTarget.dataset.category);
            });
        });
    }

    renderNavCategories() {
        const categoryIcons = {
            'Fresh Fruits': '<i data-lucide="apple"></i>',
            'Fresh Vegetables': '<i data-lucide="carrot"></i>', 
            'leafy Herbs': '<i data-lucide="leaf"></i>',
            'Flowers': '<i data-lucide="flower"></i>',
            'Exotic': '<i data-lucide="sparkles"></i>',
            'Kitchen': '<i data-lucide="coffee"></i>',
            'House Hold': '<i data-lucide="home"></i>'
        };
        
        if (this.navCategories) {
            this.navCategories.innerHTML = `
                <div class="typeName active" data-category="Home"><i data-lucide="home"></i> Home</div>
                <div class="typeName" data-category="All Products"><i data-lucide="layout-grid"></i> All</div>
            `;
            this.elementList.forEach((value) => {
                const typeName = document.createElement("div");                    
                typeName.classList.add("typeName");
                typeName.dataset.category = value;
                const icon = categoryIcons[value] || '<i data-lucide="box"></i>';
                typeName.innerHTML = `${icon} ${value}`;                                
                this.navCategories.appendChild(typeName);        
            });

            this.navCategories.querySelectorAll('.typeName').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const cat = e.currentTarget.dataset.category;
                    if(cat === 'Home') this.showHomeView();
                    else this.showCategoryView(cat);
                });
            });
        }
    }

    renderCategoryProducts(categoryName, searchQuery = '', sortBy = 'relevance') {
        this.categoryProductsGrid.innerHTML = '';
        
        let items = this.getItemsForCategory(categoryName);
            
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            items = items.filter(item => 
                item.name.toLowerCase().includes(query) ||
                item.type.toLowerCase().includes(query)
            );
        }

        // Apply Sorting
        if (sortBy === 'low-high') {
            items.sort((a,b) => a.discount_price - b.discount_price);
        } else if (sortBy === 'high-low') {
            items.sort((a,b) => b.discount_price - a.discount_price);
        } else if (sortBy === 'discount') {
            items.sort((a,b) => {
                const d1 = (a.price - a.discount_price)/a.price;
                const d2 = (b.price - b.discount_price)/b.price;
                return d2 - d1;
            });
        }
        
        if (items.length === 0) {
            this.categoryProductsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 0;">
                    <i data-lucide="search-x" style="width: 48px; height: 48px; margin-bottom: 16px; color: var(--text-muted); opacity: 0.5;"></i>
                    <h3 style="font-size: 1.25rem; margin-bottom: 8px; font-weight: 700;">No products found</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Try a different search term.</p>
                </div>
            `;
        } else {
            items.forEach(item => {
                this.categoryProductsGrid.appendChild(this.createProductCard(item));
            });
            
            // Re-create icons for the new elements
            if (window.lucide) lucide.createIcons();

            // Refined animation for smoother entrance
            if (window.gsap) {
                gsap.from("#categoryProductsGrid .itemName", { y: 20, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" });
            }
        }
    }

    createProductCard(element) {
        const itemDiv = document.createElement("div");                        
        itemDiv.classList.add("itemName");  
        itemDiv.dataset.name = element.name; 
        
        const discountPercent = Math.round(((element.price - element.discount_price) / element.price) * 100);
        
        itemDiv.innerHTML = `
            <div class="product-image-container clickable-area">
                <img class="itemImage" src="${element.src}" alt="${element.name}" loading="lazy" onerror="this.src='/javascript.svg';">
                ${discountPercent > 0 ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                <div class="delivery-badge"><i data-lucide="zap" style="width:10px;height:10px;color:var(--primary)"></i> 10 MINS</div>
            </div>
            <div class="product-content clickable-area">
                <h3 class="product-title">${element.name}</h3>
                <p class="product-unit">${element.unit}</p>
            </div>
            <div class="product-actions">
                <div class="price-section">
                    <span class="current-price">₹${element.discount_price}</span>
                    ${element.price > element.discount_price ? `<span class="original-price">₹${element.price}</span>` : ''}
                </div>
                <div class="btn-container">
                    ${element.quantity === 0 || !element.quantity ? 
                        `<button class="add-btn">Add</button>` :
                        `<div class="quantity-controls">
                            <button class="qty-btn subtract">−</button>
                            <span class="quantity-display">${element.quantity}</span>
                            <button class="qty-btn add qty-plus">+</button>
                        </div>`
                    }
                </div>
            </div>
        `;
        return itemDiv;
    }

    // ================= EVENT DELEGATION =================
    setupEventDelegation() {
        document.body.addEventListener('click', (e) => {
            
            // 1. Click on Product Image/Title -> Show Detail View
            if (e.target.closest('.clickable-area')) {
                const card = e.target.closest('.itemName');
                if(card) {
                    const item = this.data.find(i => i.name === card.dataset.name);
                    if(item) this.showProductDetailView(item);
                }
                return;
            }

            // 2. Add / Plus Button (Global)
            const addBtn = e.target.closest('.add-btn') || e.target.closest('.add.qty-plus') || e.target.closest('.add-detail');
            if (addBtn) {
                let item;
                // If it's in detail view
                if(addBtn.classList.contains('add-btn-detail') || addBtn.classList.contains('add-detail')) {
                    const actionsDiv = addBtn.closest('.pd-actions');
                    item = this.data.find(i => i.name === actionsDiv.dataset.name);
                    if(item) {
                        item.quantity = (item.quantity || 0) + 1;
                        this.updateProductDetailDOM(item, actionsDiv);
                    }
                } else {
                    // Normal card
                    const card = addBtn.closest('.itemName');
                    if(card) {
                        item = this.data.find(i => i.name === card.dataset.name);
                        if (item) item.quantity = (item.quantity || 0) + 1;
                    }
                }

                if (item) {
                    if (item.quantity === 1) this.showToast(`Added ${item.name}`);
                    this.updateAllCardDOMs(item);
                    this.updateCartUI();
                }
                return;
            }

            // 3. Subtract Button (Global)
            const subBtn = e.target.closest('.subtract') || e.target.closest('.subtract-detail');
            if (subBtn) {
                let item;
                // If it's in detail view
                if(subBtn.classList.contains('subtract-detail')) {
                    const actionsDiv = subBtn.closest('.pd-actions');
                    item = this.data.find(i => i.name === actionsDiv.dataset.name);
                    if(item && item.quantity > 0) {
                        item.quantity -= 1;
                        this.updateProductDetailDOM(item, actionsDiv);
                    }
                } else {
                    // Normal card
                    const card = subBtn.closest('.itemName');
                    if(card) {
                        item = this.data.find(i => i.name === card.dataset.name);
                        if (item && item.quantity > 0) item.quantity -= 1;
                    }
                }

                if (item) {
                    this.updateAllCardDOMs(item);
                    this.updateCartUI();
                }
            }
        });

        const mobileSearchToggle = document.getElementById('mobileSearchToggle');
        if (mobileSearchToggle) {
            mobileSearchToggle.addEventListener('click', () => {
                this.mobileSearchInput.focus();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    updateProductDetailDOM(item, actionsDiv) {
        if (!item.quantity) {
            actionsDiv.innerHTML = `<button class="pd-add-btn add-btn-detail">Add to Cart</button>`;
        } else {
            actionsDiv.innerHTML = `
                <div class="pd-qty-controls">
                    <button class="pd-qty-btn subtract-detail">−</button>
                    <span class="pd-qty-display">${item.quantity}</span>
                    <button class="pd-qty-btn add-detail">+</button>
                </div>
            `;
        }
    }

    updateAllCardDOMs(item) {
        document.querySelectorAll(`.itemName[data-name="${item.name}"]`).forEach(cardElement => {
            const btnContainer = cardElement.querySelector('.btn-container');
            if (!btnContainer) return;
            
            if (!item.quantity) {
                btnContainer.innerHTML = `<button class="add-btn">Add</button>`;
            } else {
                btnContainer.innerHTML = `
                    <div class="quantity-controls">
                        <button class="qty-btn subtract">−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="qty-btn add qty-plus">+</button>
                    </div>
                `;
            }
        });
    }

    // ================= SEARCH & FILTER =================
    setupSearchAndFilter() {
        const handleSearch = (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) this.showCategoryView('Search Results', query);
            }
        };

        this.globalSearchInput.addEventListener('keydown', handleSearch);
        if (this.mobileSearchInput) this.mobileSearchInput.addEventListener('keydown', handleSearch);

        this.sortSelect.addEventListener('change', (e) => {
            const currentSearch = this.globalSearchInput?.value || this.mobileSearchInput?.value || '';
            const searchQuery = this.currentCategory === 'Search Results' ? currentSearch : '';
            this.renderCategoryProducts(this.currentCategory, searchQuery, e.target.value);
        });
    }
    
    // ================= CART =================
    setupCartModal() {
        const cartButton = document.getElementById('cartButton');
        const cartOverlay = document.getElementById('cartOverlay');
        const closeCart = document.getElementById('closeCart');
        
        cartButton.addEventListener('click', () => this.openCartSidebar());
        closeCart.addEventListener('click', () => this.closeCartSidebar());
        cartOverlay.addEventListener('click', () => this.closeCartSidebar());
        
        document.getElementById('cartItems').addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            const item = this.data.find(i => i.name === name);
            if (!item) return;

            if (e.target.classList.contains('subtract-cart')) {
                item.quantity -= 1;
            } else if (e.target.classList.contains('add-cart')) {
                item.quantity += 1;
            }

            this.updateAllCardDOMs(item);
            const pdActions = document.querySelector('.pd-actions');
            if(pdActions && pdActions.dataset.name === item.name) {
                this.updateProductDetailDOM(item, pdActions);
            }
            this.updateCartUI();
        });
    }

    openCartSidebar() {
        this.renderCartSidebar();
        document.getElementById('cartSidebar').classList.add('active');
        document.getElementById('cartOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCartSidebar() {
        document.getElementById('cartSidebar').classList.remove('active');
        document.getElementById('cartOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    updateCartUI() {
        let totalItems = 0;
        let totalPrice = 0;
        
        this.data.forEach(item => {
            if(item.quantity > 0) {
                totalItems += item.quantity;
                totalPrice += (item.discount_price * item.quantity);
            }
        });
        
        this.cartCount.textContent = totalItems;
        if (this.mobileCount) this.mobileCount.textContent = totalItems;
        if(this.cartTotalHeader) this.cartTotalHeader.textContent = `₹${totalPrice.toFixed(2)}`;
        
        if (document.getElementById('cartSidebar').classList.contains('active')) {
            this.renderCartSidebar();
        }
    }
    
    renderCartSidebar() {
        const cartItems = this.data.filter(item => item.quantity > 0);
        const cartItemsContainer = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i data-lucide="shopping-cart" style="width:48px;height:48px;margin-bottom:16px;opacity:0.3"></i>
                    <h3>Your cart is empty</h3>
                    <p style="font-size:0.85rem;color:var(--text-muted)">Add something to make me happy!</p>
                </div>
            `;
            cartFooter.innerHTML = '';
        } else {
            cartItemsContainer.innerHTML = cartItems.map(item => `
                <div class="cart-item">
                    <img src="${item.src}" alt="${item.name}" class="cart-item-image" onerror="this.src='/javascript.svg';">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.discount_price}</div>
                    </div>
                    <div class="quantity-controls" style="width: 80px; height: 28px;">
                        <button class="qty-btn subtract-cart" data-name="${item.name}">−</button>
                        <span class="quantity-display" style="font-size:0.75rem">${item.quantity}</span>
                        <button class="qty-btn add-cart" data-name="${item.name}">+</button>
                    </div>
                </div>
            `).join('');
            
            const subtotal = cartItems.reduce((sum, item) => sum + (item.discount_price * item.quantity), 0);
            const deliveryFee = subtotal > 499 ? 0 : 25;
            const total = subtotal + deliveryFee;
            
            cartFooter.innerHTML = `
                <div class="bill-row"><span>Items</span><span>₹${subtotal.toFixed(2)}</span></div>
                <div class="bill-row"><span>Delivery</span><span>${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                <div class="bill-row total"><span>Total</span><span>₹${total.toFixed(2)}</span></div>
                <button class="checkout-btn">Checkout</button>
            `;
        }
        if (window.lucide) lucide.createIcons();
    }

    showToast(message) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i data-lucide="check-circle-2"></i> <span>${message}</span>`;
        container.appendChild(toast);
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            if (window.gsap) {
                gsap.to(toast, { opacity: 0, y: 20, duration: 0.3, onComplete: () => toast.remove() });
            } else {
                toast.remove();
            }
        }, 3000);
    }

    setupScrollAnimations() {
        if(window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            gsap.utils.toArray('.gs-reveal').forEach(function(elem) {
                gsap.from(elem, {
                    scrollTrigger: { trigger: elem, start: "top 90%" },
                    y: 30, opacity: 0, duration: 0.6, ease: "power2.out"
                });
            });
        }
    }

    normalizeCategoryName(name) { return (name || '').toString().trim().toLowerCase(); }

    getItemsForCategory(categoryName) {
        const normalized = this.normalizeCategoryName(categoryName);
        if (['all products', 'all', 'search results'].includes(normalized)) return [...this.data];
        const items = this.data.filter(item => this.normalizeCategoryName(item.type) === normalized);
        return items.length ? items : [...this.data];
    }
}