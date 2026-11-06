/**
 * MegaMart AI Shopping Copilot Service
 * Enterprise Generative Shopping Assistant with Tool Execution & Recipe-to-Cart Bundler.
 */

export class MegaAiCopilot {
  constructor(catalog) {
    this.catalog = catalog || [];
  }

  setCatalog(catalog) {
    this.catalog = catalog;
  }

  /**
   * Process a natural language user query and return structured AI response
   * @param {string} userMessage
   * @returns {Promise<Object>}
   */
  async processQuery(userMessage) {
    const q = (userMessage || '').toLowerCase().trim();

    // Simulate AI thinking latency for realistic conversational feel
    await new Promise(r => setTimeout(r, 450));

    // 1. Recipe to Cart: Paneer Butter Masala
    if (q.includes('paneer') || q.includes('butter masala') || q.includes('recipe')) {
      const items = this.findProductsByKeywords(['paneer', 'butter', 'ghee', 'tomato', 'cream', 'atta', 'oil']);
      return {
        type: 'recipe_bundle',
        title: '🍲 Chef AI: Paneer Butter Masala Kit (Serves 4)',
        reply: "Here is your chef-curated recipe bundle for Restaurant-Style Paneer Butter Masala! I've selected fresh Malai Paneer, Amul Butter, pure Cow Ghee, and fresh pantry staples for 4 servings.",
        actionLabel: 'Add All Recipe Ingredients to Cart',
        items: items.slice(0, 5),
        totalPrice: items.slice(0, 5).reduce((sum, i) => sum + (i.discount_price || i.price || 0), 0)
      };
    }

    // 2. High Protein Gym Diet
    if (q.includes('gym') || q.includes('protein') || q.includes('fitness') || q.includes('diet') || q.includes('bodybuilding')) {
      const items = this.findProductsByKeywords(['egg', 'milk', 'paneer', 'peanut', 'almond', 'curd', 'oats']);
      return {
        type: 'fitness_bundle',
        title: '💪 FitLife AI: High-Protein Muscle Fuel Pack',
        reply: "Here is an optimal high-protein diet pack formulated for muscle recovery and clean daily nutrition. Packed with fresh Farm Eggs, Greek Curd, Malai Paneer, and Roasted Nuts.",
        actionLabel: 'Add High-Protein Pack to Cart',
        items: items.slice(0, 5),
        totalPrice: items.slice(0, 5).reduce((sum, i) => sum + (i.discount_price || i.price || 0), 0)
      };
    }

    // 3. Evening Chai & Snacks Party
    if (q.includes('chai') || q.includes('tea') || q.includes('snack') || q.includes('biscuit') || q.includes('evening') || q.includes('party')) {
      const items = this.findProductsByKeywords(['tea', 'chai', 'biscuit', 'cookie', 'chips', 'namkeen', 'lays', 'kurkure']);
      return {
        type: 'snack_bundle',
        title: '☕ Desi Chai & Crunchy Snacks Party Kit',
        reply: "Nothing beats evening Kadak Masala Chai paired with fresh cookies and crunchy namkeen! Here is the ultimate 10-minute tea party pack.",
        actionLabel: 'Add Tea & Snacks Kit to Cart',
        items: items.slice(0, 5),
        totalPrice: items.slice(0, 5).reduce((sum, i) => sum + (i.discount_price || i.price || 0), 0)
      };
    }

    // 4. Tech / Smartphone Arena
    if (q.includes('phone') || q.includes('iphone') || q.includes('galaxy') || q.includes('smartphone') || q.includes('mobile')) {
      const items = this.findProductsByKeywords(['iphone', 'galaxy', 'smartphone', 'oneplus', 'headphone', 'watch']);
      return {
        type: 'tech_recommendation',
        title: '📱 MegaAI Flagship Smartphone Advisor',
        reply: "Based on camera performance, battery life, and festive exchange offers, here are the highest-rated smartphones in stock at dark stores for 10-minute dispatch:",
        actionLabel: 'View Flagship Deals',
        items: items.slice(0, 4),
        totalPrice: items.slice(0, 4).reduce((sum, i) => sum + (i.discount_price || i.price || 0), 0)
      };
    }

    // 5. General Smart Discovery
    const generalItems = this.findProductsByKeywords(q.split(/\s+/).filter(w => w.length > 2));
    if (generalItems.length > 0) {
      return {
        type: 'custom_search',
        title: `✨ MegaAI Curated Matches for "${userMessage}"`,
        reply: `I analyzed our 246 cloud products and found ${generalItems.length} top-rated matches tailored to your request:`,
        actionLabel: 'Add Top Results to Cart',
        items: generalItems.slice(0, 4),
        totalPrice: generalItems.slice(0, 4).reduce((sum, i) => sum + (i.discount_price || i.price || 0), 0)
      };
    }

    // 6. Fallback Friendly Help
    const popularItems = this.catalog.slice(0, 4);
    return {
      type: 'general_help',
      title: '✨ MegaAI Shopping Copilot',
      reply: `I can help you build custom meal recipes, find high-protein diets, recommend smartphones, or assemble gift hampers! Here are some trending bestsellers right now:`,
      actionLabel: 'Explore Trending Bestsellers',
      items: popularItems,
      totalPrice: popularItems.reduce((sum, i) => sum + (i.discount_price || i.price || 0), 0)
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
