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
        this.cartPageView = document.getElementById('cartPageView');
        
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
        this.savedForLater = this.loadSavedForLaterFromStorage();
        this.megaCoins = this.loadMegaCoinsFromStorage();
        this.redeemMegaCoins = false;
        this.redeemedCoinsValue = 0;
        this.megaCarouselIndex = 0;
        this.megaCarouselInterval = null;
        this.currentUser = this.loadUserFromStorage();
        
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
        this.setupAuth();
        this.setupOrderHistoryDrawer();
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
        this.setupSubHeaderNav();
        this.setupMegaCarousel();
        this.setupBankOfferStrip();
        this.setupUtilityStrip();
        this.setupFlipkartDealCards();
        this.setupFlipkartCuratedRails();
        this.setupCartPageView();
        
        this.setActiveView(this.homeView);
        if (window.lucide) lucide.createIcons();
    }

    // ================= MOBILE UI =================
    setupBottomNav() {
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                
                // If it's cart, wishlist or orders drawer, don't change active view tab
                if (item.id === 'mobileCartBtn' || item.id === 'bottomWishlistBtn' || item.id === 'mobileOrdersBtn') {
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
                this.showCartPageView();
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
        [this.homeView, this.categoryView, this.productDetailView, this.profileView, this.cartPageView].forEach((view) => {
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
        } else if (activeView === this.cartPageView) {
            document.getElementById('mobileCartBtn')?.classList.add('active');
        }
    }

    setupRouting() {
        document.querySelectorAll('#logoBtn, .logo').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                this.showHomeView();
            });
        });

        const cartButton = document.getElementById('cartButton');
        if (cartButton) {
            cartButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCartPageView();
            });
        }
        
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

    showCartPageView() {
        this.currentCategory = 'Cart';
        this.setActiveView(this.cartPageView);
        this.renderCartPageView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        this.updateAuthUI();
        this.updateProfileStats();
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

    // ================= HOME CATEGORY RENDERING (FLIPKART CURATED DEAL RAILS) =================
    renderHomePage() {
        const otherCategoriesContainer = document.getElementById('otherCategories');
        if (otherCategoriesContainer) otherCategoriesContainer.innerHTML = '';

        // Exact specifications for the 4 Flipkart Curated Deal Rails (matching Image 1)
        const railConfigs = {
            'Fresh Fruits': {
                title: 'Farm Fresh Picks, Crazy Deals',
                subtitle: 'Direct from farms • Fresh daily',
                ribbons: ['Min. 40% Off', 'Under ₹49', 'Under ₹99', 'Min. 35% Off'],
                ribbonClass: 'ribbon-red',
                nameOverrides: {
                    'Banana': 'Banana Robusta',
                    'Apple': 'Shimla Apple',
                    'Mango': 'Alphonso Mango',
                    'Orange': 'Nagpur Orange',
                    'Papaya': 'Honey Papaya'
                }
            },
            'Kitchen': {
                title: 'Pantry & Kitchen Essentials',
                subtitle: 'Top brands • Crazy bundle discounts',
                ribbons: ['Up to 50% Off', 'From ₹25', 'Under ₹99', 'Min. 30% Off'],
                ribbonClass: 'ribbon-amber',
                nameOverrides: {
                    'Milk': 'Amul Gold Milk',
                    'Tea': 'Tata Tea Premium',
                    'Sugar': 'Organic Sugar',
                    'Masala': 'Everest Masala',
                    'Salt': 'Tata Salt Vacuum Evaporated'
                }
            },
            'House Hold': {
                title: 'Home Sparkle, Pocket Friendly',
                subtitle: 'Sparkling clean home • Everyday low prices',
                ribbons: ['Under ₹89', 'Min. 45% Off', 'Buy 1 Get 1'],
                ribbonClass: 'ribbon-green',
                nameOverrides: {
                    'Cleaners': 'Lizol Disinfectant Cleaner',
                    'Allout': 'All Out Mosquito Repellent',
                    'Room Freshners': 'Godrej aer Pocket Room Freshner',
                    'Soap': 'Dettol Original Soap (4-Pack)',
                    'Sanitizers': 'Lifebuoy Hand Sanitizer'
                }
            },
            'Fresh Vegetables': {
                title: 'Farm Fresh Vegetables',
                subtitle: 'Crisp handpicked veggies starting from just ₹22',
                ribbons: ['Under ₹29', 'From ₹22', 'Min. 35% Off'],
                ribbonClass: 'ribbon-red',
                nameOverrides: {
                    'Onion': 'Fresh Nashik Onion',
                    'Potato': 'Pahari Jyoti Potato',
                    'Cauliflower': 'Crisp Snowball Cauliflower',
                    'Bottle Guard': 'Tender Bottle Gourd',
                    'Tomato': 'Hybrid Red Tomato'
                }
            }
        };

        // Render each of the 4 Flipkart Curated Deal Rails
        Object.keys(railConfigs).forEach((category) => {
            const config = railConfigs[category];
            const sectionEl = document.getElementById(`sec-${category}`);
            const contentEl = document.getElementById(`content-${category}`);
            const items = this.controller.filterItems(category);

            if (sectionEl && contentEl && items.length > 0) {
                sectionEl.style.display = 'block';
                contentEl.innerHTML = '';

                items.forEach((item, index) => {
                    const displayTitle = (config.nameOverrides && config.nameOverrides[item.name])
                        ? config.nameOverrides[item.name]
                        : item.name;
                    const ribbonText = config.ribbons[index % config.ribbons.length];
                    const isWarm = (category === 'Kitchen');

                    const card = document.createElement('div');
                    card.className = 'curated-deal-card';
                    card.dataset.name = item.name;
                    card.setAttribute('role', 'button');
                    card.setAttribute('tabindex', '0');
                    card.setAttribute('aria-label', `${displayTitle} - ${ribbonText}`);

                    card.innerHTML = `
                        <div class="curated-card-media ${isWarm ? 'media-warm' : ''}">
                            <img src="${item.src}" alt="${displayTitle}" class="curated-card-img" loading="lazy" onerror="this.src='/javascript.svg';">
                            <div class="curated-card-ribbon ${config.ribbonClass}">${ribbonText}</div>
                        </div>
                        <div class="curated-card-info">
                            <div class="curated-card-title" title="${displayTitle}">${displayTitle}</div>
                            <div class="curated-card-price">
                                <span class="curated-price-highlight">₹${item.discount_price}</span>
                                <span class="curated-original-price">₹${item.price}</span>
                            </div>
                        </div>
                    `;

                    // Click navigates to Product Detail View
                    card.addEventListener('click', () => {
                        this.showProductDetailView(item);
                    });

                    // Keyboard accessibility
                    card.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            this.showProductDetailView(item);
                        }
                    });

                    contentEl.appendChild(card);
                });
            }
        });

        // Other Categories: Standard Grid
        this.elementList.forEach(category => {
            if (railConfigs[category]) return; // handled by curated rails
            const items = this.controller.filterItems(category).slice(0, 8);
            if (items.length === 0) return;

            if (otherCategoriesContainer) {
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

        // Wire up Left & Right navigation arrows on each deal rail
        document.querySelectorAll('.flipkart-curated-rail').forEach(section => {
            const track = section.querySelector('.curated-rail-track');
            const prevBtn = section.querySelector('.rail-nav-btn.rail-prev');
            const nextBtn = section.querySelector('.rail-nav-btn.rail-next');

            if (track && prevBtn && nextBtn) {
                prevBtn.onclick = (e) => {
                    e.preventDefault();
                    track.scrollBy({ left: -320, behavior: 'smooth' });
                };
                nextBtn.onclick = (e) => {
                    e.preventDefault();
                    track.scrollBy({ left: 320, behavior: 'smooth' });
                };
            }
        });

        // Wire up "View All" on deal rails & category sections
        document.querySelectorAll('.flipkart-curated-rail .rail-view-all, .view-all-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const cat = e.currentTarget.dataset.category || 'All Products';
                this.showCategoryView(cat);
            };
        });

        if (window.lucide) lucide.createIcons();
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
        
        cartButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCartPageView();
        });
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
        this.showCartPageView();
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
        if (this.cartPageView?.classList.contains('active')) {
            this.renderCartPageView();
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

        // Pre-fill Customer Name & Phone if logged in
        if (this.currentUser) {
            const custName = document.getElementById('custName');
            const custPhone = document.getElementById('custPhone');
            if (custName && !custName.value) custName.value = this.currentUser.name || '';
            if (custPhone && !custPhone.value) custPhone.value = this.currentUser.phone || '';
        }

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

        this.updateProfileStats();
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

    // ================= DEDICATED FULL-PAGE CART VIEW =================
    loadSavedForLaterFromStorage() {
        try {
            const raw = localStorage.getItem('megamart_saved_for_later');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    saveSavedForLaterToStorage() {
        try {
            localStorage.setItem('megamart_saved_for_later', JSON.stringify(this.savedForLater));
        } catch (e) {}
    }

    setupCartPageView() {
        // Back to Shopping
        const backBtn = document.getElementById('cartPageBackBtn');
        backBtn?.addEventListener('click', () => {
            this.showHomeView();
        });

        // Shop Now in empty state
        const shopNowBtn = document.getElementById('cartPageShopNowBtn');
        shopNowBtn?.addEventListener('click', () => {
            this.showHomeView();
        });

        // Clear Cart Button
        const clearBtn = document.getElementById('cartPageClearBtn');
        clearBtn?.addEventListener('click', () => {
            const cartItems = this.data.filter(i => i.quantity > 0);
            if (cartItems.length === 0) return;
            if (confirm('Are you sure you want to clear all items from your cart?')) {
                this.data.forEach(item => {
                    item.quantity = 0;
                });
                this.saveCartToStorage();
                this.updateCartUI();
                this.renderCartPageView();
                this.showToast('🗑️ Cart cleared successfully');
            }
        });

        // Proceed to Checkout
        const proceedBtn = document.getElementById('cartPageProceedBtn');
        proceedBtn?.addEventListener('click', () => {
            const cartItems = this.data.filter(i => i.quantity > 0);
            if (cartItems.length === 0) {
                this.showToast('Your cart is empty! Add products before checking out.');
                return;
            }
            this.openCheckoutModal();
        });

        // MegaCoins Checkbox Toggle
        const coinsToggle = document.getElementById('cartPageRedeemCoins');
        coinsToggle?.addEventListener('change', (e) => {
            this.redeemMegaCoins = e.target.checked;
            this.renderCartPageView();
        });
    }

    renderCartPageView() {
        if (!this.cartPageView) return;
        const cartItems = this.data.filter(item => item.quantity > 0);
        const cartPageItemsList = document.getElementById('cartPageItemsList');
        const cartPageEmpty = document.getElementById('cartPageEmpty');
        const cartPageRightCol = document.getElementById('cartPageRightCol');
        const cartPageItemCount = document.getElementById('cartPageItemCount');
        const clearBtn = document.getElementById('cartPageClearBtn');
        const freeDeliveryAlert = document.getElementById('cartPageDeliveryAlert');

        const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        if (cartPageItemCount) {
            cartPageItemCount.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'Item' : 'Items'}`;
        }

        if (cartItems.length === 0) {
            if (cartPageItemsList) cartPageItemsList.style.display = 'none';
            if (cartPageEmpty) cartPageEmpty.style.display = 'flex';
            if (cartPageRightCol) cartPageRightCol.style.display = 'none';
            if (clearBtn) clearBtn.style.display = 'none';
            if (freeDeliveryAlert) freeDeliveryAlert.style.display = 'none';
        } else {
            if (cartPageItemsList) {
                cartPageItemsList.style.display = 'flex';
                cartPageItemsList.innerHTML = cartItems.map(item => {
                    const discountPercent = Math.round(((item.price - item.discount_price) / item.price) * 100);
                    return `
                        <div class="cart-item-full" data-name="${item.name}">
                            <div class="cart-item-full-img">
                                <img src="${item.src}" alt="${item.name}" loading="lazy" onerror="this.src='/javascript.svg';">
                            </div>
                            <div class="cart-item-full-details">
                                <h4 class="cart-item-full-title" data-name="${item.name}">${item.name}</h4>
                                <div class="cart-item-full-unit">${item.unit || '1 unit'} • ⚡ 10 Mins Delivery</div>
                                <div class="cart-item-full-price-row">
                                    <span class="cart-price-curr">₹${item.discount_price}</span>
                                    <span class="cart-price-mrp">₹${item.price}</span>
                                    ${discountPercent > 0 ? `<span class="cart-price-disc">${discountPercent}% OFF</span>` : ''}
                                </div>
                                <div class="cart-item-full-actions">
                                    <div class="cart-item-stepper">
                                        <button class="cart-stepper-btn sub-qty" data-name="${item.name}" aria-label="Decrease quantity">−</button>
                                        <span class="cart-stepper-qty">${item.quantity}</span>
                                        <button class="cart-stepper-btn add-qty" data-name="${item.name}" aria-label="Increase quantity">+</button>
                                    </div>
                                    <button class="btn-cart-save-later" data-name="${item.name}">
                                        <i data-lucide="bookmark"></i> <span>Save for Later</span>
                                    </button>
                                    <button class="btn-cart-remove" data-name="${item.name}">
                                        <i data-lucide="trash-2"></i> <span>Remove</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                // Wire up actions inside cart items
                cartPageItemsList.querySelectorAll('.cart-item-full-title').forEach(titleEl => {
                    titleEl.addEventListener('click', () => {
                        const name = titleEl.dataset.name;
                        const item = this.data.find(i => i.name === name);
                        if (item) this.showProductDetailView(item);
                    });
                });

                cartPageItemsList.querySelectorAll('.cart-stepper-btn.sub-qty').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const name = btn.dataset.name;
                        const item = this.data.find(i => i.name === name);
                        if (item && item.quantity > 0) {
                            item.quantity -= 1;
                            this.saveCartToStorage();
                            this.updateAllCardDOMs(item);
                            this.updateCartUI();
                            this.renderCartPageView();
                        }
                    });
                });

                cartPageItemsList.querySelectorAll('.cart-stepper-btn.add-qty').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const name = btn.dataset.name;
                        const item = this.data.find(i => i.name === name);
                        if (item) {
                            item.quantity += 1;
                            this.saveCartToStorage();
                            this.updateAllCardDOMs(item);
                            this.updateCartUI();
                            this.renderCartPageView();
                        }
                    });
                });

                cartPageItemsList.querySelectorAll('.btn-cart-save-later').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const name = btn.dataset.name;
                        const item = this.data.find(i => i.name === name);
                        if (item) {
                            if (!this.savedForLater.some(s => s.name === item.name)) {
                                this.savedForLater.push({
                                    name: item.name,
                                    price: item.price,
                                    discount_price: item.discount_price,
                                    src: item.src,
                                    unit: item.unit
                                });
                                this.saveSavedForLaterToStorage();
                            }
                            item.quantity = 0;
                            this.saveCartToStorage();
                            this.updateAllCardDOMs(item);
                            this.updateCartUI();
                            this.renderCartPageView();
                            this.showToast(`🔖 Saved "${item.name}" for later`);
                        }
                    });
                });

                cartPageItemsList.querySelectorAll('.btn-cart-remove').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const name = btn.dataset.name;
                        const item = this.data.find(i => i.name === name);
                        if (item) {
                            item.quantity = 0;
                            this.saveCartToStorage();
                            this.updateAllCardDOMs(item);
                            this.updateCartUI();
                            this.renderCartPageView();
                            this.showToast(`🗑️ Removed "${item.name}" from cart`);
                        }
                    });
                });
            }

            if (cartPageEmpty) cartPageEmpty.style.display = 'none';
            if (cartPageRightCol) cartPageRightCol.style.display = 'block';
            if (clearBtn) clearBtn.style.display = 'inline-flex';
            if (freeDeliveryAlert) freeDeliveryAlert.style.display = 'flex';

            // Price Details calculations
            const subtotal = cartItems.reduce((sum, item) => sum + (item.discount_price * item.quantity), 0);
            const mrpTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const mrpDiscount = Math.max(0, mrpTotal - subtotal);
            const deliveryFee = subtotal > 499 ? 0 : 25;
            const coinsDiscount = (this.redeemMegaCoins && this.megaCoins >= 50) ? Math.min(50, subtotal) : 0;
            const finalTotal = Math.max(0, subtotal + deliveryFee - coinsDiscount);
            const totalSavings = mrpDiscount + (subtotal > 499 ? 25 : 0) + coinsDiscount;

            // Update free delivery tracker
            const deliveryTitle = document.getElementById('cartPageDeliveryTitle');
            const deliveryFill = document.getElementById('cartPageDeliveryFill');
            const deliveryBadge = document.getElementById('cartPageDeliveryBadge');
            if (subtotal >= 499) {
                if (deliveryTitle) deliveryTitle.textContent = '🎉 Congratulations! You have unlocked FREE Delivery!';
                if (deliveryFill) deliveryFill.style.width = '100%';
                if (deliveryBadge) deliveryBadge.textContent = 'FREE UNLOCKED';
            } else {
                const diff = (499 - subtotal).toFixed(0);
                if (deliveryTitle) deliveryTitle.textContent = `Add ₹${diff} more for FREE Delivery`;
                const pct = Math.min(100, Math.round((subtotal / 499) * 100));
                if (deliveryFill) deliveryFill.style.width = `${pct}%`;
                if (deliveryBadge) deliveryBadge.textContent = `₹499 GOAL`;
            }

            // Update Right Column Price Details
            const summaryCount = document.getElementById('summaryCount');
            const summaryMRP = document.getElementById('summaryMRP');
            const summaryDiscount = document.getElementById('summaryDiscount');
            const summaryDeliveryFee = document.getElementById('summaryDeliveryFee');
            const summaryMegaCoinsRow = document.getElementById('summaryMegaCoinsRow');
            const summaryMegaCoinsSavings = document.getElementById('summaryMegaCoinsSavings');
            const summaryFinalTotal = document.getElementById('summaryFinalTotal');
            const summaryTotalSavings = document.getElementById('summaryTotalSavings');
            const cartPageRedeemCoins = document.getElementById('cartPageRedeemCoins');

            if (summaryCount) summaryCount.textContent = totalItemsCount;
            if (summaryMRP) summaryMRP.textContent = `₹${mrpTotal.toFixed(2)}`;
            if (summaryDiscount) summaryDiscount.textContent = `- ₹${mrpDiscount.toFixed(2)}`;
            if (summaryDeliveryFee) {
                summaryDeliveryFee.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
                summaryDeliveryFee.className = deliveryFee === 0 ? 'text-green' : '';
            }

            if (summaryMegaCoinsRow && summaryMegaCoinsSavings) {
                if (coinsDiscount > 0) {
                    summaryMegaCoinsRow.style.display = 'flex';
                    summaryMegaCoinsSavings.textContent = `- ₹${coinsDiscount.toFixed(2)}`;
                } else {
                    summaryMegaCoinsRow.style.display = 'none';
                }
            }

            if (cartPageRedeemCoins) cartPageRedeemCoins.checked = this.redeemMegaCoins;
            if (summaryFinalTotal) summaryFinalTotal.textContent = `₹${finalTotal.toFixed(2)}`;
            if (summaryTotalSavings) summaryTotalSavings.textContent = `₹${totalSavings.toFixed(2)}`;
        }

        // Render Saved For Later Section
        this.renderSavedForLaterSection();
        if (window.lucide) lucide.createIcons();
    }

    renderSavedForLaterSection() {
        const savedBox = document.getElementById('savedForLaterBox');
        const savedCount = document.getElementById('savedItemsCount');
        const savedList = document.getElementById('savedItemsList');
        if (!savedBox || !savedList) return;

        if (this.savedForLater.length === 0) {
            savedBox.style.display = 'none';
        } else {
            savedBox.style.display = 'block';
            if (savedCount) savedCount.textContent = this.savedForLater.length;
            savedList.innerHTML = this.savedForLater.map(item => `
                <div class="cart-item-full" data-name="${item.name}">
                    <div class="cart-item-full-img">
                        <img src="${item.src}" alt="${item.name}" loading="lazy" onerror="this.src='/javascript.svg';">
                    </div>
                    <div class="cart-item-full-details">
                        <h4 class="cart-item-full-title">${item.name}</h4>
                        <div class="cart-item-full-unit">${item.unit || '1 unit'}</div>
                        <div class="cart-item-full-price-row">
                            <span class="cart-price-curr">₹${item.discount_price}</span>
                            <span class="cart-price-mrp">₹${item.price}</span>
                        </div>
                        <div class="cart-item-full-actions">
                            <button class="btn-move-to-cart" data-name="${item.name}">
                                <i data-lucide="shopping-cart"></i> <span>Move to Cart</span>
                            </button>
                            <button class="btn-cart-remove remove-saved" data-name="${item.name}">
                                <i data-lucide="trash-2"></i> <span>Remove</span>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            savedList.querySelectorAll('.btn-move-to-cart').forEach(btn => {
                btn.addEventListener('click', () => {
                    const name = btn.dataset.name;
                    const item = this.data.find(i => i.name === name);
                    if (item) {
                        item.quantity = 1;
                        this.savedForLater = this.savedForLater.filter(s => s.name !== name);
                        this.saveSavedForLaterToStorage();
                        this.saveCartToStorage();
                        this.updateAllCardDOMs(item);
                        this.updateCartUI();
                        this.renderCartPageView();
                        this.showToast(`🛒 Moved "${name}" back to cart`);
                    }
                });
            });

            savedList.querySelectorAll('.remove-saved').forEach(btn => {
                btn.addEventListener('click', () => {
                    const name = btn.dataset.name;
                    this.savedForLater = this.savedForLater.filter(s => s.name !== name);
                    this.saveSavedForLaterToStorage();
                    this.renderSavedForLaterSection();
                    this.showToast(`Removed "${name}" from saved items`);
                });
            });
        }
    }

    // ================= FLIPKART MEGA HERO & UTILITY STRIP =================
    setupSubHeaderNav() {
        const tabs = document.querySelectorAll('.sub-nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.dataset.tab;
                if (target === 'For You') {
                    this.showHomeView();
                } else if (target === 'Grocery') {
                    this.showCategoryView('All Products');
                } else if (target === 'Fruits & Veggies') {
                    this.showCategoryView('Fresh Fruits');
                } else if (target === 'Kitchen') {
                    this.showCategoryView('Kitchen');
                } else if (target === 'Household') {
                    this.showCategoryView('House Hold');
                } else if (target === 'Top Offers') {
                    this.showHomeView();
                    const flashSale = document.getElementById('flashSaleBanner');
                    if (flashSale) flashSale.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupMegaCarousel() {
        const track = document.getElementById('megaCarouselTrack');
        const prevBtn = document.getElementById('megaCarouselPrev');
        const nextBtn = document.getElementById('megaCarouselNext');
        const dots = document.querySelectorAll('#megaCarouselIndicators .indicator-dot');
        const wrapper = document.getElementById('megaCarouselWrapper');
        if (!track) return;

        const totalSlides = 3;
        const updateSlide = (index) => {
            this.megaCarouselIndex = (index + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${this.megaCarouselIndex * 100}%)`;
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === this.megaCarouselIndex);
            });
        };

        prevBtn?.addEventListener('click', () => {
            updateSlide(this.megaCarouselIndex - 1);
        });

        nextBtn?.addEventListener('click', () => {
            updateSlide(this.megaCarouselIndex + 1);
        });

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.dataset.index, 10);
                updateSlide(idx);
            });
        });

        // Banner CTA buttons
        document.querySelectorAll('.mega-banner-slide .banner-cta-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.category || 'All Products';
                this.showCategoryView(cat);
            });
        });

        // Auto-slide every 4.5 seconds
        const startAutoSlide = () => {
            if (this.megaCarouselInterval) clearInterval(this.megaCarouselInterval);
            this.megaCarouselInterval = setInterval(() => {
                updateSlide(this.megaCarouselIndex + 1);
            }, 4500);
        };

        const stopAutoSlide = () => {
            if (this.megaCarouselInterval) clearInterval(this.megaCarouselInterval);
        };

        wrapper?.addEventListener('mouseenter', stopAutoSlide);
        wrapper?.addEventListener('mouseleave', startAutoSlide);
        startAutoSlide();
    }

    setupBankOfferStrip() {
        const copyBtn = document.getElementById('copyBankCouponBtn');
        copyBtn?.addEventListener('click', () => {
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText('FESTIVE10').then(() => {
                    this.showToast('📋 Coupon FESTIVE10 copied to clipboard! (10% OFF)');
                }).catch(() => {
                    this.showToast('📋 Coupon Code: FESTIVE10');
                });
            } else {
                this.showToast('📋 Coupon Code: FESTIVE10');
            }
        });
    }

    setupUtilityStrip() {
        document.getElementById('utilCreditDeals')?.addEventListener('click', () => {
            this.showToast('💳 10% Instant Discount on HDFC & SBI Cards! Code: FESTIVE10');
        });
        document.getElementById('utilMegaCoins')?.addEventListener('click', () => {
            this.showProfileView();
        });
        document.getElementById('utilGiftCards')?.addEventListener('click', () => {
            this.showToast('🎁 MegaMart Gift Cards: Get 10% Extra Balance on ₹1,000+');
        });
        document.getElementById('utilSuperOffers')?.addEventListener('click', () => {
            this.showHomeView();
            const flash = document.getElementById('flashSaleBanner');
            if (flash) flash.scrollIntoView({ behavior: 'smooth' });
        });
        document.getElementById('utilBestBrands')?.addEventListener('click', () => {
            this.showCategoryView('All Products');
        });
    }

    setupFlipkartDealCards() {
        const col1 = document.getElementById('dealCol1Grid');
        const col2 = document.getElementById('dealCol2Grid');
        const col3 = document.getElementById('dealCol3Grid');

        const fruits = this.controller.filterItems('Fresh Fruits').slice(0, 4);
        const allItems = this.data.slice(0, 16);
        const topSaver = allItems.filter(i => (i.price - i.discount_price) > 30).slice(0, 4);
        const budget = this.data.filter(i => i.discount_price <= 99).slice(0, 4);

        const renderMiniGrid = (container, items, labelPrefix = '') => {
            if (!container) return;
            container.innerHTML = items.map(item => `
                <div class="deal-mini-item" data-name="${item.name}">
                    <div class="deal-mini-img-wrap">
                        <img src="${item.src}" alt="${item.name}" loading="lazy" onerror="this.src='/javascript.svg';">
                    </div>
                    <span class="deal-mini-name">${item.name}</span>
                    <span class="deal-mini-price">${labelPrefix}₹${item.discount_price}</span>
                </div>
            `).join('');

            container.querySelectorAll('.deal-mini-item').forEach(el => {
                el.addEventListener('click', () => {
                    const name = el.dataset.name;
                    const item = this.data.find(i => i.name === name);
                    if (item) this.showProductDetailView(item);
                });
            });
        };

        renderMiniGrid(col1, fruits.length ? fruits : allItems.slice(0, 4), 'From ');
        renderMiniGrid(col2, topSaver.length ? topSaver : allItems.slice(4, 8), '');
        renderMiniGrid(col3, budget.length ? budget : allItems.slice(8, 12), 'From ');

        // Wire up "View All" on deal cards
        document.querySelectorAll('.flipkart-deal-cards-section .deal-view-all').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.category || 'All Products';
                this.showCategoryView(cat);
            });
        });
    }

    setupFlipkartCuratedRails() {
        const farmTrack = document.getElementById('railFarmFreshTrack');
        const pantryTrack = document.getElementById('railPantryKitchenTrack');

        // Farm Fresh Items (Fruits + Vegetables)
        const fruits = (this.controller && typeof this.controller.filterItems === 'function') 
            ? this.controller.filterItems('Fresh Fruits') 
            : this.data.filter(i => i.type === 'Fresh Fruits');
        const veggies = (this.controller && typeof this.controller.filterItems === 'function')
            ? this.controller.filterItems('Fresh Vegetables')
            : this.data.filter(i => i.type === 'Fresh Vegetables');
        const farmItems = [...(fruits || []), ...(veggies || [])].slice(0, 10);

        // Pantry & Kitchen Items
        const kitchen = (this.controller && typeof this.controller.filterItems === 'function')
            ? this.controller.filterItems('Kitchen')
            : this.data.filter(i => i.type === 'Kitchen');
        const household = (this.controller && typeof this.controller.filterItems === 'function')
            ? this.controller.filterItems('House Hold')
            : this.data.filter(i => i.type === 'House Hold');
        const pantryItems = [...(kitchen || []), ...(household || [])].slice(0, 10);

        const ribbonThemes = ['ribbon-red', 'ribbon-amber', 'ribbon-green'];
        const ribbonBadges = ['Min. 40% Off', 'Crazy Deal', 'Special Offer', 'Top Saver', 'Under ₹99', 'Best Seller', 'Extra 15% Off'];

        const renderRailCards = (container, items, isWarm = false) => {
            if (!container || !items || !items.length) return;
            container.innerHTML = items.map((item, idx) => {
                const ribbonClass = ribbonThemes[idx % ribbonThemes.length];
                const ribbonText = item.flashDiscount ? `Min. ${item.flashDiscount}` : ribbonBadges[idx % ribbonBadges.length];
                const safeName = item.name.replace(/"/g, '&quot;');
                return `
                    <div class="curated-deal-card" data-name="${safeName}">
                        <div class="curated-card-media ${isWarm ? 'media-warm' : ''}">
                            <img src="${item.src}" alt="${safeName}" loading="lazy" class="curated-card-img" onerror="this.src='/javascript.svg';">
                            <div class="curated-card-ribbon ${ribbonClass}">${ribbonText}</div>
                        </div>
                        <div class="curated-card-info">
                            <div class="curated-card-title" title="${safeName}">${item.name}</div>
                            <div class="curated-card-price">
                                <span class="curated-price-highlight">From ₹${item.discount_price}</span>
                                ${item.price > item.discount_price ? `<span class="curated-original-price">₹${item.price}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            container.querySelectorAll('.curated-deal-card').forEach(card => {
                card.addEventListener('click', () => {
                    const name = card.dataset.name;
                    const item = this.data.find(i => i.name === name);
                    if (item) this.showProductDetailView(item);
                });
            });
        };

        renderRailCards(farmTrack, farmItems.length ? farmItems : this.data.slice(0, 8), true);
        renderRailCards(pantryTrack, pantryItems.length ? pantryItems : this.data.slice(8, 16), false);

        // Circular arrow smooth navigation buttons
        const wireScrollButtons = (prevBtnId, nextBtnId, trackId) => {
            const prevBtn = document.getElementById(prevBtnId);
            const nextBtn = document.getElementById(nextBtnId);
            const track = document.getElementById(trackId);
            if (!track) return;

            const checkScrollLimits = () => {
                if (prevBtn) prevBtn.disabled = track.scrollLeft <= 5;
                if (nextBtn) nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
            };

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    track.scrollBy({ left: -360, behavior: 'smooth' });
                    setTimeout(checkScrollLimits, 350);
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    track.scrollBy({ left: 360, behavior: 'smooth' });
                    setTimeout(checkScrollLimits, 350);
                });
            }

            track.addEventListener('scroll', checkScrollLimits, { passive: true });
            checkScrollLimits();
        };

        wireScrollButtons('railPrevFarmFresh', 'railNextFarmFresh', 'railFarmFreshTrack');
        wireScrollButtons('railPrevPantry', 'railNextPantry', 'railPantryKitchenTrack');

        // View All click navigation
        document.querySelectorAll('.flipkart-curated-rail .rail-view-all').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.category || 'All Products';
                this.showCategoryView(cat);
            });
        });

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // ================= USER AUTHENTICATION & SECURITY SYSTEM =================

    loadUserFromStorage() {
        try {
            const raw = localStorage.getItem('megamart_user');
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object' && parsed.name) {
                return parsed;
            }
            return null;
        } catch (e) {
            console.error('Error reading user session:', e);
            return null;
        }
    }

    saveUserToStorage(user) {
        try {
            if (user) {
                localStorage.setItem('megamart_user', JSON.stringify(user));
            } else {
                localStorage.removeItem('megamart_user');
            }
        } catch (e) {
            console.error('Error saving user session:', e);
        }
    }

    loadRegisteredUsers() {
        try {
            const raw = localStorage.getItem('megamart_registered_users');
            if (!raw) {
                const seed = [{
                    name: 'Tripurari Sahni',
                    email: 'tripurarisahni@gmail.com',
                    phone: '9876543210',
                    password: 'password123',
                    registeredAt: '2026-01-01T00:00:00.000Z'
                }];
                localStorage.setItem('megamart_registered_users', JSON.stringify(seed));
                return seed;
            }
            return JSON.parse(raw) || [];
        } catch (e) {
            return [];
        }
    }

    saveRegisteredUsers(users) {
        try {
            localStorage.setItem('megamart_registered_users', JSON.stringify(users));
        } catch (e) {
            console.error('Error saving registered users:', e);
        }
    }

    setupAuth() {
        // Elements
        const headerLoginBtn = document.getElementById('headerLoginBtn');
        const headerUserBtn = document.getElementById('headerUserBtn');
        const headerUserDropdown = document.getElementById('headerUserDropdown');
        const authModal = document.getElementById('authModal');
        const authOverlay = document.getElementById('authModalOverlay');
        const closeAuthModal = document.getElementById('closeAuthModal');
        const profileLoginBtn = document.getElementById('profileLoginBtn');
        const profileLogoutBtn = document.getElementById('profileLogoutBtn');

        // Dropdown menu items
        const dropdownProfileBtn = document.getElementById('dropdownProfileBtn');
        const dropdownOrdersBtn = document.getElementById('dropdownOrdersBtn');
        const dropdownWishlistBtn = document.getElementById('dropdownWishlistBtn');
        const dropdownCoinsBtn = document.getElementById('dropdownCoinsBtn');
        const dropdownLogoutBtn = document.getElementById('dropdownLogoutBtn');

        // Tabs
        const authTabLogin = document.getElementById('authTabLogin');
        const authTabRegister = document.getElementById('authTabRegister');
        const switchTabToRegister = document.getElementById('switchTabToRegister');
        const switchTabToLogin = document.getElementById('switchTabToLogin');

        // Demo Login
        const demoLoginBtn = document.getElementById('demoLoginBtn');

        // Password Show/Hide Toggles
        const toggleLoginPassword = document.getElementById('toggleLoginPassword');
        const loginPasswordInput = document.getElementById('loginPassword');
        const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
        const registerPasswordInput = document.getElementById('registerPassword');

        // Form elements
        const loginForm = document.getElementById('loginTabContent');
        const registerForm = document.getElementById('registerTabContent');

        // Open Auth Modal
        const openModal = (tab = 'login') => {
            if (tab === 'login') {
                this.switchAuthTab('login');
            } else {
                this.switchAuthTab('register');
            }
            authModal?.classList.add('active');
            authOverlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (window.lucide) lucide.createIcons();
        };

        this.openAuthModal = openModal;

        const closeModal = () => {
            authModal?.classList.remove('active');
            authOverlay?.classList.remove('active');
            document.body.style.overflow = '';
            this.clearAuthErrors();
        };

        this.closeAuthModal = closeModal;

        // Header and Profile Triggers
        headerLoginBtn?.addEventListener('click', () => openModal('login'));
        profileLoginBtn?.addEventListener('click', () => openModal('login'));
        closeAuthModal?.addEventListener('click', closeModal);
        authOverlay?.addEventListener('click', closeModal);

        // Header User Menu Dropdown Toggle
        headerUserBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = headerUserDropdown?.classList.contains('active');
            if (isOpen) {
                headerUserDropdown?.classList.remove('active');
                headerUserBtn.setAttribute('aria-expanded', 'false');
            } else {
                headerUserDropdown?.classList.add('active');
                headerUserBtn.setAttribute('aria-expanded', 'true');
                if (window.lucide) lucide.createIcons();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (headerUserDropdown && !headerUserDropdown.contains(e.target) && !headerUserBtn?.contains(e.target)) {
                headerUserDropdown.classList.remove('active');
                headerUserBtn?.setAttribute('aria-expanded', 'false');
            }
        });

        // Dropdown actions
        dropdownProfileBtn?.addEventListener('click', () => {
            headerUserDropdown?.classList.remove('active');
            headerUserBtn?.setAttribute('aria-expanded', 'false');
            this.showProfileView();
        });

        dropdownOrdersBtn?.addEventListener('click', () => {
            headerUserDropdown?.classList.remove('active');
            headerUserBtn?.setAttribute('aria-expanded', 'false');
            this.openOrderHistoryDrawer();
        });

        dropdownWishlistBtn?.addEventListener('click', () => {
            headerUserDropdown?.classList.remove('active');
            headerUserBtn?.setAttribute('aria-expanded', 'false');
            this.openWishlistSidebar();
        });

        dropdownCoinsBtn?.addEventListener('click', () => {
            headerUserDropdown?.classList.remove('active');
            headerUserBtn?.setAttribute('aria-expanded', 'false');
            this.showProfileView();
            setTimeout(() => {
                const coinsCard = document.querySelector('.profile-megacoins-card');
                coinsCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });

        dropdownLogoutBtn?.addEventListener('click', () => {
            headerUserDropdown?.classList.remove('active');
            headerUserBtn?.setAttribute('aria-expanded', 'false');
            this.logout();
        });

        profileLogoutBtn?.addEventListener('click', () => {
            this.logout();
        });

        // Dual Tab switching
        authTabLogin?.addEventListener('click', () => this.switchAuthTab('login'));
        authTabRegister?.addEventListener('click', () => this.switchAuthTab('register'));
        switchTabToRegister?.addEventListener('click', () => this.switchAuthTab('register'));
        switchTabToLogin?.addEventListener('click', () => this.switchAuthTab('login'));

        // Password Show/Hide
        toggleLoginPassword?.addEventListener('click', () => {
            if (loginPasswordInput) {
                const isPassword = loginPasswordInput.type === 'password';
                loginPasswordInput.type = isPassword ? 'text' : 'password';
                toggleLoginPassword.innerHTML = isPassword ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
                if (window.lucide) lucide.createIcons();
            }
        });

        toggleRegisterPassword?.addEventListener('click', () => {
            if (registerPasswordInput) {
                const isPassword = registerPasswordInput.type === 'password';
                registerPasswordInput.type = isPassword ? 'text' : 'password';
                toggleRegisterPassword.innerHTML = isPassword ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
                if (window.lucide) lucide.createIcons();
            }
        });

        // Recruiter 1-Click Demo Login Button (Tripurari Sahni)
        demoLoginBtn?.addEventListener('click', () => {
            const demoUser = {
                name: 'Tripurari Sahni',
                email: 'tripurarisahni@gmail.com',
                phone: '9876543210',
                loggedIn: true,
                isDemo: true,
                loginTime: new Date().toISOString()
            };
            this.currentUser = demoUser;
            this.saveUserToStorage(demoUser);
            this.updateAuthUI();
            this.closeAuthModal();
            this.showToast('🚀 Welcome back, Tripurari Sahni! (Demo Account)');
        });

        // Login Form Submission
        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLoginSubmit();
        });

        // Register Form Submission
        registerForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegisterSubmit();
        });

        // Initialize UI with current storage state
        this.updateAuthUI();
        this.updateProfileStats();
    }

    switchAuthTab(tab) {
        const authTabLogin = document.getElementById('authTabLogin');
        const authTabRegister = document.getElementById('authTabRegister');
        const loginTabContent = document.getElementById('loginTabContent');
        const registerTabContent = document.getElementById('registerTabContent');

        this.clearAuthErrors();

        if (tab === 'login') {
            authTabLogin?.classList.add('active');
            authTabRegister?.classList.remove('active');
            authTabLogin?.setAttribute('aria-selected', 'true');
            authTabRegister?.setAttribute('aria-selected', 'false');
            if (loginTabContent) loginTabContent.style.display = 'flex';
            if (registerTabContent) registerTabContent.style.display = 'none';
        } else {
            authTabRegister?.classList.add('active');
            authTabLogin?.classList.remove('active');
            authTabRegister?.setAttribute('aria-selected', 'true');
            authTabLogin?.setAttribute('aria-selected', 'false');
            if (registerTabContent) registerTabContent.style.display = 'flex';
            if (loginTabContent) loginTabContent.style.display = 'none';
        }
        if (window.lucide) lucide.createIcons();
    }

    clearAuthErrors() {
        document.querySelectorAll('.auth-field-error').forEach(el => el.textContent = '');
        document.querySelectorAll('.auth-input-field').forEach(el => el.classList.remove('input-error'));
    }

    handleLoginSubmit() {
        const idInput = document.getElementById('loginIdentifier');
        const pwdInput = document.getElementById('loginPassword');
        const idError = document.getElementById('loginIdentifierError');
        const pwdError = document.getElementById('loginPasswordError');

        this.clearAuthErrors();

        const identifier = (idInput?.value || '').trim();
        const password = (pwdInput?.value || '').trim();

        let hasError = false;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        const any10Digits = /^\d{10}$/;

        const isEmail = emailRegex.test(identifier);
        const isPhone = phoneRegex.test(identifier) || any10Digits.test(identifier);

        if (!identifier) {
            idError.textContent = 'Please enter your email or 10-digit mobile number';
            idInput?.closest('.auth-input-field')?.classList.add('input-error');
            hasError = true;
        } else if (!isEmail && !isPhone) {
            idError.textContent = 'Enter a valid email address or 10-digit mobile number';
            idInput?.closest('.auth-input-field')?.classList.add('input-error');
            hasError = true;
        }

        if (!password) {
            pwdError.textContent = 'Please enter your password';
            pwdInput?.closest('.auth-input-field')?.classList.add('input-error');
            hasError = true;
        } else if (password.length < 4) {
            pwdError.textContent = 'Password must be at least 4 characters';
            pwdInput?.closest('.auth-input-field')?.classList.add('input-error');
            hasError = true;
        }

        if (hasError) return;

        // Check if demo user identifier
        const isDemoIdentifier = identifier.toLowerCase() === 'tripurarisahni@gmail.com' ||
                                 identifier === '9876543210' ||
                                 identifier.toLowerCase() === 'tripurari';

        if (isDemoIdentifier) {
            const demoUser = {
                name: 'Tripurari Sahni',
                email: 'tripurarisahni@gmail.com',
                phone: '9876543210',
                loggedIn: true,
                isDemo: true,
                loginTime: new Date().toISOString()
            };
            this.currentUser = demoUser;
            this.saveUserToStorage(demoUser);
            this.updateAuthUI();
            this.closeAuthModal();
            this.showToast('👋 Welcome back, Tripurari Sahni!');
            return;
        }

        // Check registered users in storage
        const registeredUsers = this.loadRegisteredUsers();
        const found = registeredUsers.find(u =>
            (u.email?.toLowerCase() === identifier.toLowerCase() || u.phone === identifier)
        );

        if (found) {
            if (found.password && found.password !== password) {
                pwdError.textContent = 'Incorrect password. Try again or use 1-Click Demo Login.';
                pwdInput?.closest('.auth-input-field')?.classList.add('input-error');
                return;
            }
            const activeUser = {
                name: found.name,
                email: found.email,
                phone: found.phone,
                loggedIn: true,
                loginTime: new Date().toISOString()
            };
            this.currentUser = activeUser;
            this.saveUserToStorage(activeUser);
            this.updateAuthUI();
            this.closeAuthModal();
            this.showToast(`👋 Welcome back, ${found.name.split(' ')[0]}!`);
            return;
        }

        // Create session for user
        const autoName = isEmail ? identifier.split('@')[0].replace(/[._]/g, ' ') : 'Customer ' + identifier.slice(-4);
        const capitalized = autoName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const newUser = {
            name: capitalized,
            email: isEmail ? identifier : `${identifier}@customer.megamart.com`,
            phone: isPhone ? identifier : '9876543210',
            loggedIn: true,
            loginTime: new Date().toISOString()
        };

        this.currentUser = newUser;
        this.saveUserToStorage(newUser);
        this.updateAuthUI();
        this.closeAuthModal();
        this.showToast(`👋 Welcome to MegaMart, ${capitalized}!`);
    }

    handleRegisterSubmit() {
        const nameInput = document.getElementById('registerName');
        const emailInput = document.getElementById('registerEmail');
        const phoneInput = document.getElementById('registerPhone');
        const pwdInput = document.getElementById('registerPassword');

        const nameError = document.getElementById('registerNameError');
        const emailError = document.getElementById('registerEmailError');
        const phoneError = document.getElementById('registerPhoneError');
        const pwdError = document.getElementById('registerPasswordError');

        this.clearAuthErrors();

        const name = (nameInput?.value || '').trim();
        const email = (emailInput?.value || '').trim();
        const phone = (phoneInput?.value || '').trim();
        const password = (pwdInput?.value || '').trim();

        let hasError = false;

        if (!name || name.length < 2) {
            nameError.textContent = 'Please enter your full name (at least 2 letters)';
            nameInput?.closest('.auth-input-field')?.classList.add('input-error');
            hasError = true;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput?.closest('.auth-input-field')?.classList.add('input-error');
            hasError = true;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        const any10Digits = /^\d{10}$/;
        if (!phone || (!phoneRegex.test(phone) && !any10Digits.test(phone))) {
            phoneError.textContent = 'Please enter a valid 10-digit mobile number';
            phoneInput?.closest('.auth-input-field')?.classList.add('input-error');
            hasError = true;
        }

        if (!password || password.length < 6) {
            pwdError.textContent = 'Password must be at least 6 characters long';
            pwdInput?.closest('.auth-input-field')?.classList.add('input-error');
            hasError = true;
        }

        if (hasError) return;

        // Check if user already exists
        const registeredUsers = this.loadRegisteredUsers();
        const existing = registeredUsers.find(u => u.email?.toLowerCase() === email.toLowerCase() || u.phone === phone);
        if (existing) {
            emailError.textContent = 'An account with this email or phone already exists. Please log in.';
            return;
        }

        // Save new user
        const newUser = {
            name,
            email,
            phone,
            password,
            registeredAt: new Date().toISOString()
        };

        registeredUsers.push(newUser);
        this.saveRegisteredUsers(registeredUsers);

        // Auto log in
        const sessionUser = {
            name,
            email,
            phone,
            loggedIn: true,
            loginTime: new Date().toISOString()
        };
        this.currentUser = sessionUser;
        this.saveUserToStorage(sessionUser);

        this.updateAuthUI();
        this.closeAuthModal();
        this.showToast(`🎉 Welcome to MegaMart, ${name.split(' ')[0]}! Account created.`);
    }

    logout() {
        this.clearUserFromStorage();
        this.currentUser = null;
        this.updateAuthUI();
        this.updateProfileStats();
        this.showToast('🚪 Logged out successfully. See you again soon!');
    }

    clearUserFromStorage() {
        try {
            localStorage.removeItem('megamart_user');
        } catch (e) {
            console.error('Error clearing session:', e);
        }
    }

    updateAuthUI() {
        const headerLoginBtn = document.getElementById('headerLoginBtn');
        const headerUserMenu = document.getElementById('headerUserMenu');
        const headerUserName = document.getElementById('headerUserName');
        const headerUserAvatar = document.getElementById('headerUserAvatar');

        const dropdownUserAvatar = document.getElementById('dropdownUserAvatar');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');
        const dropdownCoinsVal = document.getElementById('dropdownCoinsVal');

        const profileAvatarText = document.getElementById('profileAvatarText');
        const profileUserName = document.getElementById('profileUserName');
        const profileUserContact = document.getElementById('profileUserContact');
        const profileLoginBtn = document.getElementById('profileLoginBtn');
        const profileLogoutBtn = document.getElementById('profileLogoutBtn');

        if (this.currentUser && this.currentUser.name) {
            // Logged in
            if (headerLoginBtn) headerLoginBtn.style.display = 'none';
            if (headerUserMenu) headerUserMenu.style.display = 'flex';

            const firstName = this.currentUser.name.split(' ')[0] || 'Member';
            const initials = this.currentUser.name
                .split(' ')
                .filter(Boolean)
                .map(n => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase() || 'MM';

            if (headerUserName) headerUserName.textContent = firstName;
            if (headerUserAvatar) headerUserAvatar.textContent = initials;

            if (dropdownUserAvatar) dropdownUserAvatar.textContent = initials;
            if (dropdownUserName) dropdownUserName.textContent = this.currentUser.name;
            if (dropdownUserEmail) dropdownUserEmail.textContent = this.currentUser.email || this.currentUser.phone;
            if (dropdownCoinsVal) dropdownCoinsVal.textContent = this.megaCoins;

            // Profile View
            if (profileAvatarText) profileAvatarText.textContent = initials;
            if (profileUserName) profileUserName.textContent = this.currentUser.name;
            if (profileUserContact) {
                const phoneStr = this.currentUser.phone ? `+91 ${this.currentUser.phone}` : '';
                const emailStr = this.currentUser.email || '';
                profileUserContact.textContent = [phoneStr, emailStr].filter(Boolean).join(' • ');
            }
            if (profileLoginBtn) profileLoginBtn.style.display = 'none';
            if (profileLogoutBtn) profileLogoutBtn.style.display = 'flex';

            // Auto pre-fill checkout if form is present
            const custName = document.getElementById('custName');
            const custPhone = document.getElementById('custPhone');
            if (custName && !custName.value) custName.value = this.currentUser.name;
            if (custPhone && !custPhone.value) custPhone.value = this.currentUser.phone || '';
        } else {
            // Logged out
            if (headerLoginBtn) headerLoginBtn.style.display = 'inline-flex';
            if (headerUserMenu) headerUserMenu.style.display = 'none';

            // Profile View
            if (profileAvatarText) profileAvatarText.innerHTML = '<i data-lucide="user"></i>';
            if (profileUserName) profileUserName.textContent = 'Guest User';
            if (profileUserContact) profileUserContact.textContent = 'Sign in to access orders, wishlist, and rewards';
            if (profileLoginBtn) profileLoginBtn.style.display = 'inline-flex';
            if (profileLogoutBtn) profileLogoutBtn.style.display = 'none';
        }

        if (window.lucide) lucide.createIcons();
    }

    updateProfileStats() {
        const orders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
        const profileOrdersCount = document.getElementById('profileOrdersCount');
        if (profileOrdersCount) {
            profileOrdersCount.textContent = orders.length;
        }
    }

    // ================= ORDER HISTORY DRAWER SYSTEM =================

    setupOrderHistoryDrawer() {
        const headerOrdersBtn = document.getElementById('headerOrdersBtn');
        const mobileOrdersBtn = document.getElementById('mobileOrdersBtn');
        const profileOrdersBtn = document.getElementById('profileOrdersBtn');
        const footerOrdersBtn = document.getElementById('orderHistoryFooterBtn');
        const closeHistory = document.getElementById('closeOrderHistory');
        const historyOverlay = document.getElementById('orderHistoryOverlay');

        const openDrawer = () => this.openOrderHistoryDrawer();
        const closeDrawer = () => this.closeOrderHistoryDrawer();

        headerOrdersBtn?.addEventListener('click', openDrawer);
        mobileOrdersBtn?.addEventListener('click', openDrawer);
        profileOrdersBtn?.addEventListener('click', openDrawer);
        footerOrdersBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            openDrawer();
        });

        closeHistory?.addEventListener('click', closeDrawer);
        historyOverlay?.addEventListener('click', closeDrawer);

        // Live Tracking Modal close triggers
        const trackingModal = document.getElementById('orderTrackingModal');
        const trackingOverlay = document.getElementById('orderTrackingOverlay');
        const closeTracking = document.getElementById('closeTrackingModal');
        const profileTrackBtn = document.getElementById('profileTrackBtn');
        const trackFooterBtn = document.getElementById('trackOrderFooterBtn');
        const trackSuccessBtn = document.getElementById('trackOrderFromSuccessBtn');

        const closeTracker = () => {
            trackingModal?.classList.remove('active');
            trackingOverlay?.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeTracking?.addEventListener('click', closeTracker);
        trackingOverlay?.addEventListener('click', closeTracker);

        profileTrackBtn?.addEventListener('click', () => {
            const orders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
            const latestId = orders[0]?.orderId || '#MM-89214';
            this.openLiveTracker(latestId);
        });

        trackFooterBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const orders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
            const latestId = orders[0]?.orderId || '#MM-89214';
            this.openLiveTracker(latestId);
        });

        trackSuccessBtn?.addEventListener('click', () => {
            const orderId = document.getElementById('successOrderId')?.textContent || '#MM-89214';
            this.closeCheckoutModal();
            this.openLiveTracker(orderId);
        });
    }

    openOrderHistoryDrawer() {
        const drawer = document.getElementById('orderHistoryDrawer');
        const overlay = document.getElementById('orderHistoryOverlay');
        const body = document.getElementById('orderHistoryBody');

        if (!drawer || !body) return;

        const orders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');

        if (orders.length === 0) {
            body.innerHTML = `
                <div class="history-empty-state">
                    <div class="history-empty-icon"><i data-lucide="package"></i></div>
                    <h4>No Orders Yet</h4>
                    <p>You haven't placed any grocery orders yet. Start adding items and enjoy lightning 10-minute delivery!</p>
                    <button class="continue-shopping-btn" id="emptyHistoryShopBtn" style="margin-top:12px;">Start Shopping</button>
                </div>
            `;
            document.getElementById('emptyHistoryShopBtn')?.addEventListener('click', () => {
                this.closeOrderHistoryDrawer();
                this.showHomeView();
            });
        } else {
            body.innerHTML = orders.map(order => {
                const dateStr = order.date ? new Date(order.date).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : 'Recently';

                const itemsCount = (order.items || []).reduce((acc, i) => acc + (i.qty || 1), 0);
                const itemsSummary = (order.items || []).map(i => `${i.name} (x${i.qty})`).join(', ');

                return `
                    <div class="history-card">
                        <div class="history-card-header">
                            <div class="hc-id-box">
                                <span class="hc-order-id">${order.orderId}</span>
                                <span class="hc-date">${dateStr}</span>
                            </div>
                            <span class="hc-status-badge status-delivered">
                                <i data-lucide="check-circle-2"></i> On the Way
                            </span>
                        </div>
                        <div class="hc-items-preview">
                            <p class="hc-items-text">${itemsSummary || `${itemsCount} grocery items`}</p>
                            <div class="hc-meta-row">
                                <span class="hc-total">Total: <strong>₹${Number(order.total || 0).toFixed(2)}</strong></span>
                                <span class="hc-payment-method">${order.paymentMethod || 'UPI'}</span>
                            </div>
                        </div>
                        <div class="hc-actions">
                            <button class="track-order-card-btn" data-order-id="${order.orderId}">
                                <i data-lucide="navigation"></i> Track Live
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            body.querySelectorAll('.track-order-card-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.orderId;
                    this.closeOrderHistoryDrawer();
                    this.openLiveTracker(id);
                });
            });
        }

        drawer.classList.add('active');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.lucide) lucide.createIcons();
    }

    closeOrderHistoryDrawer() {
        document.getElementById('orderHistoryDrawer')?.classList.remove('active');
        document.getElementById('orderHistoryOverlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    openLiveTracker(orderId) {
        const modal = document.getElementById('orderTrackingModal');
        const overlay = document.getElementById('orderTrackingOverlay');
        const titleEl = document.getElementById('trackingModalOrderId');

        if (titleEl) titleEl.textContent = orderId || 'Order #MM-89214';

        const orders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
        const matching = orders.find(o => o.orderId === orderId);
        const summaryBox = document.getElementById('trackingOrderSummary');
        if (summaryBox) {
            if (matching && matching.items) {
                summaryBox.innerHTML = `
                    <h4>Order Summary (${matching.items.length} items)</h4>
                    <div style="font-size:0.85rem;color:#475569;margin-top:4px;">
                        ${matching.items.map(i => `<div>• ${i.name} × ${i.qty} (₹${i.price})</div>`).join('')}
                    </div>
                    <div style="margin-top:8px;font-weight:700;color:#0f172a;">Paid: ₹${Number(matching.total || 0).toFixed(2)} (${matching.paymentMethod || 'UPI'})</div>
                `;
            } else {
                summaryBox.innerHTML = `
                    <h4>Express Delivery to Dark Store Partner</h4>
                    <p style="font-size:0.82rem;color:#64748b;margin-top:4px;">Rider assigned: <strong>Ramesh Kumar</strong> • Delivery in 11 minutes</p>
                `;
            }
        }

        modal?.classList.add('active');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.lucide) lucide.createIcons();
    }
}
