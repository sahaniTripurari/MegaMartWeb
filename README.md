# 🛒 MegaMart - Flagship E-Commerce Platform (Flipkart × Amazon × Myntra Inspired)

[![Live Demo](https://img.shields.io/badge/Demo-Live_Website-22c55e?style=for-the-badge&logo=render)](https://megamart-iyre.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/sahaniTripurari/MegaMartWeb)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=vite)](https://vitejs.dev/)

MegaMart is a production-grade, fast, and responsive Quick-Commerce grocery & essentials web platform inspired by the gold standards of modern e-commerce—**Flipkart, Amazon, Myntra, and Zepto**. Built with clean MVC architecture, conversion-optimized design systems, and real-time state persistence.

---

## 🌟 Gold-Standard E-Commerce Features

### 🔵 Flipkart-Inspired Signature Systems
- **✓ MegaAssured Trust Quality Badge**: Shimmering royal blue & gold trust pill on every product guaranteeing direct sourcing, cold-chain inspection, and 10-minute delivery.
- **⚡ Flash Sale / Deal of the Day Ticker**: Live hero banner countdown timer (`[HH:MM:SS]`) with dynamic `🔥 40% OFF` flame badges on deal items.
- **🪙 MegaCoins Loyalty Rewards (Flipkart SuperCoins)**:
  - Earn coins on every purchase (`🪙 Earn 15 MegaCoins`).
  - Active balance indicator in Header pill and User Profile.
  - 1-Click Coin Redemption in Checkout (`Redeem 50 MegaCoins to save ₹50`).
- **⚖️ Multi-Weight / Pack Size Selector**: Variant pills (`500g`, `1kg`, `2kg` with savings indicator) that dynamically update price, discount, and unit across the entire UI.

### 🟠 Amazon-Inspired Signature Conversion Drivers
- **⚡ Amazon 1-Click "Buy Now" Button**: Amber/orange gradient action button in Product Detail modal that sets quantity, bypasses the cart drawer, and opens the checkout modal ready for instant 1-click purchase.
- **📦 Amazon "Frequently Bought Together" (FBT) Bundles**: Intelligent companion bundling (e.g., `Banana + Milk + Sugar`, `Tea + Sugar + Milk`, `Cleaners + Soap + Sanitizers`) with 1-click **"🛒 Add All 3 to Cart"** and extra bundle discounts (`Save ₹30 Extra!`).
- **📍 Live Pincode Delivery Estimator**: Header location selector & product detail checker validating Indian pincodes (Mumbai `400001`, Delhi `110001`, Bangalore `560001`, Pune `411001`) with guaranteed speed badges and localStorage memory.
- **❓ Searchable Customer Q&A / FAQs Accordion**: Expandable FAQ accordion addressing freshness, return/refund policy, eco-packaging, and delivery speed with instant search filter.

### 🟣 Myntra-Inspired Visual Polish & Savings
- **🎉 Total Savings Celebratory Card**: Vibrant emerald celebration banner in Cart Sidebar & Checkout summary calculating cumulative savings:
  `🎉 Total Savings: You are saving ₹X on this order!` (MRP discount + Promo coupons + MegaCoins + Free delivery).
- **❤️ Wishlist / Favorites Engine**: Interactive heart toggle with `@keyframes heartPop` animation, live header badge counter, and dedicated Wishlist Drawer with "Move to Cart" and "Move All to Cart".
- **🔍 Mouse-Tracking Zoom Preview**: 1.45x smooth magnification tracking cursor position on product images.

### 🛡️ Core Quick-Commerce & Security Architecture
- **🚚 Dynamic Free Delivery Progress Bar**: Live calculation (*"Add ₹X more for FREE Delivery"* with ₹499 threshold).
- **📍 Live 5-Stage Order Tracking Stepper**: Order Placed ➔ Packed at Dark Store ➔ Rider Assigned (Ramesh Kumar, 4.9★) ➔ Out for Delivery with Live Sonar Pulse Map ➔ Delivered with OTP.
- **🔒 Immutable Price Tampering Guard**: Frozen model (`Object.freeze`) calculates all cart totals, preventing browser console tampering.
- **📋 Order History Drawer**: Past order logs with 1-click **"Reorder All"** restoration.

---

## 🛠️ Tech Stack

- **Frontend**: Modern Vanilla JavaScript (ES6+), HTML5, CSS3 Custom Properties (Design Tokens), Plus Jakarta Sans, Inter
- **Icons & Animation**: Lucide Icons, GSAP, CSS Keyframes
- **Bundler & Tooling**: Vite v4.4+, Node.js
- **State & Storage**: LocalStorage Persistence with Strict Validation

---

## 📁 Architecture Overview

```
MegaMartWeb/
├── controller/
│   └── controller.js         # Search, category, and catalog filtering
├── model/
│   └── model.js              # Authoritative catalog, stock, and pricing models
├── view/
│   ├── containerView.js      # Main UI controller, event delegation, & cart/order logic
│   ├── headerView.js         # Header and navigation controller
│   └── cartView/             # Cart rendering components
├── public/                   # Static assets & icons
├── index.html                # Semantic HTML layout & modal templates
├── style.css                 # 8pt grid, design system tokens, responsive styling
└── package.json              # Vite scripts & dependencies
```

---

## 🚀 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sahaniTripurari/MegaMartWeb.git
   cd MegaMartWeb
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 👨‍💻 Author
- **Tripurari Sahni** ([@sahaniTripurari](https://github.com/sahaniTripurari))
