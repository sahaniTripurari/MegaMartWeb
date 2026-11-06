/**
 * MegaMart AI Semantic Search Engine
 * Maps natural language intent to semantic products across 246 items in Supabase.
 */

const INTENT_KNOWLEDGE_BASE = {
  // Recipes & Meals
  'paneer': {
    category: 'Dairy, Bread & Eggs',
    related: ['Staples, Atta & Oil', 'Snacks & Munchies'],
    keywords: ['paneer', 'butter', 'masala', 'milk', 'cream', 'curd', 'ghee']
  },
  'tea': {
    category: 'Cold Drinks & Beverages',
    related: ['Snacks & Munchies', 'Dairy, Bread & Eggs'],
    keywords: ['tea', 'chai', 'biscuit', 'cookie', 'rusk', 'milk', 'sugar']
  },
  'chai': {
    category: 'Cold Drinks & Beverages',
    related: ['Snacks & Munchies', 'Dairy, Bread & Eggs'],
    keywords: ['tea', 'chai', 'biscuit', 'cookie', 'rusk', 'milk']
  },
  'coffee': {
    category: 'Cold Drinks & Beverages',
    related: ['Dairy, Bread & Eggs', 'Snacks & Munchies'],
    keywords: ['coffee', 'nescafe', 'milk', 'cookie']
  },
  'gym': {
    category: 'Dairy, Bread & Eggs',
    related: ['Cold Drinks & Beverages', 'Staples, Atta & Oil'],
    keywords: ['protein', 'milk', 'egg', 'peanut', 'almond', 'oats', 'ghee', 'curd']
  },
  'protein': {
    category: 'Dairy, Bread & Eggs',
    related: ['Staples, Atta & Oil'],
    keywords: ['egg', 'milk', 'curd', 'peanut', 'almond', 'dal', 'paneer']
  },
  'breakfast': {
    category: 'Dairy, Bread & Eggs',
    related: ['Cold Drinks & Beverages', 'Snacks & Munchies'],
    keywords: ['bread', 'butter', 'egg', 'milk', 'jam', 'tea', 'coffee', 'oats']
  },
  'diet': {
    category: 'Dairy, Bread & Eggs',
    related: ['Staples, Atta & Oil'],
    keywords: ['organic', 'green', 'almond', 'curd', 'atta', 'oil']
  },
  'snack': {
    category: 'Snacks & Munchies',
    related: ['Cold Drinks & Beverages'],
    keywords: ['chips', 'namkeen', 'biscuit', 'chocolate', 'kurkure', 'lays']
  },
  'munchies': {
    category: 'Snacks & Munchies',
    related: ['Cold Drinks & Beverages'],
    keywords: ['chips', 'namkeen', 'biscuit', 'chocolate']
  },
  'phone': {
    category: 'Electronics & Gadgets',
    related: ['Electronics & Gadgets'],
    keywords: ['iphone', 'galaxy', 'smartphone', 'oneplus', 'redmi', 'mobile']
  },
  'audio': {
    category: 'Electronics & Gadgets',
    related: ['Electronics & Gadgets'],
    keywords: ['headphone', 'earbuds', 'sony', 'airpods', 'sound', 'speaker']
  },
  'party': {
    category: 'Cold Drinks & Beverages',
    related: ['Snacks & Munchies'],
    keywords: ['coke', 'pepsi', 'sprite', 'chips', 'namkeen', 'soda']
  },
  'summer': {
    category: 'Cold Drinks & Beverages',
    related: ['Fashion & Apparel'],
    keywords: ['juice', 'coke', 'soda', 't-shirt', 'sunscreen', 'shorts']
  },
  'clean': {
    category: 'House Hold',
    related: ['Beauty & Personal Care'],
    keywords: ['detergent', 'surf', 'harpic', 'vim', 'colin', 'soap']
  }
};

/**
 * Perform semantic search across product catalog
 * @param {string} query - Natural language search phrase
 * @param {Array} catalog - Full list of products
 * @returns {Object} { matches: Array, semanticIntent: string, confidence: number }
 */
export function executeSemanticSearch(query, catalog) {
  if (!query || !catalog || !catalog.length) {
    return { matches: [], semanticIntent: null, confidence: 0 };
  }

  const cleanQuery = query.toLowerCase().trim();
  const tokens = cleanQuery.split(/\s+/);
  
  // 1. Direct keyword match check first
  const exactMatches = catalog.filter(item => {
    const title = (item.title || item.name || '').toLowerCase();
    const cat = (item.category_name || item.type || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    return cleanQuery.split(' ').every(t => title.includes(t) || cat.includes(t) || desc.includes(t));
  });

  if (exactMatches.length >= 3) {
    return {
      matches: exactMatches,
      semanticIntent: 'Direct Match',
      confidence: 0.98
    };
  }

  // 2. Identify semantic intent from knowledge base
  let detectedIntent = null;
  let relevantKeywords = [];
  let priorityCategory = null;

  for (const token of tokens) {
    for (const [key, mapping] of Object.entries(INTENT_KNOWLEDGE_BASE)) {
      if (token.includes(key) || key.includes(token)) {
        detectedIntent = key;
        relevantKeywords.push(...mapping.keywords);
        priorityCategory = mapping.category;
        break;
      }
    }
    if (detectedIntent) break;
  }

  // 3. Fallback semantic scoring
  const scoredProducts = catalog.map(product => {
    const title = (product.title || product.name || '').toLowerCase();
    const cat = (product.category_name || product.type || '').toLowerCase();
    const desc = (product.description || '').toLowerCase();
    let score = 0;

    // Check token matches
    for (const token of tokens) {
      if (token.length < 2) continue;
      if (title.includes(token)) score += 15;
      if (cat.includes(token)) score += 8;
      if (desc.includes(token)) score += 5;
    }

    // Check semantic keyword boost
    for (const kw of relevantKeywords) {
      if (title.includes(kw)) score += 12;
      if (desc.includes(kw)) score += 6;
    }

    // Category affinity boost
    if (priorityCategory && cat.toLowerCase() === priorityCategory.toLowerCase()) {
      score += 10;
    }

    return { product, score };
  });

  // Filter and sort by score
  const semanticResults = scoredProducts
    .filter(item => item.score > 5)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);

  const finalMatches = semanticResults.length > 0 ? semanticResults : exactMatches;

  return {
    matches: finalMatches,
    semanticIntent: detectedIntent ? `AI Intent: ${detectedIntent.toUpperCase()}` : 'Semantic Similarity',
    confidence: semanticResults.length > 0 ? 0.88 : 0.65
  };
}
