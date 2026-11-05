import { Controller } from "../controller/controller";
import { getProductVariants, getProductCoins } from "../model/model";

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
        this.megaCoins = this.loadMegaCoinsFromStorage();
        this.redeemMegaCoins = false;
        this.redeemedCoinsValue = 0;
        
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
        this.setupPincodeLocation();
        this.updateMegaCoinsUI();
        this.setupFlashSaleTimer();
        this.setupMegaCoinsNav();
        
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
        const coins = getProductCoins(item);
        const variants = getProductVariants(item);

        // Determine realistic specifications based on category
        const isPerishable = ['fresh fruits', 'fresh vegetables', 'leafy herbs'].includes(item.type.toLowerCase());
        const shelfLife = isPerishable ? "3 - 5 Days from harvest" : "6 - 12 Months (Sealed)";
        const storageInstruction = isPerishable ? "Refrigerate below 4°C or store in ventilated mesh" : "Store in a cool, dry place away from sunlight";
        const countryOrigin = (item.countryoforigin || 'India').toUpperCase();

        // Location state
        const savedPin = localStorage.getItem('megamart_pincode') || '400001';
        const savedCity = localStorage.getItem('megamart_city') || 'Mumbai';

        // Frequently Bought Together Bundle
        const [comp1, comp2] = this.getFrequentlyBoughtTogether(item);
        const bundleRawPrice = item.discount_price + comp1.discount_price + comp2.discount_price;
        const bundleSavings = 30;
        const bundleFinalPrice = Math.max(1, bundleRawPrice - bundleSavings);

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

                ${item.isFlashDeal ? `<div class="pd-flash-badge"><span class="flame-icon">🔥</span> FLASH SALE DEAL • ${item.flashDiscount || '40% OFF'}</div>` : ''}

                <h2 class="pd-title">${item.name}</h2>

                <!-- Flipkart 'MegaAssured' Trust Badge & Guarantee -->
                <div class="pd-mega-assured-card">
                    <div class="mega-assured-badge lg" title="100% Quality Assured & Quick Delivery">
                        <span class="assured-check">✓</span>
                        <span class="assured-text"><span class="assured-mega">Mega</span>Assured</span>
                    </div>
                    <div class="pd-mega-assured-content">
                        <span class="pd-mega-assured-title">MegaAssured 100% Quality Guarantee</span>
                        <span class="pd-mega-assured-desc">Direct farm & brand sourcing • Quality checked • 10-Min Superfast Delivery</span>
                    </div>
                </div>

                <p class="pd-net-qty" style="color:var(--text-muted); font-size:0.9rem; margin-bottom:12px;">Net Qty: <strong>${item.unit}</strong></p>

                <!-- Multi-Weight / Pack Size Variant Selector -->
                <div class="pd-variant-section">
                    <div class="variant-label-row">
                        <span class="variant-label">Pack Size / Weight:</span>
                        <span class="variant-selected-value" id="pdSelectedVariantUnit">${item.unit}</span>
                    </div>
                    <div class="variant-pills" id="pdVariantPills">
                        ${variants.map(v => `
                            <button type="button" class="variant-pill ${v.unit === item.unit ? 'active' : ''}" 
                                    data-unit="${v.unit}" 
                                    data-price="${v.price}" 
                                    data-discount="${v.discount_price}">
                                <span class="variant-unit-name">${v.unit}</span>
                                <span class="variant-unit-price">₹${v.discount_price}</span>
                                ${v.price > v.discount_price ? `<span class="variant-badge-save">Save ₹${v.price - v.discount_price}</span>` : ''}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="pd-price-row">
                    <span class="pd-price">₹${item.discount_price}</span>
                    ${item.price > item.discount_price ? `<span class="pd-mrp">₹${item.price}</span> <span class="pd-discount">${discountPercent}% OFF</span>` : ''}
                </div>

                <!-- Flipkart-style 'MegaCoins' Rewards Banner -->
                <div class="pd-megacoins-reward">
                    <div class="pd-coin-icon-box">🪙</div>
                    <div class="pd-coin-text-box">
                        <span class="pd-coin-title"><strong>Earn ${coins} MegaCoins</strong> on this purchase</span>
                        <span class="pd-coin-sub">Redeem coins on checkout for instant ₹1/coin cash discount</span>
                    </div>
                </div>

                <p class="pd-desc">Premium grade hand-picked ${item.name}. Sourced directly from certified farmers and ethical suppliers to ensure farm-to-doorstep freshness within 10 minutes.</p>

                <!-- Amazon Pincode & Delivery Estimator -->
                <div class="pd-delivery-estimator" id="pdDeliveryEstimator">
                    <div class="estimator-header">
                        <div class="estimator-icon"><i data-lucide="truck"></i></div>
                        <div class="estimator-title-wrap">
                            <span class="estimator-label">Delivery to</span>
                            <span class="estimator-target" id="pdCurrentPincodeDisplay">${savedCity}, ${savedPin}</span>
                        </div>
                    </div>
                    <div class="estimator-input-group">
                        <div class="estimator-input-wrapper">
                            <i data-lucide="map-pin" class="estimator-input-icon"></i>
                            <input type="text" id="pdPincodeInput" placeholder="Enter 6-digit Pincode" maxlength="6" value="${savedPin}">
                        </div>
                        <button type="button" class="estimator-check-btn" id="pdPincodeCheckBtn">Check</button>
                    </div>
                    <div class="estimator-result-badge" id="pdEstimatorResult">
                        <div class="estimator-speed-row">
                            <i data-lucide="zap" class="zap-icon"></i>
                            <span>⚡ Express Delivery in 10-15 mins! FREE on orders above ₹499</span>
                        </div>
                        <div class="estimator-meta-row">
                            <span>✓ In stock at Dark Store #${Math.abs(savedPin.charCodeAt(0) % 20) + 1}</span>
                            <span>✓ Cash & UPI on Delivery available</span>
                        </div>
                    </div>
                </div>

                <!-- Actions: Add to Cart + Amazon 'Buy Now' 1-Click Instant Checkout -->
                <div class="pd-actions" data-name="${item.name}">
                    <div class="pd-btn-group">
                        ${!item.quantity ? 
                            `<button class="pd-add-btn add-btn-detail"><i data-lucide="shopping-cart"></i> Add to Cart</button>` :
                            `<div class="pd-qty-controls">
                                <button class="pd-qty-btn subtract-detail">−</button>
                                <span class="pd-qty-display">${item.quantity}</span>
                                <button class="pd-qty-btn add-detail">+</button>
                            </div>`
                        }
                        <button class="pd-buy-now-btn" data-name="${item.name}" title="Buy instantly with 1-click checkout">
                            <i data-lucide="zap"></i> Buy Now
                        </button>
                    </div>
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

                <!-- Amazon 'Frequently Bought Together' Bundle -->
                <div class="pd-fbt-card" id="pdFbtCard">
                    <div class="fbt-header">
                        <span class="fbt-tag"><i data-lucide="package-plus"></i> FREQUENTLY BOUGHT TOGETHER</span>
                        <h3>Frequently bought together</h3>
                    </div>
                    <div class="fbt-body">
                        <div class="fbt-items-row">
                            <div class="fbt-item" data-name="${item.name}">
                                <div class="fbt-img-wrap">
                                    <img src="${item.src}" alt="${item.name}" onerror="this.src='/javascript.svg';">
                                    <span class="fbt-this-badge">This item</span>
                                </div>
                                <div class="fbt-item-details">
                                    <span class="fbt-item-name">${item.name}</span>
                                    <span class="fbt-item-price">₹${item.discount_price}</span>
                                </div>
                            </div>

                            <div class="fbt-plus-symbol"><i data-lucide="plus"></i></div>

                            <div class="fbt-item" data-name="${comp1.name}">
                                <div class="fbt-img-wrap">
                                    <img src="${comp1.src}" alt="${comp1.name}" onerror="this.src='/javascript.svg';">
                                </div>
                                <div class="fbt-item-details">
                                    <span class="fbt-item-name">${comp1.name}</span>
                                    <span class="fbt-item-price">₹${comp1.discount_price}</span>
                                </div>
                            </div>

                            <div class="fbt-plus-symbol"><i data-lucide="plus"></i></div>

                            <div class="fbt-item" data-name="${comp2.name}">
                                <div class="fbt-img-wrap">
                                    <img src="${comp2.src}" alt="${comp2.name}" onerror="this.src='/javascript.svg';">
                                </div>
                                <div class="fbt-item-details">
                                    <span class="fbt-item-name">${comp2.name}</span>
                                    <span class="fbt-item-price">₹${comp2.discount_price}</span>
                                </div>
                            </div>
                        </div>

                        <div class="fbt-bundle-summary">
                            <div class="fbt-price-calculation">
                                <div class="fbt-price-label">Total Bundle Price:</div>
                                <div class="fbt-price-numbers">
                                    <span class="fbt-final-price">₹${bundleFinalPrice}</span>
                                    <span class="fbt-strike-price">₹${bundleRawPrice}</span>
                                    <span class="fbt-savings-pill">Save ₹30 Extra!</span>
                                </div>
                                <div class="fbt-items-desc">Includes: <strong>${item.name}</strong> + <strong>${comp1.name}</strong> + <strong>${comp2.name}</strong></div>
                            </div>
                            <button type="button" class="fbt-add-all-btn" id="fbtAddAllBtn" data-items="${item.name},${comp1.name},${comp2.name}">
                                <i data-lucide="shopping-cart"></i> 🛒 Add All 3 to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Amazon Customer Q&A / FAQs Accordion -->
                <div class="pd-qa-section" id="pdQaSection">
                    <div class="qa-header">
                        <div class="qa-badge-title">
                            <span class="qa-tag"><i data-lucide="help-circle"></i> CUSTOMER Q&A</span>
                            <h3>Customer Questions & Answers</h3>
                        </div>
                    </div>

                    <div class="qa-search-bar">
                        <i data-lucide="search" class="qa-search-icon"></i>
                        <input type="text" id="pdQaSearchInput" placeholder="Have a question? Search answers (e.g. fresh, return, packaging)...">
                    </div>

                    <div class="qa-accordion-list" id="pdQaAccordionList">
                        <div class="qa-item active" data-keywords="organic fresh farm harvest 24 hours produce nutrient cold chain">
                            <button class="qa-question-btn" type="button" aria-expanded="true">
                                <span class="qa-q-icon">Q:</span>
                                <span class="qa-q-text">Is this product organic & fresh?</span>
                                <i data-lucide="chevron-down" class="qa-chevron"></i>
                            </button>
                            <div class="qa-answer-box" style="display: block;">
                                <div class="qa-answer-content">
                                    <span class="qa-a-icon">A:</span>
                                    <div class="qa-a-text">
                                        Yes, direct farm harvest within 24 hours. Certified cold-chain network ensures crisp freshness and uncompromised nutrients from soil to kitchen.
                                        <div class="qa-verified-tag"><i data-lucide="check-circle-2"></i> Verified Agronomist Check • 100% Quality Assured</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="qa-item" data-keywords="return policy refund guarantee doorstep replacement instant money back 24 hours">
                            <button class="qa-question-btn" type="button" aria-expanded="false">
                                <span class="qa-q-icon">Q:</span>
                                <span class="qa-q-text">What is the return policy?</span>
                                <i data-lucide="chevron-down" class="qa-chevron"></i>
                            </button>
                            <div class="qa-answer-box" style="display: none;">
                                <div class="qa-answer-content">
                                    <span class="qa-a-icon">A:</span>
                                    <div class="qa-a-text">
                                        Instant doorstep return/refund within 24 hours if quality is compromised. No questions asked guarantee with 1-click refund back to your payment method.
                                        <div class="qa-verified-tag"><i data-lucide="shield-check"></i> Zero-Hassle Return • Instant UPI / Wallet Credit</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="qa-item" data-keywords="packaging packaged food grade biodegradable hygienic sealed safe eco friendly">
                            <button class="qa-question-btn" type="button" aria-expanded="false">
                                <span class="qa-q-icon">Q:</span>
                                <span class="qa-q-text">How is it packaged?</span>
                                <i data-lucide="chevron-down" class="qa-chevron"></i>
                            </button>
                            <div class="qa-answer-box" style="display: none;">
                                <div class="qa-answer-content">
                                    <span class="qa-a-icon">A:</span>
                                    <div class="qa-a-text">
                                        100% biodegradable food-grade packaging. UV-sanitized and sealed in temperature-controlled dark stores for maximum safety and hygiene.
                                        <div class="qa-verified-tag"><i data-lucide="leaf"></i> Eco-Friendly • Tamper-Evident Food-Grade Seal</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="qa-item" data-keywords="delivery timeframe speed 10 15 minutes quick fast dispatch dark store express">
                            <button class="qa-question-btn" type="button" aria-expanded="false">
                                <span class="qa-q-icon">Q:</span>
                                <span class="qa-q-text">How quickly will my order arrive?</span>
                                <i data-lucide="chevron-down" class="qa-chevron"></i>
                            </button>
                            <div class="qa-answer-box" style="display: none;">
                                <div class="qa-answer-content">
                                    <span class="qa-a-icon">A:</span>
                                    <div class="qa-a-text">
                                        Express delivery arrives in 10-15 minutes! Dispatched instantly by our dedicated riders from the nearest MegaMart dark store hub.
                                        <div class="qa-verified-tag"><i data-lucide="zap"></i> Real-time GPS Tracking Available</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="qa-empty-state" id="qaEmptyState" style="display: none;">
                        <i data-lucide="help-circle"></i>
                        <p>No answers matching your search. MegaMart 24/7 Support is here to help.</p>
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

        // 1. Pincode & Delivery Estimator interaction in Product Detail
        const pdPinInput = document.getElementById('pdPincodeInput');
        const pdPinCheckBtn = document.getElementById('pdPincodeCheckBtn');
        const runPdPinCheck = () => {
            const val = pdPinInput?.value || '';
            const res = this.lookupPincode(val);
            if (!res.valid) {
                this.showToast(res.error);
                return;
            }
            localStorage.setItem('megamart_pincode', res.pincode);
            localStorage.setItem('megamart_city', res.city);
            this.updateHeaderLocationDisplay(res.city, res.pincode);
            this.updateProductDetailEstimator(res.city, res.pincode, res.message);
            this.showToast(`📍 Delivery confirmed for ${res.city} (${res.pincode})`);
        };
        pdPinCheckBtn?.addEventListener('click', runPdPinCheck);
        pdPinInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                runPdPinCheck();
            }
        });

        // 2. Amazon 'Frequently Bought Together' 1-Click Bundle Add
        const fbtAddBtn = document.getElementById('fbtAddAllBtn');
        if (fbtAddBtn) {
            fbtAddBtn.addEventListener('click', () => {
                const names = fbtAddBtn.dataset.items.split(',');
                names.forEach(n => {
                    const prod = this.data.find(p => p.name === n);
                    if (prod) {
                        prod.quantity = (prod.quantity || 0) + 1;
                        this.updateAllCardDOMs(prod);
                    }
                });
                this.saveCartToStorage();
                this.updateCartUI();
                const actionsDiv = detailContainer.querySelector(`.pd-actions[data-name="${item.name}"]`);
                if (actionsDiv) this.updateProductDetailDOM(item, actionsDiv);
                
                fbtAddBtn.innerHTML = `<i data-lucide="check"></i> Added All 3 Items!`;
                fbtAddBtn.classList.add('added');
                setTimeout(() => {
                    if (fbtAddBtn) {
                        fbtAddBtn.innerHTML = `<i data-lucide="shopping-cart"></i> 🛒 Add All 3 to Cart`;
                        fbtAddBtn.classList.remove('added');
                        if (window.lucide) lucide.createIcons();
                    }
                }, 2200);
                if (window.lucide) lucide.createIcons();
                this.showToast(`🎉 Bundle added! Saved ₹30 extra on 3 items.`);
            });
        }

        // 3. Amazon Customer Q&A Accordion & Real-time Search
        const qaAccordionList = document.getElementById('pdQaAccordionList');
        if (qaAccordionList) {
            qaAccordionList.querySelectorAll('.qa-question-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const itemElem = btn.closest('.qa-item');
                    const answerBox = itemElem.querySelector('.qa-answer-box');
                    const isExpanded = itemElem.classList.contains('active');
                    if (isExpanded) {
                        itemElem.classList.remove('active');
                        answerBox.style.display = 'none';
                        btn.setAttribute('aria-expanded', 'false');
                    } else {
                        itemElem.classList.add('active');
                        answerBox.style.display = 'block';
                        btn.setAttribute('aria-expanded', 'true');
                    }
                });
            });
        }

        const qaSearchInput = document.getElementById('pdQaSearchInput');
        if (qaSearchInput && qaAccordionList) {
            qaSearchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                let matches = 0;
                qaAccordionList.querySelectorAll('.qa-item').forEach(itemElem => {
                    const text = (itemElem.textContent || '').toLowerCase();
                    const keywords = (itemElem.dataset.keywords || '').toLowerCase();
                    const isMatch = !query || text.includes(query) || keywords.includes(query);
                    itemElem.style.display = isMatch ? 'block' : 'none';
                    if (isMatch) {
                        matches++;
                        if (query.length >= 2) {
                            itemElem.classList.add('active');
                            itemElem.querySelector('.qa-answer-box').style.display = 'block';
                            itemElem.querySelector('.qa-question-btn').setAttribute('aria-expanded', 'true');
                        }
                    }
                });
                const emptyState = document.getElementById('qaEmptyState');
                if (emptyState) emptyState.style.display = matches === 0 ? 'block' : 'none';
            });
        }

        // Multi-Weight / Pack Size Variant Interaction
        const variantPills = detailContainer.querySelectorAll('.variant-pill');
        variantPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.stopPropagation();
                variantPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const newUnit = pill.dataset.unit;
                const newPrice = Number(pill.dataset.price);
                const newDiscount = Number(pill.dataset.discount);

                item.unit = newUnit;
                item.price = newPrice;
                item.discount_price = newDiscount;

                // Update detail UI elements
                const selUnitEl = document.getElementById('pdSelectedVariantUnit');
                if (selUnitEl) selUnitEl.textContent = newUnit;

                const netQtyEl = detailContainer.querySelector('.pd-net-qty');
                if (netQtyEl) netQtyEl.innerHTML = `Net Qty: <strong>${newUnit}</strong>`;

                const priceEl = detailContainer.querySelector('.pd-price');
                if (priceEl) priceEl.textContent = `₹${newDiscount}`;

                const mrpEl = detailContainer.querySelector('.pd-mrp');
                if (mrpEl) mrpEl.textContent = `₹${newPrice}`;

                const discEl = detailContainer.querySelector('.pd-discount');
                const newDiscPct = Math.round(((newPrice - newDiscount) / newPrice) * 100);
                if (discEl) discEl.textContent = `${newDiscPct}% OFF`;

                // Update MegaCoins display in detail
                const coinTitleStrong = detailContainer.querySelector('.pd-coin-title strong');
                if (coinTitleStrong) coinTitleStrong.textContent = `Earn ${getProductCoins(item)} MegaCoins`;

                // Update all visible product cards across the page
                this.updateAllCardDOMs(item);

                // If in cart, refresh cart totals
                if (item.quantity > 0) {
                    this.updateCartUI();
                }

                this.showToast(`Selected ${item.name} (${newUnit}) • ₹${newDiscount}`);
            });
        });

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
        const coins = getProductCoins(element);
        
        itemDiv.innerHTML = `
            <div class="product-image-container clickable-area">
                <button class="wishlist-card-btn ${isWishlisted ? 'active' : ''}" data-name="${element.name}" aria-label="Toggle Wishlist" title="Wishlist">
                    <i data-lucide="heart"></i>
                </button>
                <img class="itemImage" src="${element.src}" alt="${element.name}" loading="lazy" onerror="this.src='/javascript.svg';">
                ${discountPercent > 0 ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                ${element.isFlashDeal ? `<div class="flash-flame-badge">🔥 ${element.flashDiscount || '40% OFF'}</div>` : ''}
                <div class="delivery-badge"><i data-lucide="zap" style="width:10px;height:10px;color:var(--primary)"></i> 10 MINS</div>
            </div>
            <div class="product-content clickable-area">
                <div class="product-rating-badge">
                    <span class="star-icon">★</span>
                    <span>${rating.score}</span>
                    <span class="rating-count">(${rating.reviewCount})</span>
                </div>
                <h3 class="product-title">${element.name}</h3>
                
                <!-- Flipkart 'MegaAssured' Trust Badge -->
                <div class="mega-assured-badge" title="MegaAssured: 100% Quality Checked & Quick Delivery">
                    <span class="assured-check">✓</span>
                    <span class="assured-text"><span class="assured-mega">Mega</span>Assured</span>
                </div>

                <p class="product-unit">${element.unit}</p>

                <!-- Flipkart-style MegaCoins Reward Pill -->
                <div class="megacoins-card-reward">
                    <span class="coin-icon">🪙</span>
                    <span>Earn ${coins} MegaCoins</span>
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

            // Amazon 'Buy Now' 1-Click Instant Checkout Button
            const buyNowBtn = e.target.closest('.pd-buy-now-btn');
            if (buyNowBtn) {
                e.stopPropagation();
                e.preventDefault();
                const name = buyNowBtn.dataset.name;
                const item = this.data.find(i => i.name === name);
                if (item) {
                    if (!item.quantity || item.quantity < 1) {
                        item.quantity = 1;
                    }
                    this.saveCartToStorage();
                    this.updateAllCardDOMs(item);
                    this.updateCartUI();
                    const actionsDiv = buyNowBtn.closest('.pd-actions');
                    if (actionsDiv) this.updateProductDetailDOM(item, actionsDiv);
                    
                    // Bypass cart sidebar and open checkout modal immediately!
                    this.closeCartSidebar();
                    this.openCheckoutModal();
                    this.showToast(`⚡ 1-Click Checkout: ${item.name}`);
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
            actionsDiv.innerHTML = `
                <div class="pd-btn-group">
                    <button class="pd-add-btn add-btn-detail"><i data-lucide="shopping-cart"></i> Add to Cart</button>
                    <button class="pd-buy-now-btn" data-name="${item.name}" title="Buy instantly with 1-click checkout">
                        <i data-lucide="zap"></i> Buy Now
                    </button>
                </div>
            `;
        } else {
            actionsDiv.innerHTML = `
                <div class="pd-btn-group">
                    <div class="pd-qty-controls">
                        <button class="pd-qty-btn subtract-detail">−</button>
                        <span class="pd-qty-display">${item.quantity}</span>
                        <button class="pd-qty-btn add-detail">+</button>
                    </div>
                    <button class="pd-buy-now-btn" data-name="${item.name}" title="Buy instantly with 1-click checkout">
                        <i data-lucide="zap"></i> Buy Now
                    </button>
                </div>
            `;
        }
        if (window.lucide) lucide.createIcons();
    }

    updateAllCardDOMs(item) {
        document.querySelectorAll(`.itemName[data-name="${item.name}"]`).forEach(cardElement => {
            const btnContainer = cardElement.querySelector('.btn-container');
            if (btnContainer) {
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
            }

            // Sync unit and prices when variant changes
            const unitEl = cardElement.querySelector('.product-unit');
            if (unitEl && item.unit) unitEl.textContent = item.unit;

            const currPriceEl = cardElement.querySelector('.current-price');
            if (currPriceEl && item.discount_price) currPriceEl.textContent = `₹${item.discount_price}`;

            const origPriceEl = cardElement.querySelector('.original-price');
            if (origPriceEl) {
                if (item.price > item.discount_price) {
                    origPriceEl.textContent = `₹${item.price}`;
                    origPriceEl.style.display = 'inline';
                } else {
                    origPriceEl.style.display = 'none';
                }
            }

            const coinRewardEl = cardElement.querySelector('.megacoins-card-reward span:last-child');
            if (coinRewardEl) {
                coinRewardEl.textContent = `Earn ${getProductCoins(item)} MegaCoins`;
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
            const mrpTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const deliveryFee = subtotal > 499 ? 0 : 25;
            const deliverySavings = subtotal > 499 ? 25 : 0;
            const mrpSavings = Math.max(0, mrpTotal - subtotal);
            const totalSavings = mrpSavings + deliverySavings;
            const total = subtotal + deliveryFee;
            
            cartFooter.innerHTML = `
                ${totalSavings > 0 ? `
                <div class="myntra-savings-card">
                    <div class="myntra-savings-icon">🎉</div>
                    <div class="myntra-savings-text">
                        <span class="savings-headline">Total Savings</span>
                        <span class="savings-amount">You are saving ₹${totalSavings.toFixed(0)} on this order!</span>
                    </div>
                </div>` : ''}
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

        // MegaCoins Redemption Checkbox handler
        const redeemCheckbox = document.getElementById('redeemCoinsCheckbox');
        const coinsStatus = document.getElementById('coinsStatusMessage');
        redeemCheckbox?.addEventListener('change', () => {
            if (redeemCheckbox.checked) {
                const usableCoins = Math.min(this.megaCoins || 0, 50);
                if (usableCoins <= 0) {
                    redeemCheckbox.checked = false;
                    this.redeemMegaCoins = false;
                    this.redeemedCoinsValue = 0;
                    if (coinsStatus) {
                        coinsStatus.className = 'coins-status-text';
                        coinsStatus.textContent = 'You have 0 MegaCoins available to redeem.';
                    }
                } else {
                    this.redeemMegaCoins = true;
                    this.redeemedCoinsValue = usableCoins;
                    if (coinsStatus) {
                        coinsStatus.className = 'coins-status-text applied';
                        coinsStatus.textContent = `🪙 ${usableCoins} MegaCoins applied: Saved ₹${usableCoins}!`;
                    }
                }
            } else {
                this.redeemMegaCoins = false;
                this.redeemedCoinsValue = 0;
                if (coinsStatus) {
                    coinsStatus.className = 'coins-status-text';
                    coinsStatus.textContent = '';
                }
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

        // Pre-fill active Pincode & City in checkout form
        const savedPin = localStorage.getItem('megamart_pincode') || '400001';
        const savedCity = localStorage.getItem('megamart_city') || 'Mumbai';
        const pinInput = document.getElementById('custPin');
        const cityInput = document.getElementById('custCity');
        if (pinInput && !pinInput.value) pinInput.value = savedPin;
        if (cityInput && !cityInput.value) cityInput.value = savedCity;

        this.updateMegaCoinsUI();
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
        const mrpTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const subtotal = cartItems.reduce((sum, item) => sum + (item.discount_price * item.quantity), 0);
        const deliveryFee = subtotal > 499 ? 0 : 25;
        const deliverySavings = subtotal > 499 ? 25 : 0;
        const couponDiscount = Math.min(this.appliedDiscount || 0, subtotal);
        const coinsDiscount = this.redeemMegaCoins ? Math.min(this.redeemedCoinsValue || 0, Math.max(0, subtotal - couponDiscount)) : 0;
        const grandTotal = Math.max(0, subtotal - couponDiscount - coinsDiscount + deliveryFee);
        
        const mrpSavings = Math.max(0, mrpTotal - subtotal);
        const totalSavings = mrpSavings + couponDiscount + coinsDiscount + deliverySavings;

        summaryBox.innerHTML = `
            ${totalSavings > 0 ? `
            <!-- Myntra-style Total Savings Celebratory Card in Checkout -->
            <div class="myntra-savings-card checkout-style">
                <div class="myntra-savings-icon">🎉</div>
                <div class="myntra-savings-text">
                    <span class="savings-headline">Total Savings</span>
                    <span class="savings-amount">You are saving ₹${totalSavings.toFixed(0)} on this order!</span>
                </div>
            </div>` : ''}
            <div class="bill-row" style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.9rem;">
                <span style="color:var(--text-muted);">Items Subtotal (${cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span style="font-weight:600;">₹${subtotal.toFixed(2)}</span>
            </div>
            ${couponDiscount > 0 ? `
            <div class="bill-row" style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.9rem;color:var(--success);">
                <span>Coupon Discount (${this.activeCouponCode})</span>
                <span style="font-weight:600;">-₹${couponDiscount.toFixed(2)}</span>
            </div>` : ''}
            ${coinsDiscount > 0 ? `
            <div class="bill-row" style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.9rem;color:#b45309;font-weight:600;">
                <span>🪙 MegaCoins Redeemed</span>
                <span>-₹${coinsDiscount.toFixed(2)}</span>
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
        const couponDiscount = this.appliedDiscount || 0;
        const coinsDiscount = this.redeemMegaCoins ? (this.redeemedCoinsValue || 0) : 0;
        const grandTotal = Math.max(0, subtotal - couponDiscount - coinsDiscount + (subtotal > 499 ? 0 : 25));
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'UPI';

        // Calculate earned coins & deduct redeemed coins
        const earnedCoins = cartItems.reduce((sum, item) => sum + (getProductCoins(item) * item.quantity), 0);
        this.megaCoins = Math.max(0, this.megaCoins - coinsDiscount) + earnedCoins;
        this.saveMegaCoinsToStorage();
        this.updateMegaCoinsUI();

        const orderId = '#MM-' + Math.floor(100000 + Math.random() * 900000);

        // Save order to history
        const orderRecord = {
            orderId,
            date: new Date().toISOString(),
            customer: { name, phone, address, pin },
            items: cartItems.map(i => ({ name: i.name, qty: i.quantity, price: i.discount_price })),
            total: grandTotal,
            paymentMethod,
            coinsEarned: earnedCoins,
            coinsRedeemed: coinsDiscount
        };

        const existingOrders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
        existingOrders.unshift(orderRecord);
        localStorage.setItem('megamart_orders', JSON.stringify(existingOrders));

        // Clear cart & reset redemption
        this.data.forEach(item => { item.quantity = 0; });
        this.redeemMegaCoins = false;
        this.redeemedCoinsValue = 0;
        const redeemCb = document.getElementById('redeemCoinsCheckbox');
        if (redeemCb) redeemCb.checked = false;
        const coinsStatusMsg = document.getElementById('coinsStatusMessage');
        if (coinsStatusMsg) coinsStatusMsg.textContent = '';

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
                <p style="color:#b45309;margin-top:6px;font-weight:700;">🪙 +${earnedCoins} MegaCoins Earned! (New Balance: ${this.megaCoins} Coins)</p>
            `;
            if (window.lucide) lucide.createIcons();
        }

        this.showToast(`🎉 Order placed! Earned ${earnedCoins} MegaCoins!`);
    }

    // ================= AMAZON E-COMMERCE CONVERSION ENGINE =================

    getFrequentlyBoughtTogether(currentItem) {
        const pairs = {
            'Banana': ['Milk', 'Sugar'],
            'Apple': ['Banana', 'Orange'],
            'Mango': ['Milk', 'Sugar'],
            'Orange': ['Apple', 'Banana'],
            'Papaya': ['Apple', 'Banana'],
            'Tea': ['Sugar', 'Milk'],
            'Sugar': ['Tea', 'Milk'],
            'Milk': ['Tea', 'Sugar'],
            'Onion': ['Potato', 'Tomato'],
            'Potato': ['Onion', 'Tomato'],
            'Tomato': ['Onion', 'Chilli'],
            'Cauliflower': ['Potato', 'Tomato'],
            'Bottle Guard': ['Tomato', 'Onion'],
            'Spinach': ['Coriander', 'Mint'],
            'Coriander': ['Chilli', 'Curry leaves'],
            'Curry leaves': ['Chilli', 'Masala'],
            'Mint': ['Chilli', 'Coriander'],
            'Chilli': ['Coriander', 'Curry leaves'],
            'Capsicum': ['Broccoli', 'Mushroom'],
            'Broccoli': ['Capsicum', 'BabyCorn'],
            'BabyCorn': ['Broccoli', 'Mushroom'],
            'Iceberg': ['Capsicum', 'Tomato'],
            'Mushroom': ['Capsicum', 'Broccoli'],
            'Masala': ['Salt', 'Curry leaves'],
            'Salt': ['Sugar', 'Masala'],
            'Cleaners': ['Sanitizers', 'Soap'],
            'Soap': ['Sanitizers', 'Cleaners'],
            'Sanitizers': ['Soap', 'Cleaners'],
            'Allout': ['Cleaners', 'Room Freshners'],
            'Room Freshners': ['Cleaners', 'Soap'],
            'Rose': ['Marigold', 'Whitelower'],
            'Marigold': ['Rose', 'Whitelower'],
            'Whitelower': ['Rose', 'Marigold']
        };

        let comp1, comp2;
        const mapped = pairs[currentItem.name];
        if (mapped) {
            comp1 = this.data.find(i => i.name === mapped[0]);
            comp2 = this.data.find(i => i.name === mapped[1]);
        }

        if (!comp1 || !comp2) {
            const pool = this.data.filter(i => i.name !== currentItem.name);
            comp1 = comp1 || pool[0];
            comp2 = comp2 || pool[1];
        }

        return [comp1, comp2];
    }

    lookupPincode(pincode) {
        const pin = String(pincode || '').trim();
        if (!/^\d{6}$/.test(pin)) {
            return { valid: false, error: 'Please enter a valid 6-digit Indian Pincode.' };
        }

        const directory = {
            '400001': { city: 'Mumbai', area: 'Fort / South Mumbai', speed: '⚡ Express Delivery in 10-15 mins!', freeAbove: 499 },
            '400050': { city: 'Mumbai', area: 'Bandra West', speed: '⚡ Express Delivery in 10-15 mins!', freeAbove: 499 },
            '110001': { city: 'Delhi', area: 'Connaught Place', speed: '⚡ Express Delivery in 10-15 mins!', freeAbove: 499 },
            '110016': { city: 'Delhi', area: 'Hauz Khas', speed: '⚡ Express Delivery in 10-15 mins!', freeAbove: 499 },
            '560001': { city: 'Bangalore', area: 'MG Road / Central', speed: '⚡ Express Delivery in 10-15 mins!', freeAbove: 499 },
            '560034': { city: 'Bangalore', area: 'Koramangala', speed: '⚡ Express Delivery in 10-15 mins!', freeAbove: 499 },
            '500001': { city: 'Hyderabad', area: 'Abids / Koti', speed: '⚡ Express Delivery in 10-15 mins!', freeAbove: 499 },
            '500081': { city: 'Hyderabad', area: 'Hitec City', speed: '⚡ Express Delivery in 10-15 mins!', freeAbove: 499 },
            '600001': { city: 'Chennai', area: 'George Town', speed: '⚡ Express Delivery in 10-15 mins!', freeAbove: 499 },
            '700001': { city: 'Kolkata', area: 'BBD Bagh', speed: '⚡ Express Delivery in 12-18 mins!', freeAbove: 499 },
            '411001': { city: 'Pune', area: 'Shivajinagar / Camp', speed: '⚡ Express Delivery in 10-15 mins!', freeAbove: 499 }
        };

        const found = directory[pin] || {
            city: 'Express Delivery Hub',
            area: 'Metro Sector',
            speed: '⚡ Express Delivery in 10-15 mins!',
            freeAbove: 499
        };

        return {
            valid: true,
            pincode: pin,
            city: found.city,
            area: found.area,
            speed: found.speed,
            message: `${found.speed} FREE on orders above ₹${found.freeAbove}`
        };
    }

    setupPincodeLocation() {
        const locBtn = document.getElementById('headerDeliveryLocation');
        const modal = document.getElementById('pincodeModal');
        const overlay = document.getElementById('pincodeModalOverlay');
        const closeBtn = document.getElementById('closePincodeModal');
        const applyBtn = document.getElementById('headerPincodeApplyBtn');
        const pinInput = document.getElementById('headerPincodeInput');
        const statusBox = document.getElementById('headerPincodeStatus');
        const cityChips = document.querySelectorAll('.city-chip');

        const savedPin = localStorage.getItem('megamart_pincode') || '400001';
        const savedCity = localStorage.getItem('megamart_city') || 'Mumbai';
        this.updateHeaderLocationDisplay(savedCity, savedPin);

        const openModal = () => {
            if (!modal || !overlay) return;
            const currentPin = localStorage.getItem('megamart_pincode') || '400001';
            if (pinInput) pinInput.value = currentPin;
            if (statusBox) statusBox.style.display = 'none';
            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => pinInput?.focus(), 100);
            if (window.lucide) lucide.createIcons();
        };

        const closeModal = () => {
            modal?.classList.remove('active');
            overlay?.classList.remove('active');
            document.body.style.overflow = '';
        };

        locBtn?.addEventListener('click', openModal);
        locBtn?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
            }
        });
        closeBtn?.addEventListener('click', closeModal);
        overlay?.addEventListener('click', closeModal);

        const applyPincode = (pincode, forcedCity = null) => {
            const result = this.lookupPincode(pincode);
            if (!result.valid) {
                if (statusBox) {
                    statusBox.className = 'pincode-status-box error';
                    statusBox.innerHTML = `<i data-lucide="alert-circle"></i> <span>${result.error}</span>`;
                    statusBox.style.display = 'flex';
                    if (window.lucide) lucide.createIcons();
                }
                return false;
            }

            const city = forcedCity || result.city;
            localStorage.setItem('megamart_pincode', result.pincode);
            localStorage.setItem('megamart_city', city);
            this.updateHeaderLocationDisplay(city, result.pincode);

            // Pre-fill checkout form inputs if present
            const custPin = document.getElementById('custPin');
            const custCity = document.getElementById('custCity');
            if (custPin) custPin.value = result.pincode;
            if (custCity) custCity.value = city;

            // Also update any active product detail estimator
            this.updateProductDetailEstimator(city, result.pincode, result.message);

            if (statusBox) {
                statusBox.className = 'pincode-status-box success';
                statusBox.innerHTML = `<i data-lucide="check-circle-2"></i> <div><strong>${city} (${result.pincode})</strong><br><span>${result.message}</span></div>`;
                statusBox.style.display = 'flex';
                if (window.lucide) lucide.createIcons();
            }

            this.showToast(`📍 Delivering to ${city} (${result.pincode})`);

            setTimeout(() => {
                closeModal();
            }, 900);
            return true;
        };

        applyBtn?.addEventListener('click', () => {
            const pin = pinInput?.value || '';
            applyPincode(pin);
        });

        pinInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyPincode(pinInput.value);
            }
        });

        cityChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const city = chip.dataset.city;
                const pin = chip.dataset.pin;
                if (pinInput) pinInput.value = pin;
                cityChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                applyPincode(pin, city);
            });
        });
    }

    updateHeaderLocationDisplay(city, pin) {
        const addressSpan = document.getElementById('headerDeliveryAddress');
        if (addressSpan) {
            addressSpan.innerHTML = `${city}, ${pin} <i data-lucide="chevron-down"></i>`;
            if (window.lucide) lucide.createIcons();
        }
    }

    updateProductDetailEstimator(city, pin, speedMsg) {
        const target = document.getElementById('pdCurrentPincodeDisplay');
        const input = document.getElementById('pdPincodeInput');
        const resultBox = document.getElementById('pdEstimatorResult');
        if (target) target.textContent = `${city}, ${pin}`;
        if (input) input.value = pin;
        if (resultBox) {
            resultBox.innerHTML = `
                <div class="estimator-speed-row">
                    <i data-lucide="zap" class="zap-icon"></i>
                    <span>${speedMsg || '⚡ Express Delivery in 10-15 mins! FREE on orders above ₹499'}</span>
                </div>
                <div class="estimator-meta-row">
                    <span>✓ In stock at Dark Store #${Math.abs(pin.charCodeAt(0) % 20) + 1}</span>
                    <span>✓ Cash & UPI on Delivery available</span>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
        }
    }

    // ================= FLIPKART & MYNTRA EXTENSION HELPERS =================

    loadMegaCoinsFromStorage() {
        try {
            const saved = localStorage.getItem('megamart_coins');
            return saved !== null ? parseInt(saved, 10) : 150;
        } catch (e) {
            return 150;
        }
    }

    saveMegaCoinsToStorage() {
        try {
            localStorage.setItem('megamart_coins', this.megaCoins.toString());
        } catch (e) {
            console.error('Error saving coins:', e);
        }
    }

    updateMegaCoinsUI() {
        const headerEl = document.getElementById('headerCoinBalance');
        if (headerEl) headerEl.textContent = this.megaCoins;
        const profileEl = document.getElementById('profileCoinBalance');
        if (profileEl) profileEl.textContent = this.megaCoins;
        const profileDispEl = document.getElementById('profileCoinBalanceDisplay');
        if (profileDispEl) profileDispEl.textContent = this.megaCoins;
        const checkoutEl = document.getElementById('checkoutCoinsAvailable');
        if (checkoutEl) checkoutEl.textContent = this.megaCoins;
        const maxUsable = Math.min(this.megaCoins, 50);
        const redeemCountEl = document.getElementById('redeemCoinsCountDisplay');
        const redeemValEl = document.getElementById('redeemSavingsDisplay');
        if (redeemCountEl) redeemCountEl.textContent = maxUsable;
        if (redeemValEl) redeemValEl.textContent = '₹' + maxUsable;
    }

    setupFlashSaleTimer() {
        let remainingSeconds = 3 * 3600 + 47 * 60 + 28;
        const updateTimer = () => {
            if (remainingSeconds <= 0) remainingSeconds = 4 * 3600;
            remainingSeconds--;
            const h = Math.floor(remainingSeconds / 3600);
            const m = Math.floor((remainingSeconds % 3600) / 60);
            const s = remainingSeconds % 60;
            const hEl = document.getElementById('flashHours');
            const mEl = document.getElementById('flashMinutes');
            const sEl = document.getElementById('flashSeconds');
            if (hEl) hEl.textContent = String(h).padStart(2, '0');
            if (mEl) mEl.textContent = String(m).padStart(2, '0');
            if (sEl) sEl.textContent = String(s).padStart(2, '0');
        };
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    setupMegaCoinsNav() {
        const btn = document.getElementById('headerCoinsBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                this.showProfileView();
                window.scrollTo({ top: 300, behavior: 'smooth' });
            });
        }
    }
}
