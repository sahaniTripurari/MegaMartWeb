# 🛒 MegaMart - Flagship Quick-Commerce E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Demo-Live_Website-22c55e?style=for-the-badge&logo=render)](https://megamart-iyre.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/sahaniTripurari/MegaMartWeb)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=vite)](https://vitejs.dev/)

MegaMart is a production-grade, fast, and responsive Quick-Commerce grocery & essentials web platform inspired by modern architectures like Zepto, Blinkit, and Instacart. Engineered with clean MVC patterns, real-time cart intelligence, live interactive 5-stage order tracking, and ironclad client-side security guards.

---

## 🌟 Flagship Features

### 🛒 1. Advanced Cart & Checkout Intelligence
- **Dynamic Free Delivery Progress Bar**: Live calculation displaying *"Add ₹X more to get FREE Delivery"* up to the ₹499 threshold with emerald unlocked celebrations.
- **Slide-over Checkout Drawer**: Address verification (Name, Phone, Address, PIN), coupon discounts (`MEGA50`, `WELCOME10`), and multi-payment selection (UPI, Credit/Debit Card, COD).
- **Persistent LocalStorage State**: Real-time two-way synchronization ensures cart state is never lost on refresh.

### 📍 2. Live Interactive Order Tracking (5-Stage Stepper)
- **Real-time Status Stepper**:
  1. **Order Placed**: Timestamp & dark store routing verification.
  2. **Packed at Dark Store**: Dark store fulfillment inspection.
  3. **Rider Assigned**: Partner profile (**Ramesh Kumar**, Hero Electric Scooter `MH-02-EK-4821`, 4.9★).
  4. **Out for Delivery**: Live radar sonar pulse animation with dynamic street status indicator (`Passing Linking Road • 320m away`).
  5. **Delivered**: OTP verification simulation (`OTP 4829 Verified`).
- **Simulated Progression**: Interactive stage stepping (`⏮` / `⏭` / `🔄`) + auto 20-second demo timer.

### ❤️ 3. Wishlist / Favorites Engine
- **Heart Micro-interactions**: Smooth `@keyframes heartPop` active/inactive toggle on all product cards.
- **Live Badge Counters**: Synced counter across desktop header, mobile header, and bottom navigation.
- **Wishlist Drawer**: Dedicated sidebar with individual "Move to Cart" and bulk "Move All to Cart" actions.

### ⭐ 4. Star Ratings & Verified Reviews
- **Card Rating Badges**: `★ 4.8 (120+)` badges on every catalog item.
- **Product Detail Breakdown**: 5-star customer distribution bars with verified buyer reviews.

### 🔍 5. Search, Filter & Multi-Sort Engine
- **Live Debounced Search (300ms)**: Instant filtering without page reload or lag.
- **Comprehensive Sorting**: Featured, Price: Low to High, Price: High to Low, and Biggest Discount.
- **Pill Tag Filters**: All, Fresh (Fruits/Vegetables/Herbs), Bestseller, and Under ₹50.

### 🔍 6. Enhanced Product Details
- **Mouse-Tracking Zoom**: Smooth 1.45x magnification tracking cursor position.
- **Specifications Grid**: Shelf life, Country of origin, Storage advice, and FSSAI Hygiene certification.
- **"Customers Also Bought" Carousel**: Interactive companion recommendations with horizontal navigation controls.

### 🛡️ 7. Inventory & Ironclad Security
- **Urgency Badges**: Automatic `🔥 Only X left!` badges when item stock drops to 5 or lower.
- **Price Tampering Guard**: Immutable frozen catalog (`Object.freeze`) lookup prevents DOM manipulation or client price spoofing.
- **Order History Drawer**: Full past orders archive with 1-click **"Reorder All"** restoration.

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
│   └── cartView/             # Legacy cart rendering components
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
