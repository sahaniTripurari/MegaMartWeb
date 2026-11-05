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
        this.categoryProductCount = document.getElementById('categoryProductCount');
        this.cartCount = document.getElementById('cartCount');
        this.mobileCount = document.querySelector('.mobile-count');
        this.cartTotalHeader = document.getElementById('cartTotalHeader');
        
        // Wishlist Elements
        this.wishlistCount = document.getElementById('wishlistCount');
        this.wishlistCountLabel = document.getElementById('wishlistCountLabel');
        this.mobileWishlistCount = document.getElementById('mobileWishlistCount');
        this.bottomWishlistCount = document.getElementById('bottomWishlistCount');
        this.wishlistDrawerCount = document.getElementById('wishlistDrawerCount');
        this.wishlistSidebar = document.getElementById('wishlistSidebar');
        this.wishlistOverlay = document.getElementById('wishlistOverlay');
        this.wishlistItemsContainer = document.getElementById('wishlistItems');
        this.wishlistFooter = document.getElementById('wishlistFooter');
        
        // Search & Filter
        this.globalSearchInput = document.getElementById('globalSearchInput');
        this.mobileSearchInput = document.getElementById('mobileSearchInput');
        this.sortSelect = document.getElementById('sortSelect');
        
        // State
        this.currentCategory = 'All Products';
        this.activeFilterTag = 'all';
        this.sliderInterval = null;
        this.wishlist = this.loadWishlistFromStorage();
        
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
        this.setupFilterTags();
        this.setupCartModal();
        this.setupWishlistModal();
        this.setupEventDelegation();
        this.setupBottomNav();
        this.updateCartUI();
        this.updateWishlistUI();
        this.setupScrollAnimations();
        this.loadCartFromStorage();
        this.setupCheckoutModal();
        
        this.setActiveView(this.homeView);
        if (window.lucide) lucide.createIcons();
    }

    // ================= MOBILE UI =================
    setupBottomNav() {
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                
                // If it's cart or wishlist, don't change active view tab
                if (item.id === 'mobileCartBtn' || item.id === 'bottomWishlistBtn') {
                    return;
                }
                
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

        const bottomWishlistBtn = document.getElementById('bottomWishlistBtn');
        if (bottomWishlistBtn) {
            bottomWishlistBtn.addEventListener('click', () => {
                this.openWishlistSidebar();
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
        
        const backBtn = document.getElementById('backFromProductBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (this.currentCategory && this.currentCategory !== 'All Products' && this.currentCategory !== 'Home') {
                    this.showCategoryView(this.currentCategory);
                } else {
                    this.showHomeView();
                }
            });
        }
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
        
        if (this.categoryPageTitle) this.categoryPageTitle.textContent = categoryName;
        if (this.sortSelect) this.sortSelect.value = 'featured';
        
        this.updateNavHighlight(categoryName);
        this.renderCategoryProducts(categoryName, searchQuery, 'featured');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ================= RATINGS & REVIEWS HELPER =================
    getProductRating(item) {
        // Deterministic hash based on product name
        let hash = 0;
        for (let i = 0; i < item.name.length; i++) {
            hash = (hash << 5) - hash + item.name.charCodeAt(i);
            hash |= 0;
        }
        const abs = Math.abs(hash);
        const score = (4.6 + (abs % 4) * 0.1).toFixed(1); // 4.6, 4.7, 4.8, 4.9
        const reviewCount = 85 + (abs % 220); // 85 - 305
        
        const p5 = 74 + (abs % 12); // 74 - 85%
        const p4 = 12 + ((abs >> 2) % 6); // 12 - 17%
        const p3 = 3 + ((abs >> 3) % 4); // 3 - 6%
        const p2 = 1 + ((abs >> 4) % 2); // 1 - 2%
        const p1 = Math.max(1, 100 - (p5 + p4 + p3 + p2));

        const sampleReviews = [
            {
                name: "Ananya Sharma",
                avatar: "AS",
                date: "Yesterday",
                rating: 5,
                comment: `Exceptional freshness and aroma. Delivered in 8 minutes flat, perfectly protected and cold-stored.`
            },
            {
                name: "Vikram Malhotra",
                avatar: "VM",
                date: "3 days ago",
                rating: 5,
                comment: `Top-tier quality directly from certified farms. Best grocery service in Mumbai by far!`
            },
            {
                name: "Pooja Mehta",
                avatar: "PM",
                date: "1 week ago",
                rating: 4,
                comment: `Great value for money and very clean, sealed packaging. Highly recommended.`
            }
        ];

        return {
            score,
            reviewCount,
            breakdown: { p5, p4, p3, p2, p1 },
            reviews: sampleReviews
        };
    }

    // ================= ENHANCED PRODUCT DETAIL VIEW =================
    showProductDetailView(item) {
        this.setActiveView(this.productDetailView);
        
        const detailContainer = document.getElementById('productDetailContent');
        const discountPercent = Math.round(((item.price - item.discount_price) / item.price) * 100);
        const rating = this.getProductRating(item);
        const isWishlisted = this.wishlist.has(item.name);

        // Determine realistic specifications based on category
        const isPerishable = ['fresh fruits', 'fresh vegetables', 'leafy herbs'].includes(item.type.toLowerCase());
        const shelfLife = isPerishable ? "3 - 5 Days from harvest" : "6 - 12 Months (Sealed)";
        const storageInstruction = isPerishable ? "Refrigerate below 4°C or store in ventilated mesh" : "Store in a cool, dry place away from sunlight";
        const countryOrigin = (item.countryoforigin || 'India').toUpperCase();

        detailContainer.innerHTML = `
            <div class="pd-gallery">
                <div class="pd-main-image-wrap" id="pdMainImageWrap">
                    <button class="pd-wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" data-name="${item.name}" id="pdWishlistBtn" aria-label="Toggle Wishlist" title="Wishlist">
                        <i data-lucide="heart"></i>
                    </button>
                    <img id="pdMainImage" src="${item.src}" alt="${item.name}" loading="eager" decoding="async" onerror="this.onerror=null;this.src='/javascript.svg';">
                </div>
                <!-- Gallery Thumbnails -->
                <div class="pd-thumbnails">
                    <div class="pd-thumb active" data-src="${item.src}">
                        <img src="${item.src}" alt="${item.name} Front">
                    </div>
                    <div class="pd-thumb" data-src="${item.src}">
                        <img src="${item.src}" alt="${item.name} Angle 2" style="transform: scale(0.9) rotate(5deg);">
                    </div>
                    <div class="pd-thumb" data-src="${item.src}">
                        <img src="${item.src}" alt="${item.name} Angle 3" style="transform: scale(1.1) scaleX(-1);">
                    </div>
                    <div class="pd-thumb" data-src="${item.src}">
                        <img src="${item.src}" alt="${item.name} Angle 4" style="filter: brightness(1.05);">
                    </div>
                </div>
            </div>

            <div class="pd-info">
                <div class="pd-meta-row">
                    <span class="pd-type">${item.type}</span>
                    <div class="pd-rating-badge-large">
                        <span class="star-icon">★</span>
                        <span>${rating.score}</span>
                        <span class="review-text">(${rating.reviewCount} verified ratings)</span>
                    </div>
                </div>

                <h2 class="pd-title">${item.name}</h2>
                <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:12px;">Net Qty: <strong>${item.unit}</strong></p>

                <div class="pd-price-row">
                    <span class="pd-price">₹${item.discount_price}</span>
                    ${item.price > item.discount_price ? `<span class="pd-mrp">₹${item.price}</span> <span class="pd-discount">${discountPercent}% OFF</span>` : ''}
                </div>

                <p class="pd-desc">Premium grade hand-picked ${item.name}. Sourced directly from certified farmers and ethical suppliers to ensure farm-to-doorstep freshness within 10 minutes.</p>

                <!-- Actions -->
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

                <!-- Key Specifications Grid -->
                <div class="pd-specs-grid">
                    <div class="spec-card">
                        <div class="spec-icon"><i data-lucide="clock"></i></div>
                        <div>
                            <div class="spec-label">Shelf Life</div>
                            <div class="spec-value">${shelfLife}</div>
                        </div>
                    </div>
                    <div class="spec-card">
                        <div class="spec-icon"><i data-lucide="globe-2"></i></div>
                        <div>
                            <div class="spec-label">Country of Origin</div>
                            <div class="spec-value">${countryOrigin}</div>
                        </div>
                    </div>
                    <div class="spec-card">
                        <div class="spec-icon"><i data-lucide="thermometer-snowflake"></i></div>
                        <div>
                            <div class="spec-label">Storage Advice</div>
                            <div class="spec-value">${storageInstruction}</div>
                        </div>
                    </div>
                    <div class="spec-card">
                        <div class="spec-icon"><i data-lucide="shield-check"></i></div>
                        <div>
                            <div class="spec-label">Quality Assured</div>
                            <div class="spec-value">FSSAI & Hygiene Verified</div>
                        </div>
                    </div>
                </div>

                <!-- Customer Reviews & Rating Breakdown -->
                <div class="pd-reviews-section">
                    <h3>Ratings & Customer Reviews</h3>
                    <div class="reviews-summary-card">
                        <div class="score-box">
                            <div class="score-num">${rating.score}</div>
                            <div class="score-stars">★★★★★</div>
                            <div class="score-sub">${rating.reviewCount} Reviews</div>
                        </div>
                        <div class="breakdown-bars">
                            <div class="breakdown-row">
                                <span class="star-label">5 ★</span>
                                <div class="bar-track"><div class="bar-fill" style="width: ${rating.breakdown.p5}%;"></div></div>
                                <span class="pct-label">${rating.breakdown.p5}%</span>
                            </div>
                            <div class="breakdown-row">
                                <span class="star-label">4 ★</span>
                                <div class="bar-track"><div class="bar-fill" style="width: ${rating.breakdown.p4}%;"></div></div>
                                <span class="pct-label">${rating.breakdown.p4}%</span>
                            </div>
                            <div class="breakdown-row">
                                <span class="star-label">3 ★</span>
                                <div class="bar-track"><div class="bar-fill" style="width: ${rating.breakdown.p3}%;"></div></div>
                                <span class="pct-label">${rating.breakdown.p3}%</span>
                            </div>
                            <div class="breakdown-row">
                                <span class="star-label">2 ★</span>
                                <div class="bar-track"><div class="bar-fill" style="width: ${rating.breakdown.p2}%;"></div></div>
                                <span class="pct-label">${rating.breakdown.p2}%</span>
                            </div>
                            <div class="breakdown-row">
                                <span class="star-label">1 ★</span>
                                <div class="bar-track"><div class="bar-fill" style="width: ${rating.breakdown.p1}%;"></div></div>
                                <span class="pct-label">${rating.breakdown.p1}%</span>
                            </div>
                        </div>
                    </div>

                    <div class="verified-reviews-list">
                        ${rating.reviews.map(rev => `
                            <div class="review-card">
                                <div class="review-header">
                                    <div class="reviewer-info">
                                        <div class="reviewer-avatar">${rev.avatar}</div>
                                        <div>
                                            <div class="reviewer-name">${rev.name}</div>
                                            <span class="verified-badge"><i data-lucide="check-circle-2" style="width:12px;height:12px;"></i> Verified Buyer • ${rev.date}</span>
                                        </div>
                                    </div>
                                    <div class="review-stars">${'★'.repeat(rev.rating)}</div>
                                </div>
                                <p class="review-comment">"${rev.comment}"</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Image Gallery Zoom interaction
        const imageWrap = document.getElementById('pdMainImageWrap');
        const mainImage = document.getElementById('pdMainImage');
        if (imageWrap && mainImage) {
            imageWrap.addEventListener('mousemove', (e) => {
                const rect = imageWrap.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                mainImage.style.transformOrigin = `${x}% ${y}%`;
                imageWrap.classList.add('is-zoomed');
            });
            imageWrap.addEventListener('mouseleave', () => {
                imageWrap.classList.remove('is-zoomed');
                mainImage.style.transformOrigin = 'center center';
            });
        }

        // Gallery Thumbnails Click interaction
        const thumbs = detailContainer.querySelectorAll('.pd-thumb');
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                if (mainImage) {
                    mainImage.style.opacity = '0.5';
                    setTimeout(() => {
                        mainImage.src = thumb.dataset.src;
                        mainImage.style.opacity = '1';
                    }, 120);
                }
            });
        });

        // Render "Customers Also Bought" Recommended Carousel
        const alsoBoughtCarousel = document.getElementById('alsoBoughtCarousel');
        if (alsoBoughtCarousel) {
            alsoBoughtCarousel.innerHTML = '';
            // Curate complementary items from different or related categories
            const complementary = this.data.filter(i => i.name !== item.name).slice(0, 8);
            complementary.forEach(cItem => {
                alsoBoughtCarousel.appendChild(this.createProductCard(cItem));
            });
        }

        // Setup Carousel Navigation Buttons
        const prevBtn = document.getElementById('alsoBoughtPrev');
        const nextBtn = document.getElementById('alsoBoughtNext');
        if (prevBtn && nextBtn && alsoBoughtCarousel) {
            prevBtn.onclick = () => {
                alsoBoughtCarousel.scrollBy({ left: -260, behavior: 'smooth' });
            };
            nextBtn.onclick = () => {
                alsoBoughtCarousel.scrollBy({ left: 260, behavior: 'smooth' });
            };
        }

        // Render Related Products in the same category
        const relatedItems = this.controller.filterItems(item.type).filter(i => i.name !== item.name).slice(0, 6);
        const relatedGrid = document.getElementById('relatedProductsGrid');
        if (relatedGrid) {
            relatedGrid.innerHTML = '';
            relatedItems.forEach(relItem => {
                relatedGrid.appendChild(this.createProductCard(relItem));
            });
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.lucide) lucide.createIcons();
    }

    updateNavHighlight(categoryName) {
        document.querySelectorAll('.typeName').forEach(nav => {
            if (nav.dataset.category === categoryName) nav.classList.add('active');
            else nav.classList.remove('active');
        });
    }

    // ================= AUTO SLIDER =================
    setupAutoSlider() {
        const sliderTrack = document.getElementById('sliderTrack');
        if (!sliderTrack) return;
        
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
        if (this.sliderInterval) clearInterval(this.sliderInterval);
        
        this.sliderInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % topItems.length;
            sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }, 3000);
    }

    // ================= HOME CATEGORY RENDERING =================
    renderHomePage() {
        const otherCategoriesContainer = document.getElementById('otherCategories');
        if (otherCategoriesContainer) otherCategoriesContainer.innerHTML = '';

        this.elementList.forEach(category => {
            const items = this.controller.filterItems(category).slice(0, 8);
            if (items.length === 0) return;

            const sectionEl = document.getElementById(`sec-${category}`);
            const contentEl = document.getElementById(`content-${category}`);

            if (sectionEl && contentEl) {
                sectionEl.style.display = 'block';
                contentEl.innerHTML = '';
                
                if (category === 'Kitchen') {
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
                    items.forEach(item => contentEl.appendChild(this.createProductCard(item)));
                    items.forEach(item => contentEl.appendChild(this.createProductCard(item)));
                }
                else {
                    items.forEach(item => contentEl.appendChild(this.createProductCard(item)));
                }
            } else if (otherCategoriesContainer) {
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
                    if (cat === 'Home') this.showHomeView();
                    else this.showCategoryView(cat);
                });
            });
        }
    }

    // ================= CATEGORY PRODUCTS RENDERING (WITH FILTER & SORT) =================
    renderCategoryProducts(categoryName, searchQuery = '', sortBy = 'featured') {
        if (!this.categoryProductsGrid) return;
        this.categoryProductsGrid.innerHTML = '';
        
        let items = this.getItemsForCategory(categoryName);
            
        // 1. Search Query
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            items = items.filter(item => 
                item.name.toLowerCase().includes(query) ||
                item.type.toLowerCase().includes(query)
            );
        }

        // 2. Tag Filters
        if (this.activeFilterTag === 'fresh') {
            items = items.filter(item => 
                ['fresh fruits', 'fresh vegetables', 'leafy herbs'].includes(item.type.toLowerCase())
            );
        } else if (this.activeFilterTag === 'bestseller') {
            items = items.filter(item => {
                const disc = (item.price - item.discount_price) / item.price;
                const rating = parseFloat(this.getProductRating(item).score);
                return disc >= 0.15 || rating >= 4.8;
            });
        } else if (this.activeFilterTag === 'under50') {
            items = items.filter(item => item.discount_price < 50);
        }

        // 3. Apply Sorting
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
        } else if (sortBy === 'featured') {
            items.sort((a,b) => (b.price - b.discount_price) - (a.price - a.discount_price));
        }

        // Update count badge
        if (this.categoryProductCount) {
            this.categoryProductCount.textContent = `${items.length} Product${items.length === 1 ? '' : 's'}`;
        }
        
        if (items.length === 0) {
            this.categoryProductsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 0;">
                    <i data-lucide="search-x" style="width: 48px; height: 48px; margin-bottom: 16px; color: var(--text-muted); opacity: 0.5;"></i>
                    <h3 style="font-size: 1.25rem; margin-bottom: 8px; font-weight: 700;">No products found</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Try a different search or filter option.</p>
                </div>
            `;
        } else {
            items.forEach(item => {
                this.categoryProductsGrid.appendChild(this.createProductCard(item));
            });
            
            if (window.lucide) lucide.createIcons();

            if (window.gsap) {
                gsap.from("#categoryProductsGrid .itemName", { y: 20, opacity: 0, duration: 0.4, stagger: 0.04, ease: "power2.out" });
            }
        }
    }

    createProductCard(element) {
        const itemDiv = document.createElement("div");                        
        itemDiv.classList.add("itemName");  
        itemDiv.dataset.name = element.name; 
        
        const discountPercent = Math.round(((element.price - element.discount_price) / element.price) * 100);
        const rating = this.getProductRating(element);
        const isWishlisted = this.wishlist.has(element.name);
        
        itemDiv.innerHTML = `
            <div class="product-image-container clickable-area">
                <button class="wishlist-card-btn ${isWishlisted ? 'active' : ''}" data-name="${element.name}" aria-label="Toggle Wishlist" title="Wishlist">
                    <i data-lucide="heart"></i>
                </button>
                <img class="itemImage" src="${element.src}" alt="${element.name}" loading="lazy" onerror="this.src='/javascript.svg';">
                ${discountPercent > 0 ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                <div class="delivery-badge"><i data-lucide="zap" style="width:10px;height:10px;color:var(--primary)"></i> 10 MINS</div>
            </div>
            <div class="product-content clickable-area">
                <div class="product-rating-badge">
                    <span class="star-icon">★</span>
                    <span>${rating.score}</span>
                    <span class="rating-count">(${rating.reviewCount})</span>
                </div>
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
            
            // 1. Wishlist Heart Button Click on Card
            const wishlistCardBtn = e.target.closest('.wishlist-card-btn');
            if (wishlistCardBtn) {
                e.stopPropagation();
                e.preventDefault();
                const name = wishlistCardBtn.dataset.name;
                if (name) this.toggleWishlist(name);
                return;
            }

            // 2. Wishlist Heart Button in Product Detail View
            const pdWishlistBtn = e.target.closest('.pd-wishlist-toggle-btn');
            if (pdWishlistBtn) {
                e.stopPropagation();
                e.preventDefault();
                const name = pdWishlistBtn.dataset.name;
                if (name) this.toggleWishlist(name);
                return;
            }

            // 3. Click on Product Image/Title -> Show Detail View
            if (e.target.closest('.clickable-area')) {
                const card = e.target.closest('.itemName');
                if (card) {
                    const item = this.data.find(i => i.name === card.dataset.name);
                    if (item) this.showProductDetailView(item);
                }
                return;
            }

            // 4. Add / Plus Button (Global)
            const addBtn = e.target.closest('.add-btn') || e.target.closest('.add.qty-plus') || e.target.closest('.add-detail');
            if (addBtn) {
                let item;
                if (addBtn.classList.contains('add-btn-detail') || addBtn.classList.contains('add-detail')) {
                    const actionsDiv = addBtn.closest('.pd-actions');
                    item = this.data.find(i => i.name === actionsDiv.dataset.name);
                    if (item) {
                        item.quantity = (item.quantity || 0) + 1;
                        this.saveCartToStorage();
                        this.updateProductDetailDOM(item, actionsDiv);
                    }
                } else {
                    const card = addBtn.closest('.itemName');
                    if (card) {
                        item = this.data.find(i => i.name === card.dataset.name);
                        if (item) { item.quantity = (item.quantity || 0) + 1; this.saveCartToStorage(); }
                    }
                }

                if (item) {
                    if (item.quantity === 1) this.showToast(`Added ${item.name} to cart`);
                    this.updateAllCardDOMs(item);
                    this.updateCartUI();
                }
                return;
            }

            // 5. Subtract Button (Global)
            const subBtn = e.target.closest('.subtract') || e.target.closest('.subtract-detail');
            if (subBtn) {
                let item;
                if (subBtn.classList.contains('subtract-detail')) {
                    const actionsDiv = subBtn.closest('.pd-actions');
                    item = this.data.find(i => i.name === actionsDiv.dataset.name);
                    if (item && item.quantity > 0) {
                        item.quantity -= 1;
                        this.saveCartToStorage();
                        this.updateProductDetailDOM(item, actionsDiv);
                    }
                } else {
                    const card = subBtn.closest('.itemName');
                    if (card) {
                        item = this.data.find(i => i.name === card.dataset.name);
                        if (item && item.quantity > 0) { item.quantity -= 1; this.saveCartToStorage(); }
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
        let debounceTimer;
        const liveSearch = (e) => {
            clearTimeout(debounceTimer);
            const query = (e.target.value || '').trim();
            if (e.key === 'Enter') {
                if (query) this.showCategoryView('Search Results', query);
                return;
            }
            debounceTimer = setTimeout(() => {
                if (query.length >= 2) {
                    this.showCategoryView('Search Results', query);
                } else if (query.length === 0 && this.currentCategory === 'Search Results') {
                    this.showHomeView();
                }
            }, 300);
        };

        if (this.globalSearchInput) {
            this.globalSearchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') liveSearch(e); });
            this.globalSearchInput.addEventListener('input', liveSearch);
        }
        if (this.mobileSearchInput) {
            this.mobileSearchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') liveSearch(e); });
            this.mobileSearchInput.addEventListener('input', liveSearch);
        }

        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', (e) => {
                const currentSearch = this.globalSearchInput?.value || this.mobileSearchInput?.value || '';
                const searchQuery = this.currentCategory === 'Search Results' ? currentSearch : '';
                this.renderCategoryProducts(this.currentCategory, searchQuery, e.target.value);
            });
        }
    }

    setupFilterTags() {
        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach(btn => {
            btn.addEventListener('click', () => {
                filterTags.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeFilterTag = btn.dataset.filter || 'all';

                const currentSearch = this.globalSearchInput?.value || this.mobileSearchInput?.value || '';
                const searchQuery = this.currentCategory === 'Search Results' ? currentSearch : '';
                const currentSort = this.sortSelect?.value || 'featured';
                this.renderCategoryProducts(this.currentCategory, searchQuery, currentSort);
            });
        });
    }

    // ================= WISHLIST SYSTEM =================
    loadWishlistFromStorage() {
        try {
            const saved = localStorage.getItem('megamart_wishlist');
            if (saved) {
                const parsed = JSON.parse(saved);
                return new Set(Array.isArray(parsed) ? parsed : []);
            }
        } catch (e) {
            console.error('Error loading wishlist from storage:', e);
        }
        return new Set();
    }

    saveWishlistToStorage() {
        try {
            localStorage.setItem('megamart_wishlist', JSON.stringify([...this.wishlist]));
        } catch (e) {
            console.error('Error saving wishlist to storage:', e);
        }
    }

    toggleWishlist(itemName) {
        const item = this.data.find(i => i.name === itemName);
        if (!item) return;

        if (this.wishlist.has(itemName)) {
            this.wishlist.delete(itemName);
            this.showToast(`Removed ${itemName} from wishlist`);
        } else {
            this.wishlist.add(itemName);
            this.showToast(`Saved ${itemName} to wishlist ❤️`);
        }

        this.saveWishlistToStorage();
        this.updateWishlistUI();
        this.updateWishlistButtonStates();
    }

    updateWishlistButtonStates() {
        document.querySelectorAll('.wishlist-card-btn').forEach(btn => {
            const name = btn.dataset.name;
            if (this.wishlist.has(name)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const pdBtn = document.getElementById('pdWishlistBtn');
        if (pdBtn) {
            const name = pdBtn.dataset.name;
            if (this.wishlist.has(name)) {
                pdBtn.classList.add('active');
            } else {
                pdBtn.classList.remove('active');
            }
        }
    }

    updateWishlistUI() {
        const count = this.wishlist.size;
        if (this.wishlistCount) this.wishlistCount.textContent = count;
        if (this.mobileWishlistCount) this.mobileWishlistCount.textContent = count;
        if (this.bottomWishlistCount) this.bottomWishlistCount.textContent = count;
        if (this.wishlistCountLabel) this.wishlistCountLabel.textContent = `${count} item${count === 1 ? '' : 's'}`;
        if (this.wishlistDrawerCount) this.wishlistDrawerCount.textContent = count;

        if (this.wishlistSidebar && this.wishlistSidebar.classList.contains('active')) {
            this.renderWishlistSidebar();
        }
    }

    setupWishlistModal() {
        const wishlistBtn = document.getElementById('wishlistButton');
        const mobileWishlistBtn = document.getElementById('mobileWishlistBtn');
        const closeWishlist = document.getElementById('closeWishlist');
        const overlay = document.getElementById('wishlistOverlay');

        wishlistBtn?.addEventListener('click', () => this.openWishlistSidebar());
        mobileWishlistBtn?.addEventListener('click', () => this.openWishlistSidebar());
        closeWishlist?.addEventListener('click', () => this.closeWishlistSidebar());
        overlay?.addEventListener('click', () => this.closeWishlistSidebar());

        // Wishlist item interactions (Move to cart & Remove)
        this.wishlistItemsContainer?.addEventListener('click', (e) => {
            const moveBtn = e.target.closest('.wishlist-move-btn');
            if (moveBtn) {
                const name = moveBtn.dataset.name;
                const item = this.data.find(i => i.name === name);
                if (item) {
                    item.quantity = (item.quantity || 0) + 1;
                    this.saveCartToStorage();
                    this.updateAllCardDOMs(item);
                    this.updateCartUI();
                    this.showToast(`Moved ${item.name} to cart 🛒`);
                }
                return;
            }

            const removeBtn = e.target.closest('.wishlist-remove-btn');
            if (removeBtn) {
                const name = removeBtn.dataset.name;
                this.toggleWishlist(name);
            }
        });

        // Wishlist Footer interactions
        this.wishlistFooter?.addEventListener('click', (e) => {
            const moveAllBtn = e.target.closest('.move-all-btn');
            if (moveAllBtn) {
                let movedCount = 0;
                this.wishlist.forEach(name => {
                    const item = this.data.find(i => i.name === name);
                    if (item) {
                        item.quantity = (item.quantity || 0) + 1;
                        movedCount++;
                    }
                });
                if (movedCount > 0) {
                    this.saveCartToStorage();
                    this.data.forEach(item => this.updateAllCardDOMs(item));
                    this.updateCartUI();
                    this.showToast(`Moved all ${movedCount} favorites to cart! 🛒`);
                }
                return;
            }

            const exploreBtn = e.target.closest('.explore-btn');
            if (exploreBtn) {
                this.closeWishlistSidebar();
                this.showCategoryView('All Products');
            }
        });
    }

    openWishlistSidebar() {
        this.renderWishlistSidebar();
        this.wishlistSidebar?.classList.add('active');
        this.wishlistOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeWishlistSidebar() {
        this.wishlistSidebar?.classList.remove('active');
        this.wishlistOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    renderWishlistSidebar() {
        if (!this.wishlistItemsContainer || !this.wishlistFooter) return;
        
        const wishlistedItems = this.data.filter(item => this.wishlist.has(item.name));
        
        if (wishlistedItems.length === 0) {
            this.wishlistItemsContainer.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-wishlist-icon">
                        <i data-lucide="heart"></i>
                    </div>
                    <h3>Your Wishlist is Empty</h3>
                    <p>Tap the heart icon on any product to save items you love for fast re-ordering!</p>
                    <button class="explore-btn">Start Exploring</button>
                </div>
            `;
            this.wishlistFooter.innerHTML = '';
        } else {
            this.wishlistItemsContainer.innerHTML = wishlistedItems.map(item => {
                const discountPercent = Math.round(((item.price - item.discount_price) / item.price) * 100);
                return `
                    <div class="wishlist-item">
                        <img src="${item.src}" alt="${item.name}" class="wishlist-item-img" onerror="this.src='/javascript.svg';">
                        <div class="wishlist-item-details">
                            <div class="wishlist-item-title">${item.name}</div>
                            <div class="wishlist-item-unit">${item.unit}</div>
                            <div class="wishlist-item-prices">
                                <span class="wishlist-item-price">₹${item.discount_price}</span>
                                ${item.price > item.discount_price ? `<span class="wishlist-item-mrp">₹${item.price}</span>` : ''}
                            </div>
                        </div>
                        <div class="wishlist-item-actions">
                            <button class="wishlist-move-btn" data-name="${item.name}">
                                <i data-lucide="shopping-cart" style="width:14px;height:14px;"></i> Move to Cart
                            </button>
                            <button class="wishlist-remove-btn" data-name="${item.name}">
                                <i data-lucide="trash-2" style="width:12px;height:12px;"></i> Remove
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            this.wishlistFooter.innerHTML = `
                <button class="move-all-btn">
                    <i data-lucide="shopping-cart"></i> Move All to Cart (${wishlistedItems.length})
                </button>
            `;
        }

        if (window.lucide) lucide.createIcons();
    }
    
    // ================= CART =================
    setupCartModal() {
        const cartButton = document.getElementById('cartButton');
        const cartOverlay = document.getElementById('cartOverlay');
        const closeCart = document.getElementById('closeCart');
        
        cartButton?.addEventListener('click', () => this.openCartSidebar());
        closeCart?.addEventListener('click', () => this.closeCartSidebar());
        cartOverlay?.addEventListener('click', () => this.closeCartSidebar());
        
        document.getElementById('cartItems')?.addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            const item = this.data.find(i => i.name === name);
            if (!item) return;

            if (e.target.classList.contains('subtract-cart')) {
                item.quantity -= 1;
            } else if (e.target.classList.contains('add-cart')) {
                item.quantity += 1;
            }

            this.saveCartToStorage();
            this.updateAllCardDOMs(item);
            const pdActions = document.querySelector('.pd-actions');
            if (pdActions && pdActions.dataset.name === item.name) {
                this.updateProductDetailDOM(item, pdActions);
            }
            this.updateCartUI();
        });
    }

    openCartSidebar() {
        this.renderCartSidebar();
        document.getElementById('cartSidebar')?.classList.add('active');
        document.getElementById('cartOverlay')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCartSidebar() {
        document.getElementById('cartSidebar')?.classList.remove('active');
        document.getElementById('cartOverlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateCartUI() {
        let totalItems = 0;
        let totalPrice = 0;
        
        this.data.forEach(item => {
            if (item.quantity > 0) {
                totalItems += item.quantity;
                totalPrice += (item.discount_price * item.quantity);
            }
        });
        
        if (this.cartCount) this.cartCount.textContent = totalItems;
        if (this.mobileCount) this.mobileCount.textContent = totalItems;
        if (this.cartTotalHeader) this.cartTotalHeader.textContent = `₹${totalPrice.toFixed(2)}`;
        
        if (document.getElementById('cartSidebar')?.classList.contains('active')) {
            this.renderCartSidebar();
        }
    }
    
    renderCartSidebar() {
        const cartItems = this.data.filter(item => item.quantity > 0);
        const cartItemsContainer = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');
        if (!cartItemsContainer || !cartFooter) return;
        
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
        if (!container) return;
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
        if (window.gsap && window.ScrollTrigger) {
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

    // ================= LOCALSTORAGE PERSISTENCE =================
    saveCartToStorage() {
        const cartState = {};
        this.data.forEach(item => {
            if (item.quantity > 0) {
                cartState[item.name] = item.quantity;
            }
        });
        localStorage.setItem('megamart_cart', JSON.stringify(cartState));
    }

    loadCartFromStorage() {
        try {
            const saved = localStorage.getItem('megamart_cart');
            if (saved) {
                const cartState = JSON.parse(saved);
                let restoredCount = 0;
                this.data.forEach(item => {
                    if (cartState[item.name]) {
                        item.quantity = cartState[item.name];
                        restoredCount += item.quantity;
                        this.updateAllCardDOMs(item);
                    }
                });
                if (restoredCount > 0) {
                    this.updateCartUI();
                }
            }
        } catch (e) {
            console.error('Error loading cart from storage:', e);
        }
    }

    // ================= CHECKOUT MODAL LOGIC =================
    setupCheckoutModal() {
        const checkoutModal = document.getElementById('checkoutModal');
        const checkoutOverlay = document.getElementById('checkoutOverlay');
        const closeCheckout = document.getElementById('closeCheckout');
        const applyCouponBtn = document.getElementById('applyCouponBtn');
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const continueShoppingBtn = document.getElementById('continueShoppingBtn');
        const cartFooter = document.getElementById('cartFooter');

        if (!checkoutModal) return;

        this.appliedDiscount = 0;
        this.activeCouponCode = '';

        // Open checkout from cart sidebar
        if (cartFooter) {
            cartFooter.addEventListener('click', (e) => {
                if (e.target.classList.contains('checkout-btn')) {
                    this.closeCartSidebar();
                    this.openCheckoutModal();
                }
            });
        }

        // Close handlers
        closeCheckout?.addEventListener('click', () => this.closeCheckoutModal());
        checkoutOverlay?.addEventListener('click', () => this.closeCheckoutModal());
        continueShoppingBtn?.addEventListener('click', () => {
            this.closeCheckoutModal();
            this.showHomeView();
        });

        // Payment cards toggle
        document.querySelectorAll('.payment-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                const radio = card.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });

        // Apply coupon handler
        applyCouponBtn?.addEventListener('click', () => {
            const input = document.getElementById('couponInput');
            const status = document.getElementById('couponStatus');
            const code = (input?.value || '').trim().toUpperCase();

            if (code === 'MEGA50') {
                this.appliedDiscount = 50;
                this.activeCouponCode = 'MEGA50';
                status.className = 'coupon-status success';
                status.textContent = 'Coupon applied: ₹50 Instant Discount!';
            } else if (code === 'WELCOME10') {
                const subtotal = this.data.reduce((sum, item) => sum + (item.quantity > 0 ? item.discount_price * item.quantity : 0), 0);
                this.appliedDiscount = Math.round(subtotal * 0.10);
                this.activeCouponCode = 'WELCOME10';
                status.className = 'coupon-status success';
                status.textContent = `Coupon applied: 10% OFF (Saved ₹${this.appliedDiscount})!`;
            } else {
                this.appliedDiscount = 0;
                this.activeCouponCode = '';
                status.className = 'coupon-status error';
                status.textContent = 'Invalid coupon code. Try MEGA50 or WELCOME10';
            }
            this.renderCheckoutSummary();
        });

        // Place order button
        placeOrderBtn?.addEventListener('click', () => this.handlePlaceOrder());
    }

    openCheckoutModal() {
        const cartItems = this.data.filter(item => item.quantity > 0);
        if (cartItems.length === 0) {
            this.showToast('Your cart is empty!');
            return;
        }

        const modal = document.getElementById('checkoutModal');
        const overlay = document.getElementById('checkoutOverlay');
        const body = document.getElementById('checkoutBody');
        const success = document.getElementById('checkoutSuccess');

        if (body) body.style.display = 'flex';
        if (success) success.style.display = 'none';

        this.renderCheckoutSummary();
        modal?.classList.add('active');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.lucide) lucide.createIcons();
    }

    closeCheckoutModal() {
        document.getElementById('checkoutModal')?.classList.remove('active');
        document.getElementById('checkoutOverlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    renderCheckoutSummary() {
        const summaryBox = document.getElementById('checkoutSummaryBox');
        if (!summaryBox) return;

        const cartItems = this.data.filter(item => item.quantity > 0);
        const subtotal = cartItems.reduce((sum, item) => sum + (item.discount_price * item.quantity), 0);
        const deliveryFee = subtotal > 499 ? 0 : 25;
        const discount = Math.min(this.appliedDiscount || 0, subtotal);
        const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

        summaryBox.innerHTML = `
            <div class="bill-row" style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.9rem;">
                <span style="color:var(--text-muted);">Items Subtotal (${cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span style="font-weight:600;">₹${subtotal.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
            <div class="bill-row" style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.9rem;color:var(--success);">
                <span>Coupon Discount (${this.activeCouponCode})</span>
                <span style="font-weight:600;">-₹${discount.toFixed(2)}</span>
            </div>` : ''}
            <div class="bill-row" style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.9rem;">
                <span style="color:var(--text-muted);">Delivery Fee</span>
                <span style="font-weight:600;">${deliveryFee === 0 ? '<strong style="color:var(--success);">FREE</strong>' : `₹${deliveryFee}`}</span>
            </div>
            <div class="bill-row total" style="display:flex;justify-content:space-between;padding-top:10px;margin-top:6px;border-top:1px solid #e5e7eb;font-weight:800;font-size:1.1rem;color:var(--text-dark);">
                <span>To Pay</span>
                <span style="color:var(--primary);">₹${grandTotal.toFixed(2)}</span>
            </div>
        `;
    }

    handlePlaceOrder() {
        const name = (document.getElementById('custName')?.value || '').trim();
        const phone = (document.getElementById('custPhone')?.value || '').trim();
        const address = (document.getElementById('custAddress')?.value || '').trim();
        const pin = (document.getElementById('custPin')?.value || '').trim();

        if (!name || name.length < 2) {
            this.showToast('Please enter your full name');
            return;
        }
        if (!phone || phone.length < 10) {
            this.showToast('Please enter a valid 10-digit mobile number');
            return;
        }
        if (!address || address.length < 5) {
            this.showToast('Please enter a complete delivery address');
            return;
        }

        const cartItems = this.data.filter(item => item.quantity > 0);
        const subtotal = cartItems.reduce((sum, item) => sum + (item.discount_price * item.quantity), 0);
        const discount = this.appliedDiscount || 0;
        const grandTotal = Math.max(0, subtotal - discount + (subtotal > 499 ? 0 : 25));
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'UPI';

        const orderId = '#MM-' + Math.floor(100000 + Math.random() * 900000);

        // Save order to history
        const orderRecord = {
            orderId,
            date: new Date().toISOString(),
            customer: { name, phone, address, pin },
            items: cartItems.map(i => ({ name: i.name, qty: i.quantity, price: i.discount_price })),
            total: grandTotal,
            paymentMethod,
        };

        const existingOrders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
        existingOrders.unshift(orderRecord);
        localStorage.setItem('megamart_orders', JSON.stringify(existingOrders));

        // Clear cart
        this.data.forEach(item => { item.quantity = 0; });
        this.saveCartToStorage();
        this.updateCartUI();
        document.querySelectorAll('.itemName').forEach(c => {
            const btnContainer = c.querySelector('.btn-container');
            if (btnContainer) btnContainer.innerHTML = '<button class="add-btn">Add</button>';
        });

        // Switch to success view
        const body = document.getElementById('checkoutBody');
        const success = document.getElementById('checkoutSuccess');
        if (body) body.style.display = 'none';
        if (success) {
            success.style.display = 'flex';
            document.getElementById('successOrderId').textContent = orderId;
            document.getElementById('successOrderDetails').innerHTML = `
                <p><strong>Deliver to:</strong> ${name}, ${address} (${pin})</p>
                <p><strong>Payment:</strong> ${paymentMethod} (₹${grandTotal.toFixed(2)})</p>
                <p><strong>Items:</strong> ${cartItems.length} items ordered</p>
            `;
            if (window.lucide) lucide.createIcons();
        }

        this.showToast('🎉 Order placed successfully!');
    }
}
