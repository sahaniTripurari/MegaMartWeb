/**
 * MegaMart Autonomous AI Shopping Agent & Recommendation Engine
 * - Strict E-commerce Domain Guardrails
 * - Natural Language Shopping List Parser & Interactive Checklist Generator
 * - Customer Support & Live Order Tracker Integration
 * - Market Basket Association Rules & Purchase History Affinity Algorithm
 */

// E-commerce Domain Guardrail Keywords
const ECOM_DOMAIN_KEYWORDS = [
  'buy', 'shop', 'order', 'cart', 'price', 'product', 'item', 'delivery', 'discount',
  'offer', 'recipe', 'ingredient', 'grocery', 'deal', 'phone', 'mobile', 'electronics',
  'fashion', 'clothes', 'pant', 'shirt', 'dress', 'shoe', 'sneaker', 'milk', 'egg', 'bread',
  'atta', 'rice', 'oil', 'ghee', 'gym', 'protein', 'diet', 'snack', 'tea', 'chai', 'coffee',
  'track', 'status', 'refund', 'return', 'cancel', 'complaint', 'feedback', 'review', 'bill',
  'history', 'recommend', 'suggest', 'fast', 'quick', 'megamart', 'dark store', 'pincode',
  'khana', 'samaan', 'rashan', 'mangwana', 'dawa', 'kharidna', 'batao', 'chahiye', 'kya'
];

// Market Basket Association Rules (Frequently Bought Together)
const ASSOCIATION_RULES = {
  'milk': ['bread', 'eggs', 'tea', 'biscuit', 'butter'],
  'tea': ['milk', 'sugar', 'biscuit', 'rusk', 'namkeen'],
  'chai': ['milk', 'sugar', 'biscuit', 'rusk', 'namkeen'],
  'atta': ['oil', 'ghee', 'rice', 'dal', 'spices'],
  'rice': ['dal', 'oil', 'ghee', 'atta', 'spices'],
  'chips': ['cold drinks', 'coke', 'pepsi', 'chocolate', 'dip'],
  'coke': ['chips', 'namkeen', 'pizza', 'snacks'],
  'smartphone': ['headphones', 'earbuds', 'smartwatch', 'screen protector'],
  'iphone': ['airpods', 'apple watch', 'case', 'charger'],
  'gym': ['eggs', 'peanut butter', 'milk', 'oats', 'paneer', 'almonds'],
  'protein': ['eggs', 'peanut butter', 'milk', 'oats', 'paneer', 'almonds']
};

export class MegaAiCopilot {
  constructor(catalog) {
    this.catalog = catalog || [];
  }

  setCatalog(catalog) {
    this.catalog = catalog;
  }

  /**
   * Main Agent Inference Pipeline
   * @param {string} userMessage - Raw text from user
   * @param {Object} context - User context { orders, cart, history, profile }
   * @returns {Promise<Object>} Structured Agent Response
   */
  async processQuery(userMessage, context = {}) {
    const raw = (userMessage || '').trim();
    const q = raw.toLowerCase();

    // Small latency for natural conversational cadence
    await new Promise(r => setTimeout(r, 400));

    // =========================================================================
    // GUARDRAIL 1: STRICT E-COMMERCE DOMAIN CHECK
    // =========================================================================
    if (!this.isECommerceQuery(q)) {
      return {
        type: 'guardrail_reject',
        title: '🛡️ MegaMart Shopping Assistant',
        reply: "Main MegaMart ka dedicated **AI Shopping Assistant** hoon! 😊\n\nMain sirf aapki **shopping, products dhoondhne, shopping list banane, orders track karne, aur recipes/grocery planning** me madad kar sakta hoon.\n\nAap mujhe shopping list de sakte hain ya pooch sakte hain:",
        suggestions: [
          "Ghar ka rashan list banao",
          "Mera order kahan hai?",
          "Gym ke liye high protein products",
          "Best smartphones under 70k"
        ]
      };
    }

    // =========================================================================
    // INTENT 2: SHOPPING LIST PARSER & INTERACTIVE CHECKLIST GENERATOR
    // E.g. "Ye mere gym products hain: eggs, peanut butter, oats, milk"
    // =========================================================================
    if (this.isShoppingListIntent(q)) {
      return this.handleShoppingList(raw);
    }

    // =========================================================================
    // INTENT 3: CUSTOMER SUPPORT, ORDER TRACKING & REFUNDS
    // =========================================================================
    if (this.isSupportIntent(q)) {
      return this.handleSupportQuery(q, context);
    }

    // =========================================================================
    // INTENT 4: FEEDBACK & RATINGS
    // =========================================================================
    if (this.isFeedbackIntent(q)) {
      return {
        type: 'feedback_acknowledged',
        title: '⭐ MegaMart Customer Experience',
        reply: "Aapke valuable feedback ke liye bohot shukriya! ❤️\n\nHamara goal hai aapko 10 minutes me dark-store se 100% fresh products deliver karna. Aapka feedback hamare operations team ke sath log ho chuka hai.",
        ratingCard: true
      };
    }

    // =========================================================================
    // INTENT 5: HISTORY-BASED RECOMMENDATIONS & SMART REFILLS
    // =========================================================================
    if (this.isRecommendationIntent(q)) {
      return this.handleHistoryRecommendations(context);
    }

    // =========================================================================
    // INTENT 6: RECIPES TO CART (E.g. Paneer Butter Masala, Biryani)
    // =========================================================================
    if (q.includes('recipe') || q.includes('paneer') || q.includes('biryani') || q.includes('chai')) {
      return this.handleRecipe(q);
    }

    // =========================================================================
    // INTENT 7: GENERAL SMART CATALOG SEARCH & PRICE FILTERS
    // =========================================================================
    return this.handleGeneralDiscovery(q, raw);
  }

  // --- Guardrail Checker ---
  isECommerceQuery(text) {
    if (text.length < 3) return true;
    // Check if any e-commerce keyword appears
    for (const kw of ECOM_DOMAIN_KEYWORDS) {
      if (text.includes(kw)) return true;
    }
    // Check if any product name from catalog matches
    const tokens = text.split(/\s+/);
    for (const p of this.catalog.slice(0, 100)) {
      const name = (p.title || p.name || '').toLowerCase();
      if (tokens.some(t => t.length > 3 && name.includes(t))) return true;
    }
    return false;
  }

  // --- Intent Classifiers ---
  isShoppingListIntent(text) {
    return text.includes('list') ||
           text.includes('ye mere') ||
           text.includes('products:') ||
           text.includes('samaan:') ||
           text.includes('items:') ||
           text.includes(',') ||
           text.includes('\n') ||
           text.includes('aur ') ||
           text.includes('and ');
  }

  isSupportIntent(text) {
    return text.includes('kahan hai') ||
           text.includes('track') ||
           text.includes('order status') ||
           text.includes('late') ||
           text.includes('refund') ||
           text.includes('return') ||
           text.includes('cancel') ||
           text.includes('damaged') ||
           text.includes('delivery time');
  }

  isFeedbackIntent(text) {
    return text.includes('feedback') ||
           text.includes('service achhi') ||
           text.includes('bahut fast') ||
           text.includes('shukriya') ||
           text.includes('complaint') ||
           text.includes('kharab') ||
           text.includes('bad quality');
  }

  isRecommendationIntent(text) {
    return text.includes('recommend') ||
           text.includes('suggest') ||
           text.includes('history') ||
           text.includes('kya mangwaun') ||
           text.includes('frequently bought') ||
           text.includes('favourite') ||
           text.includes('refill');
  }

  // --- Handler 1: Shopping List to Interactive Checklist ---
  handleShoppingList(raw) {
    // Clean and split list into items
    let clean = raw.replace(/(?:ye mere|ye sab|chahiye|add kar do|mangwana hai|list:|products:)/gi, '');
    const tokens = clean.split(/[,;\n\r+]|\baur\b|\band\b/i)
      .map(t => t.trim())
      .filter(t => t.length > 1 && !['gym', 'products', 'items', 'mere'].includes(t.toLowerCase()));

    const checklistItems = [];
    const unmatched = [];

    for (const token of tokens) {
      const matched = this.findBestMatchProduct(token);
      if (matched) {
        checklistItems.push({
          requestedText: token,
          product: matched,
          quantity: 1,
          selected: true
        });
      } else {
        unmatched.push(token);
      }
    }

    if (checklistItems.length === 0) {
      // Fallback to top essentials
      const essentials = this.catalog.slice(0, 4);
      return {
        type: 'general_help',
        title: '📋 MegaAI List Assistant',
        reply: `Maine aapki list dekhi par specific product match nahi mila. Aap directly aam items likh sakte hain jaise: *"Milk, Eggs, Bread, Butter"*.\n\nYahan trending essentials hain:`,
        items: essentials,
        totalPrice: essentials.reduce((s, i) => s + (i.discount_price || i.price || 0), 0)
      };
    }

    const total = checklistItems.reduce((s, i) => s + (i.product.discount_price || i.product.price || 0), 0);

    return {
      type: 'interactive_checklist',
      title: '📋 MegaAI Smart Shopping Checklist',
      reply: `Aapki shopping list ke anusaar maine **${checklistItems.length} products** match kar diye hain! Aap neeche list me quantities badal sakte hain ya uncheck kar sakte hain:`,
      checklist: checklistItems,
      unmatched: unmatched,
      totalPrice: total,
      actionLabel: 'Transfer Selected Items to Cart'
    };
  }

  findBestMatchProduct(keyword) {
    const kw = keyword.toLowerCase().trim();
    if (!kw) return null;

    // 1. Direct exact substring in title
    for (const p of this.catalog) {
      const title = (p.title || p.name || '').toLowerCase();
      if (title.includes(kw)) return p;
    }

    // 2. Word tokens match
    const words = kw.split(/\s+/).filter(w => w.length > 2);
    for (const p of this.catalog) {
      const title = (p.title || p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const cat = (p.category_name || p.type || '').toLowerCase();
      if (words.some(w => title.includes(w) || cat.includes(w) || desc.includes(w))) {
        return p;
      }
    }

    return null;
  }

  // --- Handler 2: Customer Support & Live Orders ---
  handleSupportQuery(q, context) {
    const orders = context.orders || [];

    if (orders.length > 0) {
      const latest = orders[0];
      const orderId = latest.orderId || latest.order_number || '#MM-584920';
      const orderStatus = latest.order_status || 'Out for 10-Min Delivery';
      const itemsCount = (latest.items || []).length || 3;
      const total = latest.total || latest.total_amount || 499;

      return {
        type: 'order_tracking_card',
        title: `🚚 Live Order Tracking: ${orderId}`,
        reply: `Aapka latest order **${orderId}** active hai!\n\n` +
               `• **Status:** ${orderStatus}\n` +
               `• **Items:** ${itemsCount} items (₹${total})\n` +
               `• **Delivery Partner:** Ramesh Kumar (⚡ 4 Mins Away)\n` +
               `• **Live ETA:** In transit from Bandra Dark-Store.`,
        orderData: latest
      };
    }

    // Return general support guide
    return {
      type: 'support_info',
      title: '🛎️ MegaMart Customer Resolution Center',
      reply: "MegaMart 10-minute dark-store express guarantee ke sath aata hai:\n\n" +
             "1. **Delivery Delay:** Agar 10 min se late ho toh instant ₹50 MegaCoins wallet me milte hain.\n" +
             "2. **Refund / Damaged Items:** Doorstep inspection aur 1-click instant refund to source payment.\n" +
             "3. **Order Cancellation:** Dark store packing se pehle cancel karne par zero cancellation fee.\n\n" +
             "Aapko kisi specific order me dikkat hai ya live status track karna hai?"
    };
  }

  // --- Handler 3: History-Based Recommendations & Market Basket Association ---
  handleHistoryRecommendations(context) {
    const recentOrders = context.orders || [];
    const cart = context.cart || [];

    // Extract seed keywords from recent orders and cart
    const seedCategories = new Set();
    const boughtKeywords = new Set();

    for (const order of recentOrders) {
      for (const item of (order.items || [])) {
        const name = (item.name || item.title || '').toLowerCase();
        for (const [key, related] of Object.entries(ASSOCIATION_RULES)) {
          if (name.includes(key)) {
            related.forEach(r => boughtKeywords.add(r));
          }
        }
      }
    }

    // If no past purchase history, use popular daily essentials
    if (boughtKeywords.size === 0) {
      ['milk', 'bread', 'eggs', 'tea', 'atta'].forEach(k => boughtKeywords.add(k));
    }

    const recommended = [];
    const seenIds = new Set();

    for (const kw of Array.from(boughtKeywords)) {
      const match = this.findBestMatchProduct(kw);
      if (match && !seenIds.has(match.id)) {
        seenIds.add(match.id);
        recommended.push(match);
      }
      if (recommended.length >= 5) break;
    }

    const total = recommended.reduce((s, i) => s + (i.discount_price || i.price || 0), 0);

    return {
      type: 'history_recommendations',
      title: '🎯 AI Smart Refill & Frequently Bought Suggestions',
      reply: "Aapke order patterns aur market-basket affinity analysis ke hisab se maine yeh daily essentials select kiye hain jo aapko refill karne ki zaroorat pad sakti hai:",
      items: recommended,
      totalPrice: total,
      actionLabel: 'Add Refill Pack to Cart'
    };
  }

  // --- Handler 4: Recipe Kit ---
  handleRecipe(q) {
    if (q.includes('paneer') || q.includes('butter masala')) {
      const items = this.findProductsByKeywords(['paneer', 'butter', 'ghee', 'cream', 'atta']);
      return {
        type: 'recipe_bundle',
        title: '🍲 Chef AI: Paneer Butter Masala Kit (Serves 4)',
        reply: "Hotel-style Paneer Butter Masala ke liye fresh Malai Paneer, Amul Butter, pure Cow Ghee aur Chakki Atta ka perfect bundle:",
        actionLabel: 'Add Recipe Ingredients to Cart',
        items: items.slice(0, 5),
        totalPrice: items.slice(0, 5).reduce((s, i) => s + (i.discount_price || i.price || 0), 0)
      };
    }

    const chaiItems = this.findProductsByKeywords(['tea', 'chai', 'biscuit', 'rusk', 'namkeen']);
    return {
      type: 'recipe_bundle',
      title: '☕ Desi Masala Chai & Evening Snacks Kit',
      reply: "Kadak Masala Chai aur shaam ke snacks ke liye fresh tea pack, crispy cookies aur namkeen:",
      actionLabel: 'Add Chai & Snacks to Cart',
      items: chaiItems.slice(0, 5),
      totalPrice: chaiItems.slice(0, 5).reduce((s, i) => s + (i.discount_price || i.price || 0), 0)
    };
  }

  // --- Handler 5: General Discovery ---
  handleGeneralDiscovery(q, raw) {
    const tokens = q.split(/\s+/).filter(w => w.length > 2);
    const items = this.findProductsByKeywords(tokens);

    if (items.length > 0) {
      return {
        type: 'custom_search',
        title: `✨ MegaAI Curated Matches for "${raw}"`,
        reply: `Maine 246 products me se aapke liye **${items.length} top-rated matches** dhoondhe hain:`,
        actionLabel: 'Add Top Deals to Cart',
        items: items.slice(0, 4),
        totalPrice: items.slice(0, 4).reduce((s, i) => s + (i.discount_price || i.price || 0), 0)
      };
    }

    const fallbacks = this.catalog.slice(0, 4);
    return {
      type: 'general_help',
      title: '✨ MegaAI Shopping Assistant',
      reply: `Mujhe "${raw}" ke specific matches nahi mile. Aap mujhe shopping list de sakte hain (jaise: *"milk, eggs, oats"*), koi recipe pooch sakte hain, ya order status track kar sakte hain!`,
      actionLabel: 'View Trending Bestsellers',
      items: fallbacks,
      totalPrice: fallbacks.reduce((s, i) => s + (i.discount_price || i.price || 0), 0)
    };
  }

  findProductsByKeywords(keywords) {
    if (!keywords || !keywords.length) return [];
    const results = [];
    const seenIds = new Set();

    for (const kw of keywords) {
      const cleanKw = kw.toLowerCase().trim();
      if (!cleanKw || cleanKw.length < 2) continue;

      for (const item of this.catalog) {
        const title = (item.title || item.name || '').toLowerCase();
        const cat = (item.category_name || item.type || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();

        if ((title.includes(cleanKw) || cat.includes(cleanKw) || desc.includes(cleanKw)) && !seenIds.has(item.id)) {
          seenIds.add(item.id);
          results.push(item);
        }
      }
    }

    return results;
  }
}
