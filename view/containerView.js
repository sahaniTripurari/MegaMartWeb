import { Controller } from "../controller/controller";

export class ContainerView {
    constructor(data) {
        this.data = data;
        
        // Views
        this.homeView = document.getElementById('homeView');
        this.categoryView = document.getElementById('categoryView');
        this.productDetailView = document.getElementById('productDetailView');
        
        // Containers
        this.navCategories = document.getElementById('navCategories');
        this.categoryProductsGrid = document.getElementById('categoryProductsGrid');
        this.categoryPageTitle = document.getElementById('categoryPageTitle');
        this.cartCount = document.getElementById('cartCount');
        this.cartTotalHeader = document.getElementById('cartTotalHeader');
        
        // Search & Filter
        this.globalSearchInput = document.getElementById('globalSearchInput');
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
        this.renderHomePage();
        this.setupAutoSlider();
        this.setupRouting();
        this.setupSearchAndFilter();
        this.setupCartModal();
        this.setupEventDelegation();
        this.updateCartUI();
        this.setupScrollAnimations();
        
        this.setActiveView(this.homeView);
        if (window.lucide) lucide.createIcons();
    }

    getImageWithFallback(src) {
        // Zepto CDN images may occasionally fail; keep card rendering stable with local fallback.
        return `<img class="itemImage" src="${src}" alt="Product image" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/javascript.svg';">`;
    }

    normalizeCategoryName(name) {
        return (name || '').toString().trim().toLowerCase();
    }

    getItemsForCategory(categoryName) {
        const normalized = this.normalizeCategoryName(categoryName);
        const allItemsKeys = new Set(['all products', 'all', 'search results']);
        if (allItemsKeys.has(normalized)) return [...this.data];

        const items = this.data.filter(
            (item) => this.normalizeCategoryName(item.type) === normalized
        );

        // If category key is unexpected, keep UI usable instead of blank.
        return items.length ? items : [...this.data];
    }

    // ================= ROUTING & VIEWS =================
    setActiveView(activeView) {
        [this.homeView, this.categoryView, this.productDetailView].forEach((view) => {
            if (!view) return;
            view.classList.remove('active');
            view.style.display = 'none';
        });

        if (activeView) {
            activeView.classList.add('active');
            activeView.style.display = 'block';
        }
    }

    setupRouting() {
        document.getElementById('logoBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showHomeView();
        });
        
        document.getElementById('backFromProductBtn').addEventListener('click', () => {
            // Determine whether to go back to category or home based on previous state
            // For simplicity, just go to category if currentCategory is set, else home
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
        const relatedItems = this.controller.filterItems(item.type).filter(i => i.name !== item.name).slice(0, 5);
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
                <div style="grid-column: 1 / -1; text-align: center; padding: 100px 0;">
                    <i data-lucide="search-x" style="width: 64px; height: 64px; margin-bottom: 24px; color: var(--text-muted); opacity: 0.5;"></i>
                    <h3 style="font-size: 1.8rem; margin-bottom: 12px; font-weight: 700;">No products found</h3>
                    <p style="color: var(--text-muted); font-size: 1.1rem;">Try adjusting your search or filters to find what you're looking for.</p>
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
                // Kill any existing animations on these elements first
                gsap.killTweensOf("#categoryProductsGrid .itemName");
                
                gsap.fromTo("#categoryProductsGrid .itemName", 
                    { y: 30, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.5, 
                        stagger: 0.03, 
                        ease: "power3.out",
                        delay: 0.1 // Small delay to ensure display:block has settled
                    }
                );
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
                ${this.getImageWithFallback(element.src)}
                ${discountPercent > 0 ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                <div class="delivery-badge"><span><i data-lucide="zap"></i></span> 10 MINS</div>
            </div>
            <div class="product-content clickable-area">
                <div class="product-info">
                    <h3 class="product-title">${element.name}</h3>
                    <p class="product-unit">${element.unit}</p>
                </div>
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
                    const itemName = card.dataset.name;
                    const item = this.data.find(i => i.name === itemName);
                    if(item) this.showProductDetailView(item);
                }
                return;
            }

            // 2. Add / Plus Button (Global)
            const addBtn = e.target.closest('.add-btn') || e.target.closest('.add.qty-plus') || e.target.closest('.add-detail');
            if (addBtn) {
                // If it's in detail view
                if(addBtn.classList.contains('add-btn-detail') || addBtn.classList.contains('add-detail')) {
                    const actionsDiv = addBtn.closest('.pd-actions');
                    const item = this.data.find(i => i.name === actionsDiv.dataset.name);
                    if(item) {
                        item.quantity = (item.quantity || 0) + 1;
                        if(item.quantity===1) this.showToast(`Added ${item.name} to cart`);
                        this.updateAllCardDOMs(item);
                        this.updateProductDetailDOM(item, actionsDiv);
                        this.updateCartUI();
                    }
                    return;
                }
                
                // Normal card
                const card = addBtn.closest('.itemName');
                if(!card) return;
                const item = this.data.find(i => i.name === card.dataset.name);
                if (item) {
                    item.quantity = (item.quantity || 0) + 1;
                    if (item.quantity === 1) this.showToast(`Added ${item.name} to cart`);
                    this.updateAllCardDOMs(item);
                    this.updateCartUI();
                }
                return;
            }

            // 3. Subtract Button (Global)
            const subBtn = e.target.closest('.subtract') || e.target.closest('.subtract-detail');
            if (subBtn) {
                // If it's in detail view
                if(subBtn.classList.contains('subtract-detail')) {
                    const actionsDiv = subBtn.closest('.pd-actions');
                    const item = this.data.find(i => i.name === actionsDiv.dataset.name);
                    if(item && item.quantity > 0) {
                        item.quantity -= 1;
                        this.updateAllCardDOMs(item);
                        this.updateProductDetailDOM(item, actionsDiv);
                        this.updateCartUI();
                    }
                    return;
                }

                // Normal card
                const card = subBtn.closest('.itemName');
                if(!card) return;
                const item = this.data.find(i => i.name === card.dataset.name);
                if (item && item.quantity > 0) {
                    item.quantity -= 1;
                    this.updateAllCardDOMs(item);
                    this.updateCartUI();
                }
            }
        });
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
            
            if (item.quantity === 0 || !item.quantity) {
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
        this.globalSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    this.showCategoryView('Search Results', query);
                }
            }
        });

        this.sortSelect.addEventListener('change', (e) => {
            const currentSearch = this.globalSearchInput?.value?.trim() || '';
            const searchQuery = this.currentCategory === 'Search Results' ? currentSearch : '';
            this.renderCategoryProducts(this.currentCategory, searchQuery, e.target.value);
        });
    }
    
    // ================= CART =================
    setupCartModal() {
        const cartButton = document.getElementById('cartButton');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        const closeCart = document.getElementById('closeCart');
        
        const openSidebar = () => {
            this.renderCartSidebar();
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeSidebar = () => {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        cartButton.addEventListener('click', openSidebar);
        closeCart.addEventListener('click', closeSidebar);
        cartOverlay.addEventListener('click', closeSidebar);
        
        document.getElementById('cartItems').addEventListener('click', (e) => {
            if (e.target.classList.contains('subtract-cart')) {
                const item = this.data.find(i => i.name === e.target.dataset.name);
                if (item && item.quantity > 0) {
                    item.quantity -= 1;
                    this.updateAllCardDOMs(item);
                    
                    // If detailed view is open for this item, update it too
                    const pdActions = document.querySelector('.pd-actions');
                    if(pdActions && pdActions.dataset.name === item.name) {
                        this.updateProductDetailDOM(item, pdActions);
                    }
                    
                    this.updateCartUI();
                }
            } else if (e.target.classList.contains('add-cart')) {
                const item = this.data.find(i => i.name === e.target.dataset.name);
                if (item) {
                    item.quantity += 1;
                    this.updateAllCardDOMs(item);
                    
                    const pdActions = document.querySelector('.pd-actions');
                    if(pdActions && pdActions.dataset.name === item.name) {
                        this.updateProductDetailDOM(item, pdActions);
                    }
                    
                    this.updateCartUI();
                }
            }
        });
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
                    <div class="empty-cart-icon"><i data-lucide="shopping-cart"></i></div>
                    <h3>Your cart is empty</h3>
                    <p style="margin-top:8px; font-size:0.9rem;">Add items to start your MegaMart journey.</p>
                </div>
            `;
            cartFooter.innerHTML = '';
        } else {
            cartItemsContainer.innerHTML = cartItems.map(item => `
                <div class="cart-item">
                    <img src="${item.src}" alt="${item.name}" class="cart-item-image" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/javascript.svg';">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.discount_price}</div>
                    </div>
                    <div class="quantity-controls" style="width: 100px; height: 32px; font-size:14px;">
                        <button class="qty-btn subtract-cart" data-name="${item.name}">−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="qty-btn add-cart" data-name="${item.name}">+</button>
                    </div>
                </div>
            `).join('');
            
            const subtotal = cartItems.reduce((sum, item) => sum + (item.discount_price * item.quantity), 0);
            const deliveryFee = subtotal > 499 ? 0 : 25;
            const total = subtotal + deliveryFee;
            
            cartFooter.innerHTML = `
                <div class="bill-row">
                    <span>Item Total</span>
                    <span>₹${subtotal.toFixed(2)}</span>
                </div>
                <div class="bill-row">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee === 0 ? '<span style="color:var(--success)">FREE</span>' : `₹${deliveryFee}`}</span>
                </div>
                <div class="bill-row total">
                    <span>To Pay</span>
                    <span>₹${total.toFixed(2)}</span>
                </div>
                <button class="checkout-btn">Proceed to Checkout</button>
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
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            });
        }
    }
}