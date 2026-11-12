/**
 * MegaMart Autonomous AI Shopping Agent & Recommendation Engine
 * - Strict E-commerce Domain Guardrails & Prompt Injection Immunity
 * - Natural Language Multi-Item Shopping List Parser with Hindi/Hinglish Transliterations
 * - Customer Support & Live 10-Minute Order Tracking
 * - Order History Recall & 1-Click Past Order Reordering Engine
 * - Direct Google Gemini 1.5 Flash REST API Integration with Local Semantic Fallback
 */

// Common Hindi/Hinglish to English Shopping Transliteration Map
const HINDI_TRANSLITERATIONS = {
  'doodh': 'milk',
  'dudh': 'milk',
  'dood': 'milk',
  'anda': 'egg',
  'ande': 'egg',
  'makhan': 'butter',
  'makkhan': 'butter',
  'cheeni': 'sugar',
  'chini': 'sugar',
  'shakar': 'sugar',
  'shakkar': 'sugar',
  'tel': 'oil',
  'sarson': 'mustard',
  'chawal': 'rice',
  'dahi': 'curd',
  'curd': 'curd',
  'yogurt': 'curd',
  'chaas': 'buttermilk',
  'lassi': 'lassi',
  'chai': 'tea',
  'tea': 'tea',
  'patti': 'tea',
  'coffee': 'coffee',
  'namkeen': 'namkeen',
  'bhujia': 'bhujia',
  'biscuit': 'biscuit',
  'biscuits': 'cookie',
  'cookie': 'cookie',
  'cookies': 'cookie',
  'chips': 'chips',
  'kurkure': 'chips',
  'sabun': 'soap',
  'detergent': 'detergent',
  'surf': 'surf',
  'paste': 'toothpaste',
  'colgate': 'toothpaste',
  'shampoo': 'shampoo',
  'paneer': 'paneer',
  'atta': 'atta',
  'aata': 'atta',
  'flour': 'atta',
  'ghee': 'ghee',
  'maggi': 'noodles',
  'maggie': 'noodles',
  'noodles': 'noodles',
  'cold drink': 'cold drinks',
  'colddrink': 'cold drinks',
  'coke': 'coca-cola',
  'pepsi': 'pepsi',
  'sprite': 'sprite',
  'chocolate': 'chocolate',
  'chocolates': 'chocolate',
  'bread': 'bread',
  'pav': 'bread',
  'pyaz': 'onion',
  'pyaaz': 'onion',
  'tamatar': 'tomato',
  'aloo': 'potato',
  'alu': 'potato',
  'apple': 'apple',
  'seb': 'apple',
  'kela': 'banana',
  'banana': 'banana',
  'sneakers': 'sneakers',
  'sneaker': 'sneakers',
  'shoes': 'sneakers',
  'joota': 'sneakers',
  'shirt': 'shirt',
  'tshirt': 't-shirt',
  't-shirt': 't-shirt',
  'jeans': 'jeans',
  'pant': 'jeans',
  'kurta': 'kurta',
  'saree': 'sari',
  'smartwatch': 'smartwatch',
  'watch': 'watch',
  'phone': 'smartphone',
  'mobile': 'smartphone'
};

// E-commerce Domain Guardrail Keywords
const ECOM_DOMAIN_KEYWORDS = [
  'buy', 'shop', 'order', 'cart', 'price', 'product', 'item', 'delivery', 'discount',
  'offer', 'recipe', 'ingredient', 'grocery', 'deal', 'phone', 'mobile', 'electronics',
  'fashion', 'clothes', 'pant', 'shirt', 'dress', 'shoe', 'sneaker', 'milk', 'egg', 'bread',
  'atta', 'rice', 'oil', 'ghee', 'gym', 'protein', 'diet', 'snack', 'tea', 'chai', 'coffee',
  'track', 'status', 'refund', 'return', 'cancel', 'complaint', 'feedback', 'review', 'bill',
  'history', 'recommend', 'suggest', 'fast', 'quick', 'megamart', 'dark store', 'pincode',
  'khana', 'samaan', 'rashan', 'mangwana', 'dawa', 'kharidna', 'batao', 'chahiye', 'kya',
  'reorder', 'purane', 'purana', 'pichla', 'repeat', 'again'
];

// Market Basket Association Rules
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

    // =========================================================================
    // GUARDRAIL 0: CYBERSECURITY & PROMPT INJECTION DEFENSE (Zero-Trust Shield)
    // =========================================================================
    const securityCheck = this.checkSecurityGuardrails(raw);
    if (securityCheck.blocked) {
      return {
        type: 'security_blocked',
        title: '🛡️ MegaMart Security Shield',
        reply: securityCheck.reason,
        suggestions: [
          "Ghar ka rashan mangwao",
          "Mere purane orders reorder karo",
          "Milk, bread & butter shopping list",
          "Paneer Butter Masala recipe kit"
        ]
      };
    }

    // =========================================================================
    // INTENT 1: GREETINGS & CASUAL ONBOARDING (Fast & Polite, No Random Phones!)
    // E.g. "hi", "hello", "namaste", "hey", "kaise ho", "help", "who are you"
    // =========================================================================
    if (this.isGreetingIntent(q)) {
      return this.handleGreeting();
    }

    // =========================================================================
    // INTENT 2: PURCHASE HISTORY & 1-CLICK REORDER PAST ITEMS
    // E.g. "mere purane orders", "pichla order reorder karo", "buy again", "repeat order"
    // =========================================================================
    if (this.isHistoryOrReorderIntent(q)) {
      return this.handleHistoryOrReorder(context);
    }

    // =========================================================================
    // 0. Attempt Serverless / Client Gemini 1.5 Flash Inference (if available)
    // =========================================================================
    const clientGeminiKey = this.getGeminiApiKey();
    if (clientGeminiKey && clientGeminiKey !== 'your_gemini_api_key_here') {
      try {
        const directData = await this.callGeminiDirect(raw, context, clientGeminiKey);
        if (directData) return directData;
      } catch (err) {
        console.warn('[Direct Gemini Call Notice]:', err);
      }
    }

    // Small latency for natural conversational cadence
    await new Promise(r => setTimeout(r, 300));

    // =========================================================================
    // GUARDRAIL 2: STRICT E-COMMERCE DOMAIN CHECK
    // =========================================================================
    if (!this.isECommerceQuery(q)) {
      return {
        type: 'guardrail_reject',
        title: '🛡️ MegaMart Shopping Assistant',
        reply: "Main MegaMart ka dedicated **AI Shopping Assistant** hoon! 😊\n\nMain sirf aapki **shopping, products dhoondhne, multi-item shopping list banane, purane orders reorder karne, aur recipes ke ingredients cart me add karne** me madad kar sakta hoon.\n\nAap mujhse shopping se juda koi bhi sawal pooch sakte hain:",
        suggestions: [
          "Mere purane orders reorder karo",
          "Milk, bread, eggs aur butter list",
          "Paneer Butter Masala recipe kit",
          "Gym ke liye high protein diet"
        ]
      };
    }

    // =========================================================================
    // INTENT 3: NATURAL MULTI-ITEM SHOPPING LIST TO CART
    // E.g. "1kg sugar, milk, bread, butter aur maggi", "buy milk, eggs, bread"
    // =========================================================================
    if (this.isShoppingListIntent(q)) {
      return this.handleShoppingList(raw);
    }

    // =========================================================================
    // INTENT 4: CUSTOMER SUPPORT, ORDER TRACKING & REFUNDS
    // =========================================================================
    if (this.isSupportIntent(q)) {
      return this.handleSupportQuery(q, context);
    }

    // =========================================================================
    // INTENT 5: FEEDBACK & RATINGS
    // =========================================================================
    if (this.isFeedbackIntent(q)) {
      return {
        type: 'feedback_acknowledged',
        title: '⭐ MegaMart Customer Experience',
        reply: "Aapke valuable feedback ke liye bohot shukriya! ❤️\n\nHamara lakshya hai aapko 10 minutes ke andar 100% genuine products deliver karna. Aapka feedback hamare operations team ke sath register ho chuka hai.",
        ratingCard: true
      };
    }

    // =========================================================================
    // INTENT 6: RECIPES & COOKING BUNDLES TO CART
    // E.g. "Paneer Butter Masala recipe", "Masala chai kit", "Biryani"
    // =========================================================================
    if (q.includes('recipe') || q.includes('paneer') || q.includes('biryani') || q.includes('chai') || q.includes('tea') || q.includes('gym') || q.includes('protein')) {
      return this.handleRecipe(q);
    }

    // =========================================================================
    // INTENT 7: GENERAL SMART CATALOG SEARCH & DISCOVERY
    // =========================================================================
    return this.handleGeneralDiscovery(q, raw);
  }

  // --- API Key Resolver ---
  getGeminiApiKey() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const localKey = localStorage.getItem('megamart_gemini_api_key') || localStorage.getItem('gemini_api_key');
        if (localKey && localKey.length > 20) return localKey.trim();
      }
    } catch (e) {}

    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY.trim();
    }
    return '';
  }

  // --- Security & Anti-Hacking Guardrails ---
  checkSecurityGuardrails(text) {
    if (!text) return { blocked: false };

    // 1. Prompt Injection & Jailbreak Patterns
    const injectionPatterns = [
      /ignore\s+(?:all\s+)?(?:previous|above)\s+instructions/i,
      /(?:system\s+prompt|reveal\s+(?:api\s+key|password|secret|token)|jailbreak|dan\s+mode)/i,
      /you\s+are\s+now\s+in\s+developer\s+mode/i,
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
      /union\s+select/i,
      /drop\s+table/i,
      /exec\s*\(/i,
      /curl\s+-/i,
      /wget\s+/i
    ];

    for (const pat of injectionPatterns) {
      if (pat.test(text)) {
        return {
          blocked: true,
          reason: "⚠️ **Security Alert:** Unauthorized instruction or security probe detected. MegaAI strictly operates within safe, isolated e-commerce boundaries to protect user data and system integrity."
        };
      }
    }

    return { blocked: false };
  }

  // --- Intent 1: Greetings & Small Talk ---
  isGreetingIntent(q) {
    const greetings = [
      'hi', 'hello', 'hey', 'namaste', 'namaskar', 'hii', 'hiii', 'helo', 'hola',
      'kaise ho', 'kya haal', 'kya haal hai', 'who are you', 'koun ho', 'kon ho',
      'what can you do', 'help', 'madad', 'good morning', 'good afternoon', 'good evening',
      'yo', 'sup', 'kem cho'
    ];
    return greetings.includes(q) || greetings.some(g => q === g || q.startsWith(g + ' '));
  }

  handleGreeting() {
    return {
      type: 'friendly_greeting',
      title: '✨ MegaAI Shopping Assistant',
      reply: "Namaste! 🙏 Main hoon **MegaAI Shopping Copilot** — aapka personal 10-minute grocery, fashion aur smart shopping assistant!\n\nMain aapki in sabhi cheezon me madad kar sakta hoon:\n• 📝 **Shopping List to Cart:** Saman ki list likhein (jaise: *'1kg sugar, 2 milk, bread aur butter'*) aur main sab ek sath cart me add kar dunga!\n• 🔄 **Reorder Past Orders:** *'Mere purane orders reorder karo'* kehkar pichle order ka saman 1-click me wapas mangwayein.\n• 🍲 **Recipe Bundles:** Paneer Butter Masala ya Desi Masala Chai ke sabhi ingredients direct cart me mangwayein.\n• 🚚 **Live Order Status:** Apne delivery orders ka status live track karein.\n\nAaj aap kya mangwana chahte hain?",
      suggestions: [
        "🔄 Mere purane orders reorder karo",
        "📝 Doodh, bread, anda aur butter list",
        "🍲 Paneer Butter Masala Recipe Kit",
        "⚡ Top discounts & offers"
      ]
    };
  }

  // --- Intent 2: Purchase History & 1-Click Reorder ---
  isHistoryOrReorderIntent(q) {
    return q.includes('purane order') ||
           q.includes('purana order') ||
           q.includes('pichla order') ||
           q.includes('pichle order') ||
           q.includes('reorder') ||
           q.includes('repeat order') ||
           q.includes('buy again') ||
           q.includes('previous order') ||
           q.includes('order history') ||
           q.includes('kya kharida tha') ||
           q.includes('past order') ||
           q.includes('phir se mangwa') ||
           q.includes('wapas mangwa');
  }

  handleHistoryOrReorder(context) {
    let orders = context.orders || [];
    if (!orders || orders.length === 0) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          orders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
        }
      } catch (e) {}
    }

    if (!orders || orders.length === 0) {
      return {
        type: 'guardrail_reject',
        title: '📦 Order History & Reorder',
        reply: "Aapke account me abhi koi completed order history nahi mili hai. 😊\n\nAap abhi hamare fresh daily essentials se apna pehla 10-minute order place kar sakte hain:",
        suggestions: [
          "Amul Gold Milk, Bread & Eggs",
          "Atta, Rice & Cooking Oil",
          "Cold Drinks & Party Snacks",
          "Men's & Women's Fashion"
        ]
      };
    }

    const latestOrder = orders[0];
    const orderId = latestOrder.orderId || latestOrder.order_number || '#MM-226679';
    const orderDate = latestOrder.date ? new Date(latestOrder.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    }) : 'Recent Order';

    const rawItems = latestOrder.items || [];
    if (rawItems.length === 0) {
      return {
        type: 'guardrail_reject',
        title: '📦 Order History',
        reply: `Aapka order **${orderId}** mil gaya par usme items list nahi mili. Aap hamari top categories se shopping continue kar sakte hain.`,
        suggestions: ["Dairy & Bread", "Snacks & Munchies", "Cold Drinks"]
      };
    }

    // Match with current catalog for valid metadata
    const reorderItems = rawItems.map(item => {
      const matched = this.catalog.find(p => {
        const pName = (p.title || p.name || '').toLowerCase();
        const iName = (item.name || item.title || '').toLowerCase();
        return pName === iName || (iName.length > 4 && pName.includes(iName));
      });

      return {
        id: matched ? matched.id : (item.id || item.name),
        name: item.name || item.title || 'Grocery Item',
        unit: item.unit || matched?.unit || '1 unit',
        price: Number(item.price || matched?.discount_price || matched?.price || 99),
        src: item.src || matched?.src || matched?.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
        qty: item.qty || 1
      };
    });

    const totalOrderAmount = reorderItems.reduce((sum, i) => sum + (i.price * i.qty), 0);

    return {
      type: 'past_orders_reorder',
      title: `🔄 Reorder from Order ${orderId}`,
      orderId: orderId,
      orderDate: orderDate,
      reply: `Aapke pichle order **${orderId}** (${orderDate}) me yeh **${reorderItems.length} items** the. Aap poora order 1-click me cart me add kar sakte hain ya single item select kar sakte hain:`,
      items: reorderItems,
      totalPrice: totalOrderAmount,
      actionLabel: `🔄 Reorder All to Cart (₹${totalOrderAmount})`
    };
  }

  // --- Guardrail Checker ---
  isECommerceQuery(text) {
    if (text.length < 3) return false;
    for (const kw of ECOM_DOMAIN_KEYWORDS) {
      if (text.includes(kw)) return true;
    }
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
           text.includes('ye sab') ||
           text.includes('saman') ||
           text.includes('rashan') ||
           text.includes('kharidna') ||
           text.includes('buy ') ||
           text.includes('cart me') ||
           text.includes('chahiye') ||
           text.includes(',') ||
           text.includes(' aur ') ||
           text.includes(' and ');
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

  // --- Handler 3: Multi-Item Shopping List to Interactive Checklist ---
  handleShoppingList(raw) {
    // Strip conversational carrier phrases
    let clean = raw.replace(/(?:ye mere|ye sab|chahiye|add kar do|mangwana hai|saman ki list|rashan list|shopping list|please add|mujhe|aur kuch nahi|in my cart|to cart|cart me|list:)/gi, ' ');

    // Split on commas, newlines, 'aur', 'and', '+'
    const rawTokens = clean.split(/[,;\n\r+]|\baur\b|\band\b/i)
      .map(t => t.trim())
      .filter(t => t.length > 1 && !['gym', 'products', 'items', 'mere', 'sab', 'bhi', 'karo'].includes(t.toLowerCase()));

    const checklistItems = [];
    const unmatched = [];
    const seenProductIds = new Set();

    for (const token of rawTokens) {
      // Parse quantity if provided, e.g. "2 doodh", "1kg sugar", "6 eggs"
      let qty = 1;
      let itemStr = token;

      const qtyMatch = token.match(/^(\d+)\s*(?:kg|g|l|ml|pack|packets|pcs|piece|bottle|box)?\s+(.*)$/i);
      if (qtyMatch) {
        qty = Math.max(1, parseInt(qtyMatch[1], 10) || 1);
        itemStr = qtyMatch[2].trim();
      }

      const matched = this.findBestMatchProduct(itemStr);
      if (matched && !seenProductIds.has(matched.id)) {
        seenProductIds.add(matched.id);
        checklistItems.push({
          requestedText: token,
          product: matched,
          quantity: qty,
          selected: true
        });
      } else if (!matched) {
        unmatched.push(token);
      }
    }

    if (checklistItems.length === 0) {
      return {
        type: 'guardrail_reject',
        title: '📋 MegaAI Shopping List',
        reply: `Maine aapki list me se items khojne ki koshish ki par exact products match nahi huye. Aap sidha rozmarra ke saman likh sakte hain jaise: *"Amul doodh, bread, anda, butter, maggi"*.\n\nYahan daily essentials ke popular options hain:`,
        suggestions: [
          "Milk, Bread, Eggs & Butter",
          "Atta 5kg, Rice 5kg & Ghee",
          "Maggi Noodles & Cold Drinks",
          "Paneer Butter Masala Kit"
        ]
      };
    }

    const total = checklistItems.reduce((s, i) => s + ((i.product.discount_price || i.product.price || 0) * i.quantity), 0);

    return {
      type: 'interactive_checklist',
      title: '📋 MegaAI Smart Shopping Checklist',
      reply: `Aapki shopping list ke anusaar maine **${checklistItems.length} products** match kar diye hain! Aap quantities adjust kar sakte hain aur **"Transfer to Cart"** button click karke direct cart me add kar sakte hain:`,
      checklist: checklistItems,
      unmatched: unmatched,
      totalPrice: total,
      actionLabel: `🛒 Transfer ${checklistItems.length} Items to Cart (₹${total})`
    };
  }

  findBestMatchProduct(keyword) {
    if (!keyword) return null;
    let kw = keyword.toLowerCase().trim();
    if (!kw) return null;

    // 1. Check Hindi/Hinglish Transliteration dictionary
    const transliterated = HINDI_TRANSLITERATIONS[kw] || '';
    const searchTerms = [kw];
    if (transliterated && transliterated !== kw) searchTerms.push(transliterated);

    // Also check word by word in multi-word phrase
    const words = kw.split(/\s+/).filter(w => w.length > 2);
    for (const w of words) {
      if (HINDI_TRANSLITERATIONS[w]) {
        searchTerms.push(HINDI_TRANSLITERATIONS[w]);
      }
    }

    // 2. Direct exact title or substring match
    for (const term of searchTerms) {
      for (const p of this.catalog) {
        const title = (p.title || p.name || '').toLowerCase();
        if (title.includes(term)) return p;
      }
    }

    // 3. Category or description match
    for (const term of searchTerms) {
      for (const p of this.catalog) {
        const cat = (p.category_name || p.type || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        if (cat.includes(term) || desc.includes(term)) {
          return p;
        }
      }
    }

    // 4. Token fuzzy match
    for (const term of searchTerms) {
      const termWords = term.split(/\s+/).filter(w => w.length > 2);
      for (const p of this.catalog) {
        const title = (p.title || p.name || '').toLowerCase();
        if (termWords.some(tw => title.includes(tw))) {
          return p;
        }
      }
    }

    return null;
  }

  // --- Handler 4: Customer Support & Live Orders ---
  handleSupportQuery(q, context) {
    let orders = context.orders || [];
    if (!orders || orders.length === 0) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          orders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
        }
      } catch (e) {}
    }

    if (orders.length > 0) {
      const latest = orders[0];
      const orderId = latest.orderId || latest.order_number || '#MM-226679';
      const orderStatus = latest.order_status || 'Out for 10-Min Delivery';
      const itemsCount = (latest.items || []).length || 2;
      const total = latest.total || latest.total_amount || 499;

      return {
        type: 'order_tracking_card',
        title: `🚚 Live Order Tracking: ${orderId}`,
        reply: `Aapka latest order **${orderId}** active hai!\n\n` +
               `• **Status:** ${orderStatus}\n` +
               `• **Items:** ${itemsCount} items (₹${total})\n` +
               `• **Delivery Partner:** Ramesh Kumar (⚡ 4 Mins Away)\n` +
               `• **Live ETA:** In transit from Express Dark-Store.`,
        orderData: latest
      };
    }

    return {
      type: 'support_info',
      title: '🛎️ MegaMart Customer Resolution Center',
      reply: "MegaMart 10-minute dark-store express guarantee ke sath aata hai:\n\n" +
             "1. **Delivery Delay:** Agar 10 min se late ho toh instant ₹50 MegaCoins wallet me credit hote hain.\n" +
             "2. **Refund / Damaged Items:** Doorstep instant verification aur 1-click refund to source payment.\n" +
             "3. **Order Cancellation:** Dark store dispatch se pehle cancel karne par zero cancellation fee.\n\n" +
             "Aapko kisi specific order me dikkat hai ya live status track karna hai?"
    };
  }

  // --- Handler 5: Recipe Kits ---
  handleRecipe(q) {
    if (q.includes('paneer') || q.includes('butter masala')) {
      const items = this.findProductsByKeywords(['paneer', 'butter', 'ghee', 'cream', 'atta']);
      const selected = items.slice(0, 4);
      return {
        type: 'recipe_bundle',
        title: '🍲 Chef AI: Paneer Butter Masala Kit (Serves 4)',
        reply: "Hotel-style Paneer Butter Masala ke liye fresh Malai Paneer, Amul Butter, pure Cow Ghee aur Chakki Atta ka perfect bundle:",
        actionLabel: 'Add Recipe Ingredients to Cart',
        items: selected,
        totalPrice: selected.reduce((s, i) => s + (i.discount_price || i.price || 0), 0)
      };
    }

    if (q.includes('chai') || q.includes('tea')) {
      const chaiItems = this.findProductsByKeywords(['tea', 'chai', 'biscuit', 'rusk', 'namkeen']);
      const selected = chaiItems.slice(0, 4);
      return {
        type: 'recipe_bundle',
        title: '☕ Desi Masala Chai & Evening Snacks Kit',
        reply: "Kadak Masala Chai aur shaam ke snacks ke liye fresh tea pack, crispy cookies aur namkeen:",
        actionLabel: 'Add Chai & Snacks to Cart',
        items: selected,
        totalPrice: selected.reduce((s, i) => s + (i.discount_price || i.price || 0), 0)
      };
    }

    if (q.includes('gym') || q.includes('protein')) {
      const gymItems = this.findProductsByKeywords(['egg', 'peanut butter', 'oats', 'milk', 'paneer']);
      const selected = gymItems.slice(0, 4);
      return {
        type: 'recipe_bundle',
        title: '💪 High-Protein Muscle Fuel Pack',
        reply: "Daily gym workout & fitness diet ke liye high protein essentials (Farm eggs, peanut butter, rolled oats aur fresh milk):",
        actionLabel: 'Add Gym Nutrition Pack to Cart',
        items: selected,
        totalPrice: selected.reduce((s, i) => s + (i.discount_price || i.price || 0), 0)
      };
    }

    const dailyItems = this.findProductsByKeywords(['milk', 'bread', 'butter', 'egg']);
    const selected = dailyItems.slice(0, 4);
    return {
      type: 'recipe_bundle',
      title: '🍳 Quick Breakfast Essentials Pack',
      reply: "Fast 10-minute morning breakfast ke liye fresh milk, soft bread, farm eggs aur butter ka complete pack:",
      actionLabel: 'Add Breakfast Pack to Cart',
      items: selected,
      totalPrice: selected.reduce((s, i) => s + (i.discount_price || i.price || 0), 0)
    };
  }

  // --- Handler 6: General Catalog Discovery ---
  handleGeneralDiscovery(q, raw) {
    const tokens = q.split(/\s+/).filter(w => w.length > 2);
    const items = this.findProductsByKeywords(tokens);

    if (items.length > 0) {
      const selected = items.slice(0, 4);
      return {
        type: 'custom_search',
        title: `✨ MegaAI Matches for "${raw}"`,
        reply: `Maine aapke liye **${items.length} relevant products** dhoondhe hain:`,
        actionLabel: 'Add All to Cart',
        items: selected,
        totalPrice: selected.reduce((s, i) => s + (i.discount_price || i.price || 0), 0)
      };
    }

    // Never dump expensive smartphones when query has no matches!
    return {
      type: 'guardrail_reject',
      title: '✨ MegaAI Shopping Assistant',
      reply: `Mujhe "${raw}" se match hota koi specific product nahi mila. Aap spelling check kar sakte hain, ya niche diye gaye categories me se chun sakte hain:`,
      suggestions: [
        "Dairy, Bread & Eggs",
        "Cold Drinks & Juices",
        "Snacks & Munchies",
        "Fashion & Apparel",
        "Electronics & Gadgets"
      ]
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

  /**
   * Direct Google Gemini 1.5 Flash Inference (Client-Side)
   */
  async callGeminiDirect(userMessage, context, apiKey) {
    // Use official Gemini 1.5 Flash model
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const systemPrompt = `You are MegaAI, the official autonomous AI Shopping Assistant for MegaMart (an Indian 10-minute quick-commerce delivery platform like Blinkit/Zepto).
RULES:
1. STRICT E-COMMERCE GUARDRAIL: You ONLY answer questions related to shopping, products, groceries, meal recipes, ingredients, gym/fitness nutrition, prices, discounts, order tracking, returns, and customer feedback.
2. If non-shopping, set intentType: "guardrail_reject".
3. If the user is greeting or saying hi/hello, set intentType: "friendly_greeting" with an engaging Indian quick-commerce welcome. DO NOT dump product lists on greetings!
4. If shopping list, set intentType: "interactive_checklist" and list items in "itemsToSearch".
5. If reorder or past order request, set intentType: "past_orders_reorder".
6. If recipe, set intentType: "recipe_bundle" and list ingredients in "itemsToSearch".
7. If order status, set intentType: "order_support".
Output strictly valid JSON with keys: intentType, title, reply, itemsToSearch, actionLabel.`;

    const payload = {
      contents: [{
        parts: [{
          text: `User Query: "${userMessage}"\nActive Orders: ${(context?.orders || []).length}\nCart Items: ${(context?.cart || []).length}`
        }]
      }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) return null;
    const data = await res.json();
    let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    let parsed = null;
    try {
      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        parsed = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      } else {
        parsed = JSON.parse(rawText);
      }
    } catch (parseErr) {
      console.warn('[Gemini JSON Parse Error]:', parseErr);
      return null;
    }

    if (!parsed) return null;

    if (parsed.intentType === 'guardrail_reject') {
      return {
        success: true,
        engine: 'Google Gemini 1.5 Flash (Direct API)',
        type: 'guardrail_reject',
        title: parsed.title || '🛡️ MegaMart AI Shopping Assistant',
        reply: parsed.reply,
        suggestions: [
          "Ghar ka rashan list banao",
          "Mere purane orders reorder karo",
          "Gym ke liye high protein products",
          "Best smartphones under 70k"
        ]
      };
    }

    if (parsed.intentType === 'friendly_greeting') {
      return {
        success: true,
        engine: 'Google Gemini 1.5 Flash (Direct API)',
        type: 'friendly_greeting',
        title: parsed.title || '✨ MegaAI Shopping Assistant',
        reply: parsed.reply || 'Namaste! Main MegaMart ka AI Shopping Assistant hoon. Main aapki shopping me kaise madad kar sakta hoon?',
        suggestions: [
          "🔄 Mere purane orders reorder karo",
          "📝 Doodh, bread, anda aur butter list",
          "🍲 Paneer Butter Masala Recipe Kit",
          "⚡ Top deals & offers"
        ]
      };
    }

    if (parsed.intentType === 'past_orders_reorder') {
      return this.handleHistoryOrReorder(context);
    }

    // Match items with this.catalog
    const matchedProducts = [];
    const checklist = [];
    const seenIds = new Set();
    const searchTerms = parsed.itemsToSearch || parsed.items || [];

    for (const itemKw of searchTerms) {
      const kw = (typeof itemKw === 'string' ? itemKw : itemKw.name || itemKw.title || '').toLowerCase().trim();
      if (!kw) continue;
      const matched = this.findBestMatchProduct(kw);
      if (matched && !seenIds.has(matched.id)) {
        seenIds.add(matched.id);
        matchedProducts.push(matched);
        checklist.push({
          requestedText: typeof itemKw === 'string' ? itemKw : itemKw.name || itemKw.title,
          product: matched,
          quantity: 1,
          selected: true
        });
      }
    }

    const total = matchedProducts.reduce((sum, p) => sum + Number(p.discount_price || p.price || 0), 0);

    if ((parsed.intentType === 'interactive_checklist' || parsed.intentType === 'shopping_list' || checklist.length > 1) && checklist.length > 0) {
      return {
        success: true,
        engine: 'Google Gemini 1.5 Flash (Direct API)',
        type: 'interactive_checklist',
        title: parsed.title || '📋 MegaAI Smart Shopping Checklist',
        reply: parsed.reply || 'Aapki shopping list ke products ready hain:',
        checklist: checklist,
        totalPrice: total,
        actionLabel: parsed.actionLabel || `Transfer ${checklist.length} Items to Cart (₹${total})`
      };
    }

    if (matchedProducts.length > 0) {
      return {
        success: true,
        engine: 'Google Gemini 1.5 Flash (Direct API)',
        type: parsed.intentType || 'product_recommendation',
        title: parsed.title || '✨ MegaAI Recommended Products',
        reply: parsed.reply || 'Maine aapke liye top-rated products select kiye hain:',
        items: matchedProducts.slice(0, 5),
        totalPrice: total,
        actionLabel: parsed.actionLabel || `Add All to Cart (₹${total})`
      };
    }

    return {
      success: true,
      engine: 'Google Gemini 1.5 Flash (Direct API)',
      type: 'friendly_greeting',
      title: parsed.title || '✨ MegaAI Shopping Assistant',
      reply: parsed.reply || 'Aap mujhse grocery items mangwa sakte hain ya recipes pooch sakte hain!',
      suggestions: [
        "🔄 Mere purane orders reorder karo",
        "📝 Doodh, bread aur butter list",
        "🍲 Paneer Butter Masala Kit"
      ]
    };
  }
}
