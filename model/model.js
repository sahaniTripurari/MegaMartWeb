// Authoritative MegaMart Catalog Model with Stock & Immutability Protection
// Enriched with Flipkart & Myntra Features: Flash Deals, Variants, and MegaCoins

export const Model = [     
    // Fresh Fruits
    { 
        id: "fruit-banana", 
        name: "Banana", 
        unit: "1kg", 
        type: "Fresh Fruits", 
        quantity: 0, 
        price: 60, 
        discount_price: 48, 
        stock: 4, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-425-405,pr-true,f-webp,q-80/inventory/product/cb115d55-cf65-4228-80c8-b0fc0b90ae03-/tmp/20230216-1551351.jpeg",
        isFlashDeal: true,
        flashDiscount: "40% OFF",
        megaCoins: 15,
        variants: [
            { unit: "500g", price: 35, discount_price: 28 },
            { unit: "1kg", price: 60, discount_price: 48 },
            { unit: "2kg", price: 110, discount_price: 88 }
        ]
    },     
    { 
        id: "fruit-apple", 
        name: "Apple", 
        unit: "1kg", 
        type: "Fresh Fruits", 
        quantity: 0, 
        price: 180, 
        discount_price: 162, 
        stock: 12, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-500-500,pr-true,f-webp,q-80/inventory/product/0e673bd2-2fe6-4d8e-899e-00b4d460a653-tmp/a87d6c85-8184-428d-a877-070f4f55ffb5.jpeg",
        megaCoins: 25,
        variants: [
            { unit: "500g", price: 95, discount_price: 85 },
            { unit: "1kg", price: 180, discount_price: 162 },
            { unit: "2kg", price: 350, discount_price: 310 }
        ]
    },      
    { 
        id: "fruit-mango", 
        name: "Mango", 
        unit: "1kg", 
        type: "Fresh Fruits", 
        quantity: 0, 
        price: 120, 
        discount_price: 96, 
        stock: 3, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-478-522,pr-true,f-webp,q-80/inventory/product/1b9cf6b1-9a9d-41a7-ace5-0faec8e3e71f-image_file.png",
        isFlashDeal: true,
        flashDiscount: "35% OFF",
        megaCoins: 20,
        variants: [
            { unit: "500g", price: 65, discount_price: 52 },
            { unit: "1kg", price: 120, discount_price: 96 },
            { unit: "2kg", price: 230, discount_price: 180 }
        ]
    },      
    { 
        id: "fruit-orange", 
        name: "Orange", 
        unit: "1kg", 
        type: "Fresh Fruits", 
        quantity: 0, 
        price: 80, 
        discount_price: 68, 
        stock: 10, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-187-187,pr-true,f-webp,q-80/inventory/product/6c78cf1a-ed30-4d24-8def-a274418a27ea-image",
        megaCoins: 15,
        variants: [
            { unit: "500g", price: 45, discount_price: 38 },
            { unit: "1kg", price: 80, discount_price: 68 },
            { unit: "2kg", price: 150, discount_price: 128 }
        ]
    },      
    { 
        id: "fruit-papaya", 
        name: "Papaya", 
        unit: "1kg", 
        type: "Fresh Fruits", 
        quantity: 0, 
        price: 40, 
        discount_price: 36, 
        stock: 8, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1000-799,pr-true,f-webp,q-80/inventory/product/de957e5c-6ef2-4b20-831f-4ec31fcb4c3d-image_file.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "1 piece (approx 1kg)", price: 40, discount_price: 36 },
            { unit: "2 pieces (approx 2kg)", price: 75, discount_price: 65 }
        ]
    },    

    // Fresh Vegetables
    { 
        id: "veg-onion", 
        name: "Onion", 
        unit: "1kg", 
        type: "Fresh Vegetables", 
        price: 35, 
        quantity: 0, 
        discount_price: 28, 
        stock: 20, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1200-1200,pr-true,f-webp,q-80/inventory/product/07a54355-4d10-4623-b369-1109db67d160-Photo.jpeg",
        isFlashDeal: true,
        flashDiscount: "40% OFF",
        megaCoins: 15,
        variants: [
            { unit: "1kg", price: 35, discount_price: 28 },
            { unit: "2kg", price: 68, discount_price: 52 },
            { unit: "5kg", price: 165, discount_price: 125 }
        ]
    },
    { 
        id: "veg-potato", 
        name: "Potato", 
        unit: "1kg", 
        type: "Fresh Vegetables", 
        price: 25, 
        quantity: 0, 
        discount_price: 22, 
        stock: 18, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-4745-3537,pr-true,f-webp,q-80/inventory/product/534318fb-a402-4902-9cce-2cbd8984d75b-53.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "1kg", price: 25, discount_price: 22 },
            { unit: "2kg", price: 48, discount_price: 40 },
            { unit: "5kg", price: 115, discount_price: 95 }
        ]
    },
    { 
        id: "veg-cauliflower", 
        name: "Cauliflower", 
        unit: "1kg", 
        type: "Fresh Vegetables", 
        price: 45, 
        quantity: 0, 
        discount_price: 36, 
        stock: 7, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1500-1500,pr-true,f-webp,q-80/inventory/product/3a919660-707b-44f4-b666-8b3fcf094a7b-image",
        megaCoins: 15,
        variants: [
            { unit: "1 piece (approx 800g)", price: 45, discount_price: 36 },
            { unit: "2 pieces (approx 1.6kg)", price: 85, discount_price: 68 }
        ]
    },
    { 
        id: "veg-bottleguard", 
        name: "Bottle Guard", 
        unit: "1kg", 
        type: "Fresh Vegetables", 
        price: 30, 
        quantity: 0, 
        discount_price: 27, 
        stock: 9, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1000-1000,pr-true,f-webp,q-80/inventory/product/9e5847e4-17a6-4a48-8221-d237f440d995-image",
        megaCoins: 15,
        variants: [
            { unit: "500g", price: 18, discount_price: 15 },
            { unit: "1kg", price: 30, discount_price: 27 },
            { unit: "2kg", price: 58, discount_price: 50 }
        ]
    },
    { 
        id: "veg-tomato", 
        name: "Tomato", 
        unit: "1kg", 
        type: "Fresh Vegetables", 
        price: 50, 
        quantity: 0, 
        discount_price: 40, 
        stock: 14, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-800-500,pr-true,f-webp,q-80/inventory/product/dedf3d96-5fe5-482a-a24a-494f6e76845e-tmp/f3cb8fd8-e2df-4c11-ba79-4203e88af3ad.jpeg",
        isFlashDeal: true,
        flashDiscount: "40% OFF",
        megaCoins: 15,
        variants: [
            { unit: "500g", price: 28, discount_price: 22 },
            { unit: "1kg", price: 50, discount_price: 40 },
            { unit: "2kg", price: 95, discount_price: 75 }
        ]
    },

    // Leafy Herbs
    { 
        id: "herb-spinach", 
        name: "Spinach", 
        unit: "500g", 
        type: "leafy Herbs", 
        price: 20, 
        quantity: 0, 
        discount_price: 18, 
        stock: 6, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-393-510,pr-true,f-webp,q-80/inventory/product/9abf0781-37d6-4b05-b559-912ab7ce2145-568.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "250g", price: 12, discount_price: 10 },
            { unit: "500g", price: 20, discount_price: 18 },
            { unit: "1kg", price: 38, discount_price: 32 }
        ]
    },
    { 
        id: "herb-coriander", 
        name: "Coriander", 
        unit: "100g", 
        type: "leafy Herbs", 
        price: 15, 
        quantity: 0, 
        discount_price: 12, 
        stock: 15, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-450,ar-1500-888,pr-true,f-webp,q-80/inventory/product/6f885126-571a-4655-a9fb-91a6a893928f-4199723a-d43e-4e86-b88d-34289de52bb5-Photo.webp",
        megaCoins: 15,
        variants: [
            { unit: "50g", price: 9, discount_price: 7 },
            { unit: "100g", price: 15, discount_price: 12 },
            { unit: "200g", price: 28, discount_price: 22 }
        ]
    },
    { 
        id: "herb-curryleaves", 
        name: "Curry leaves", 
        unit: "50g", 
        type: "leafy Herbs", 
        price: 10, 
        quantity: 0, 
        discount_price: 8, 
        stock: 12, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1000-1000,pr-true,f-webp,q-80/inventory/product/22fe0c8f-68d5-4979-a7ff-309e078b90bf-d1a47d08-8bbd-4cad-807f-04019d364919.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "50g", price: 10, discount_price: 8 },
            { unit: "100g", price: 18, discount_price: 14 }
        ]
    },
    { 
        id: "herb-mint", 
        name: "Mint", 
        unit: "100g", 
        type: "leafy Herbs", 
        price: 12, 
        quantity: 0, 
        discount_price: 10, 
        stock: 9, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-800-900,pr-true,f-webp,q-80/inventory/product/223a4b9a-b56b-4229-9613-68a6351cd7b9-88f2ab6e-535d-4128-af71-7d326da7c1ff-d895a0da-812a-47ed-abb7-1e63149043ad.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "100g", price: 12, discount_price: 10 },
            { unit: "200g", price: 22, discount_price: 18 }
        ]
    },
    { 
        id: "herb-chilli", 
        name: "Chilli", 
        unit: "250g", 
        type: "leafy Herbs", 
        price: 25, 
        quantity: 0, 
        discount_price: 20, 
        stock: 11, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1000-1000,pr-true,f-webp,q-80/inventory/product/63261e85-1820-4068-885b-843785cb64f2-image_file.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "100g", price: 12, discount_price: 10 },
            { unit: "250g", price: 25, discount_price: 20 },
            { unit: "500g", price: 48, discount_price: 38 }
        ]
    },

    // Flowers
    { 
        id: "flower-rose", 
        name: "Rose", 
        unit: "3 Nos", 
        type: "Flowers", 
        price: 30, 
        quantity: 0, 
        discount_price: 24, 
        stock: 3, 
        maxPerOrder: 4, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1024-1024,pr-true,f-webp,q-80/inventory/product/b064d64e-d53e-4167-84c8-242f4c1331fc-c1689a18-a10c-404b-ad45-e38bd18eb599.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "1 No", price: 12, discount_price: 10 },
            { unit: "3 Nos", price: 30, discount_price: 24 },
            { unit: "6 Nos", price: 55, discount_price: 44 }
        ]
    },
    { 
        id: "flower-marigold", 
        name: "Marigold", 
        unit: "3 Nos", 
        type: "Flowers", 
        price: 20, 
        quantity: 0, 
        discount_price: 18, 
        stock: 8, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-275-183,pr-true,f-webp,q-80/inventory/product/bfa2222e-bc7a-41d7-858f-13343d3d470d-5ae912ef-89df-4fbc-a546-87fbd23135bc.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "3 Nos", price: 20, discount_price: 18 },
            { unit: "6 Nos", price: 38, discount_price: 32 }
        ]
    },
    { 
        id: "flower-whitelower", 
        name: "Whitelower", 
        unit: "3 Nos", 
        type: "Flowers", 
        price: 25, 
        quantity: 0, 
        discount_price: 22, 
        stock: 2, 
        maxPerOrder: 4, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1100-1100,pr-true,f-webp,q-80/inventory/product/0e256bfa-cede-45a3-ba77-42bc88c543fa-Photo.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "3 Nos", price: 25, discount_price: 22 },
            { unit: "6 Nos", price: 46, discount_price: 40 }
        ]
    },

    // Exotic
    { 
        id: "exotic-capsicum", 
        name: "Capsicum", 
        unit: "500g", 
        type: "Exotic", 
        price: 60, 
        quantity: 0, 
        discount_price: 48, 
        stock: 8, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-500-500,pr-true,f-webp,q-80/inventory/product/2b9b7408-9e6e-4cfe-8b50-e785b50d5631-67d14285-ec66-44ab-ac02-f0cbcb1982a0.jpeg",
        isFlashDeal: true,
        flashDiscount: "40% OFF",
        megaCoins: 18,
        variants: [
            { unit: "250g", price: 35, discount_price: 26 },
            { unit: "500g", price: 60, discount_price: 48 },
            { unit: "1kg", price: 110, discount_price: 88 }
        ]
    },
    { 
        id: "exotic-broccoli", 
        name: "Broccoli", 
        unit: "500g", 
        type: "Exotic", 
        price: 80, 
        quantity: 0, 
        discount_price: 72, 
        stock: 5, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-500-500,pr-true,f-webp,q-80/inventory/product/d27275d2-1f38-498b-b5f3-f9da1bb3eae4-a14bec60-157d-43cf-bbb6-e730aa192303.jpeg",
        megaCoins: 20,
        variants: [
            { unit: "250g", price: 45, discount_price: 40 },
            { unit: "500g", price: 80, discount_price: 72 },
            { unit: "1kg", price: 150, discount_price: 135 }
        ]
    },
    { 
        id: "exotic-babycorn", 
        name: "BabyCorn", 
        unit: "250g", 
        type: "Exotic", 
        price: 40, 
        quantity: 0, 
        discount_price: 34, 
        stock: 7, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-500-500,pr-true,f-webp,q-80/inventory/product/e96e943f-4c39-4a79-a36f-2554e201582a-tmp/30d3c540-b407-4191-b9f4-435b68506ac0.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "250g", price: 40, discount_price: 34 },
            { unit: "500g", price: 75, discount_price: 62 }
        ]
    },
    { 
        id: "exotic-iceberg", 
        name: "Iceberg", 
        unit: "1 piece", 
        type: "Exotic", 
        price: 35, 
        quantity: 0, 
        discount_price: 28, 
        stock: 6, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1920-1440,pr-true,f-webp,q-80/inventory/product/b3fafcaa-5e1f-4a49-b43f-33ac753b60e8-513.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "1 piece", price: 35, discount_price: 28 },
            { unit: "2 pieces", price: 65, discount_price: 52 }
        ]
    },
    { 
        id: "exotic-mushroom", 
        name: "Mushroom", 
        unit: "200g", 
        type: "Exotic", 
        price: 50, 
        quantity: 0, 
        discount_price: 45, 
        stock: 9, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-500-500,pr-true,f-webp,q-80/inventory/product/8e99f4fb-82b1-499a-9555-3fdf794870e5-b972dce8-6f25-4153-9bd8-39f851ba8ea8-Photo.webp",
        megaCoins: 15,
        variants: [
            { unit: "200g pack", price: 50, discount_price: 45 },
            { unit: "400g (2 packs)", price: 95, discount_price: 85 }
        ]
    },

    // Kitchen
    { 
        id: "kitchen-milk", 
        name: "Milk", 
        unit: "1 lt", 
        type: "Kitchen", 
        price: 65, 
        quantity: 0, 
        discount_price: 62, 
        stock: 8, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1449-2774,pr-true,f-webp,q-80/inventory/product/ff393466-31a4-4aba-a51b-a787c39ef57e-1X_7lBoxi4mJYgEcYcv0Wy43RpIC7yQdk.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "500ml", price: 34, discount_price: 32 },
            { unit: "1 lt", price: 65, discount_price: 62 },
            { unit: "2 lt", price: 128, discount_price: 120 }
        ]
    },
    { 
        id: "kitchen-tea", 
        name: "Tea", 
        unit: "250g pack", 
        type: "Kitchen", 
        price: 120, 
        quantity: 0, 
        discount_price: 108, 
        stock: 3, 
        maxPerOrder: 4, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-412-499,pr-true,f-webp,q-80/inventory/product/1e59f8b8-ebe3-4bbb-b9b3-b45ef7a45274-1CqRELFOO9CnkzvH6tfZaF1vQJDJzzLcQ.jpeg",
        megaCoins: 20,
        variants: [
            { unit: "250g pack", price: 120, discount_price: 108 },
            { unit: "500g pack", price: 230, discount_price: 205 },
            { unit: "1kg pack", price: 440, discount_price: 390 }
        ]
    },
    { 
        id: "kitchen-sugar", 
        name: "Sugar", 
        unit: "1kg", 
        type: "Kitchen", 
        price: 50, 
        quantity: 0, 
        discount_price: 47, 
        stock: 12, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1117-1500,pr-true,f-webp,q-80/inventory/product/b3509c76-ae8b-44c8-8e5f-cf936e31c154-1Goci1ytuE8z6w5aJqv6IqwsvLxSys91o.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "1kg", price: 50, discount_price: 47 },
            { unit: "2kg", price: 98, discount_price: 90 },
            { unit: "5kg", price: 240, discount_price: 220 }
        ]
    },
    { 
        id: "kitchen-masala", 
        name: "Masala", 
        unit: "100g pack", 
        type: "Kitchen", 
        price: 45, 
        quantity: 0, 
        discount_price: 36, 
        stock: 10, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-900-900,pr-true,f-webp,q-80/inventory/product/16a652fa-98ec-4fc0-8f89-210964124ff4-17TURUs2qsmLbTIIEgRDx9XGdbAO_t-HI.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "100g pack", price: 45, discount_price: 36 },
            { unit: "200g pack", price: 85, discount_price: 68 }
        ]
    },
    { 
        id: "kitchen-salt", 
        name: "Salt", 
        unit: "1kg", 
        type: "Kitchen", 
        price: 25, 
        quantity: 0, 
        discount_price: 23, 
        stock: 25, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1500-1500,pr-true,f-webp,q-80/inventory/product/ed9fdfd5-6536-4a16-9d70-b055fa36ec34-103.jpg",
        megaCoins: 15,
        variants: [
            { unit: "1kg", price: 25, discount_price: 23 },
            { unit: "2kg", price: 48, discount_price: 44 }
        ]
    },

    // House Hold
    { 
        id: "household-cleaners", 
        name: "Cleaners", 
        unit: "500ml", 
        type: "House Hold", 
        price: 85, 
        quantity: 0, 
        discount_price: 76, 
        stock: 4, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1000-1000,pr-true,f-webp,q-80/inventory/product/9f1fab69-ce22-40e0-bda1-f4d9d9d93d6a-/tmp/20230301-1517501.jpeg",
        megaCoins: 18,
        variants: [
            { unit: "500ml", price: 85, discount_price: 76 },
            { unit: "1 lt", price: 160, discount_price: 140 }
        ]
    },
    { 
        id: "household-allout", 
        name: "Allout", 
        unit: "1 pack", 
        type: "House Hold", 
        price: 150, 
        quantity: 0, 
        discount_price: 135, 
        stock: 8, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1200-1286,pr-true,f-webp,q-80/inventory/product/add06766-764f-432b-af4c-a21088ba960d-1e1U__7TcZUxQWdLWQTVylJ5IwN2HkFU4.jpeg",
        megaCoins: 20,
        variants: [
            { unit: "1 pack", price: 150, discount_price: 135 },
            { unit: "Twin pack (2 units)", price: 285, discount_price: 250 }
        ]
    },
    { 
        id: "household-roomfreshners", 
        name: "Room Freshners", 
        unit: "300ml", 
        type: "House Hold", 
        price: 95, 
        quantity: 0, 
        discount_price: 81, 
        stock: 7, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-1200-1200,pr-true,f-webp,q-80/inventory/product/e7399340-1d82-4dfe-9e5f-0ded0f170319-1ULtgm5lv0YAtHM20m3chg_eeURJ5Og5K.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "150ml", price: 55, discount_price: 48 },
            { unit: "300ml", price: 95, discount_price: 81 }
        ]
    },
    { 
        id: "household-soap", 
        name: "Soap", 
        unit: "4 pack", 
        type: "House Hold", 
        price: 120, 
        quantity: 0, 
        discount_price: 96, 
        stock: 4, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-600-600,pr-true,f-webp,q-80/inventory/product/4ec76d3d-e0d0-4f49-8d71-f38792e688aa-1IW7n_PJoDzpNgrZeYuVuXc2Gmwv2Hj7L.jpeg",
        isFlashDeal: true,
        flashDiscount: "40% OFF",
        megaCoins: 18,
        variants: [
            { unit: "1 pack", price: 35, discount_price: 30 },
            { unit: "4 pack", price: 120, discount_price: 96 },
            { unit: "8 pack", price: 230, discount_price: 180 }
        ]
    },
    { 
        id: "household-sanitizers", 
        name: "Sanitizers", 
        unit: "200ml", 
        type: "House Hold", 
        price: 75, 
        quantity: 0, 
        discount_price: 68, 
        stock: 15, 
        maxPerOrder: 6, 
        countryoforigin: "india", 
        src: "https://cdn.zeptonow.com/production///tr:w-200,ar-679-679,pr-true,f-webp,q-80/inventory/product/1d0e0824-4bf0-4380-b0d4-6bc9f7ac0c15-1Ln11pGDHPMx1EGM0y-kLazpF0Mh3jHRD.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "100ml", price: 45, discount_price: 40 },
            { unit: "200ml", price: 75, discount_price: 68 },
            { unit: "500ml", price: 160, discount_price: 140 }
        ]
    },

    // ================= EXPANDED FRESH FRUITS =================
    {
        id: "fruit-watermelon",
        name: "Watermelon",
        unit: "1 piece (approx 2-3kg)",
        type: "Fresh Fruits",
        quantity: 0,
        price: 80,
        discount_price: 59,
        stock: 14,
        maxPerOrder: 4,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/f47b2c01-766b-4e89-8d1e-8fe59da3fe76-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "26% OFF",
        megaCoins: 15,
        variants: [
            { unit: "1 piece (approx 2-3kg)", price: 80, discount_price: 59 },
            { unit: "2 pieces (approx 5kg)", price: 150, discount_price: 110 }
        ]
    },
    {
        id: "fruit-pomegranate",
        name: "Pomegranate",
        unit: "4 pcs (approx 800g)",
        type: "Fresh Fruits",
        quantity: 0,
        price: 190,
        discount_price: 155,
        stock: 12,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/ea7f66a6-d667-4d9d-83b6-7db60d922bb6-1.jpeg",
        megaCoins: 25,
        variants: [
            { unit: "2 pcs (approx 400g)", price: 100, discount_price: 82 },
            { unit: "4 pcs (approx 800g)", price: 190, discount_price: 155 }
        ]
    },
    {
        id: "fruit-green-grapes",
        name: "Green Grapes",
        unit: "500g",
        type: "Fresh Fruits",
        quantity: 0,
        price: 110,
        discount_price: 85,
        stock: 15,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/77519a4d-f952-4752-9b2f-7d1ae3e29f12-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "22% OFF",
        megaCoins: 20,
        variants: [
            { unit: "250g", price: 60, discount_price: 46 },
            { unit: "500g", price: 110, discount_price: 85 },
            { unit: "1kg", price: 210, discount_price: 160 }
        ]
    },

    // ================= EXPANDED FRESH VEGETABLES =================
    {
        id: "veg-carrot",
        name: "Carrot",
        unit: "500g",
        type: "Fresh Vegetables",
        quantity: 0,
        price: 40,
        discount_price: 29,
        stock: 25,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/fa9e4034-e4df-4122-b5e5-397a7bb6c4db-1.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "500g", price: 40, discount_price: 29 },
            { unit: "1kg", price: 75, discount_price: 55 }
        ]
    },
    {
        id: "veg-cucumber",
        name: "Cucumber",
        unit: "500g",
        type: "Fresh Vegetables",
        quantity: 0,
        price: 35,
        discount_price: 24,
        stock: 20,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/97a81093-a417-48f5-a89e-2dc336eeb557-1.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "500g", price: 35, discount_price: 24 },
            { unit: "1kg", price: 65, discount_price: 45 }
        ]
    },
    {
        id: "veg-lady-finger",
        name: "Lady Finger",
        unit: "500g",
        type: "Fresh Vegetables",
        quantity: 0,
        price: 45,
        discount_price: 32,
        stock: 18,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/e10e78c8-1090-410a-b0df-246d84a30fa1-1.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "250g", price: 25, discount_price: 18 },
            { unit: "500g", price: 45, discount_price: 32 },
            { unit: "1kg", price: 85, discount_price: 60 }
        ]
    },
    {
        id: "veg-green-peas",
        name: "Green Peas",
        unit: "500g",
        type: "Fresh Vegetables",
        quantity: 0,
        price: 65,
        discount_price: 48,
        stock: 16,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/88d8b6eb-2cfa-4db7-873b-5a1e27a1b660-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "26% OFF",
        megaCoins: 15,
        variants: [
            { unit: "500g", price: 65, discount_price: 48 },
            { unit: "1kg", price: 120, discount_price: 90 }
        ]
    },

    // ================= DAIRY, BREAD & EGGS =================
    {
        id: "dairy-amul-butter",
        name: "Amul Butter",
        unit: "100g",
        type: "Dairy, Bread & Eggs",
        quantity: 0,
        price: 58,
        discount_price: 56,
        stock: 30,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/6e0ee5ba-cf58-450f-a396-8eb5c696e14a-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "Instant Deal",
        megaCoins: 15,
        variants: [
            { unit: "100g", price: 58, discount_price: 56 },
            { unit: "500g", price: 275, discount_price: 265 }
        ]
    },
    {
        id: "dairy-farm-eggs",
        name: "Farm Eggs",
        unit: "Pack of 6",
        type: "Dairy, Bread & Eggs",
        quantity: 0,
        price: 55,
        discount_price: 46,
        stock: 40,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/18cb7e42-7065-4f40-8a48-8dfca6b052d9-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "16% OFF",
        megaCoins: 15,
        variants: [
            { unit: "Pack of 6", price: 55, discount_price: 46 },
            { unit: "Pack of 12", price: 105, discount_price: 88 },
            { unit: "Pack of 30 Tray", price: 240, discount_price: 199 }
        ]
    },
    {
        id: "dairy-amul-paneer",
        name: "Paneer",
        unit: "200g",
        type: "Dairy, Bread & Eggs",
        quantity: 0,
        price: 95,
        discount_price: 89,
        stock: 22,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/58156157-1907-4e96-a886-302a9ebfa4a8-1.jpeg",
        megaCoins: 20,
        variants: [
            { unit: "200g", price: 95, discount_price: 89 },
            { unit: "400g", price: 185, discount_price: 172 }
        ]
    },
    {
        id: "dairy-mother-dairy-curd",
        name: "Curd",
        unit: "400g",
        type: "Dairy, Bread & Eggs",
        quantity: 0,
        price: 40,
        discount_price: 36,
        stock: 25,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/fceb99bf-e10c-40ad-be00-47407a102715-1.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "400g", price: 40, discount_price: 36 },
            { unit: "1kg Tub", price: 90, discount_price: 82 }
        ]
    },
    {
        id: "dairy-britannia-brown-bread",
        name: "Brown Bread",
        unit: "400g",
        type: "Dairy, Bread & Eggs",
        quantity: 0,
        price: 50,
        discount_price: 45,
        stock: 20,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/751d38cb-f938-4e89-a3d8-5ecf36c53569-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "10% OFF",
        megaCoins: 15,
        variants: [
            { unit: "400g", price: 50, discount_price: 45 }
        ]
    },

    // ================= SNACKS & MUNCHIES =================
    {
        id: "snack-lays-chips",
        name: "Lays Chips",
        unit: "50g",
        type: "Snacks & Munchies",
        quantity: 0,
        price: 20,
        discount_price: 18,
        stock: 45,
        maxPerOrder: 10,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/ee7c0ef3-f42c-4a37-b7d6-7ae03a6bc150-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "Party Favourite",
        megaCoins: 15,
        variants: [
            { unit: "50g", price: 20, discount_price: 18 },
            { unit: "115g Party Pack", price: 50, discount_price: 42 }
        ]
    },
    {
        id: "snack-kurkure",
        name: "Kurkure",
        unit: "85g",
        type: "Snacks & Munchies",
        quantity: 0,
        price: 20,
        discount_price: 18,
        stock: 40,
        maxPerOrder: 10,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/c3b0dfae-24ec-4286-9a2c-15ba0567e9f3-1.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "85g", price: 20, discount_price: 18 },
            { unit: "165g Family Pack", price: 40, discount_price: 35 }
        ]
    },
    {
        id: "snack-haldiram-bhujia",
        name: "Haldiram Bhujia",
        unit: "200g",
        type: "Snacks & Munchies",
        quantity: 0,
        price: 65,
        discount_price: 55,
        stock: 30,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/556da87e-e374-4b82-9659-c2901dbdfc42-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "15% OFF",
        megaCoins: 15,
        variants: [
            { unit: "200g", price: 65, discount_price: 55 },
            { unit: "400g", price: 125, discount_price: 105 }
        ]
    },
    {
        id: "snack-parle-g",
        name: "Parle-G",
        unit: "250g",
        type: "Snacks & Munchies",
        quantity: 0,
        price: 30,
        discount_price: 27,
        stock: 50,
        maxPerOrder: 10,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/cbb5a526-a070-4f9e-a89c-4aa79872beea-1.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "250g", price: 30, discount_price: 27 },
            { unit: "800g Super Saver", price: 90, discount_price: 79 }
        ]
    },
    {
        id: "snack-maggi-noodles",
        name: "Maggi Noodles",
        unit: "Pack of 4 (280g)",
        type: "Snacks & Munchies",
        quantity: 0,
        price: 56,
        discount_price: 50,
        stock: 55,
        maxPerOrder: 8,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/a63c659d-ea33-40a2-990e-b7d6fb8fa017-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "Best Seller",
        megaCoins: 20,
        variants: [
            { unit: "70g Single", price: 14, discount_price: 13 },
            { unit: "Pack of 4 (280g)", price: 56, discount_price: 50 },
            { unit: "Pack of 12 (840g)", price: 168, discount_price: 148 }
        ]
    },
    {
        id: "snack-cadbury-dairy-milk",
        name: "Cadbury Dairy Milk",
        unit: "60g",
        type: "Snacks & Munchies",
        quantity: 0,
        price: 80,
        discount_price: 72,
        stock: 35,
        maxPerOrder: 8,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/981e9fa4-d130-4966-90c7-010e9f029a2c-1.jpeg",
        megaCoins: 20,
        variants: [
            { unit: "60g", price: 80, discount_price: 72 },
            { unit: "150g Giant Bar", price: 180, discount_price: 155 }
        ]
    },

    // ================= COLD DRINKS & BEVERAGES =================
    {
        id: "bev-coca-cola",
        name: "Coca-Cola",
        unit: "750ml",
        type: "Cold Drinks & Beverages",
        quantity: 0,
        price: 40,
        discount_price: 38,
        stock: 45,
        maxPerOrder: 8,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/6e5f6e80-77a8-4c92-ba4a-ef7ca8840ca0-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "Chilled",
        megaCoins: 15,
        variants: [
            { unit: "750ml", price: 40, discount_price: 38 },
            { unit: "1.25L", price: 65, discount_price: 60 },
            { unit: "2.25L Party Bottle", price: 99, discount_price: 89 }
        ]
    },
    {
        id: "bev-sprite",
        name: "Sprite",
        unit: "750ml",
        type: "Cold Drinks & Beverages",
        quantity: 0,
        price: 40,
        discount_price: 38,
        stock: 40,
        maxPerOrder: 8,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/bcfef187-db4a-4389-9fc6-c8f0ba7aa599-1.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "750ml", price: 40, discount_price: 38 },
            { unit: "1.25L", price: 65, discount_price: 60 }
        ]
    },
    {
        id: "bev-real-mango-juice",
        name: "Real Mango Juice",
        unit: "1L",
        type: "Cold Drinks & Beverages",
        quantity: 0,
        price: 130,
        discount_price: 105,
        stock: 30,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/a55c91cf-fe25-4c07-b3e1-ee2dc46ebc37-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "19% OFF",
        megaCoins: 20,
        variants: [
            { unit: "1L", price: 130, discount_price: 105 },
            { unit: "2x 1L Twin Pack", price: 260, discount_price: 199 }
        ]
    },
    {
        id: "bev-red-bull",
        name: "Red Bull",
        unit: "250ml Can",
        type: "Cold Drinks & Beverages",
        quantity: 0,
        price: 125,
        discount_price: 115,
        stock: 25,
        maxPerOrder: 6,
        countryoforigin: "austria",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/f34382fa-fe11-4f11-9a70-74501a6cecc6-1.jpeg",
        megaCoins: 25,
        variants: [
            { unit: "250ml Can", price: 125, discount_price: 115 },
            { unit: "Pack of 4 Cans", price: 500, discount_price: 440 }
        ]
    },

    // ================= STAPLES, ATTA & OIL =================
    {
        id: "staple-fortune-oil",
        name: "Fortune Sunflower Oil",
        unit: "1L Pouch",
        type: "Staples, Atta & Oil",
        quantity: 0,
        price: 145,
        discount_price: 128,
        stock: 35,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/f47e3355-323c-4b95-a24c-1d02c46274e1-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "Essential Deal",
        megaCoins: 20,
        variants: [
            { unit: "1L Pouch", price: 145, discount_price: 128 },
            { unit: "5L Can", price: 720, discount_price: 625 }
        ]
    },
    {
        id: "staple-aashirvaad-atta",
        name: "Aashirvaad Atta",
        unit: "5kg",
        type: "Staples, Atta & Oil",
        quantity: 0,
        price: 260,
        discount_price: 228,
        stock: 30,
        maxPerOrder: 4,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/449191e3-cce3-446a-8d19-5d63503cb06d-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "12% OFF",
        megaCoins: 30,
        variants: [
            { unit: "5kg", price: 260, discount_price: 228 },
            { unit: "10kg", price: 495, discount_price: 435 }
        ]
    },
    {
        id: "staple-daawat-rice",
        name: "Daawat Basmati Rice",
        unit: "1kg",
        type: "Staples, Atta & Oil",
        quantity: 0,
        price: 110,
        discount_price: 89,
        stock: 25,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/e7456d95-888f-43e6-95ff-559d7ea7ff8e-1.jpeg",
        megaCoins: 20,
        variants: [
            { unit: "1kg", price: 110, discount_price: 89 },
            { unit: "5kg Bag", price: 499, discount_price: 399 }
        ]
    },
    {
        id: "staple-tata-toor-dal",
        name: "Tata Toor Dal",
        unit: "1kg",
        type: "Staples, Atta & Oil",
        quantity: 0,
        price: 195,
        discount_price: 168,
        stock: 25,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/2e23d130-9092-496a-86cf-90e66c7f999d-1.jpeg",
        megaCoins: 25,
        variants: [
            { unit: "1kg", price: 195, discount_price: 168 },
            { unit: "2kg", price: 380, discount_price: 325 }
        ]
    },

    // ================= PERSONAL CARE & CLEANING =================
    {
        id: "pc-colgate-toothpaste",
        name: "Colgate Toothpaste",
        unit: "150g",
        type: "Personal Care & Cleaning",
        quantity: 0,
        price: 125,
        discount_price: 105,
        stock: 35,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/d9ef0c4b-c741-4cfd-8aee-87612f0e8f00-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "16% OFF",
        megaCoins: 20,
        variants: [
            { unit: "150g", price: 125, discount_price: 105 },
            { unit: "Saver Pack 300g (150g x 2)", price: 240, discount_price: 195 }
        ]
    },
    {
        id: "pc-dettol-handwash",
        name: "Dettol Handwash",
        unit: "675ml",
        type: "Personal Care & Cleaning",
        quantity: 0,
        price: 135,
        discount_price: 115,
        stock: 30,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/ea3c8734-bca5-4c04-aee3-bc1ee643ec13-1.jpeg",
        megaCoins: 20,
        variants: [
            { unit: "675ml", price: 135, discount_price: 115 },
            { unit: "1.5L Value Pack", price: 275, discount_price: 229 }
        ]
    },
    {
        id: "pc-nivea-lotion",
        name: "Nivea Lotion",
        unit: "200ml",
        type: "Personal Care & Cleaning",
        quantity: 0,
        price: 249,
        discount_price: 199,
        stock: 20,
        maxPerOrder: 4,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/88d1840f-7b19-4b2a-8ffc-99c6806509a2-1.jpeg",
        isFlashDeal: true,
        flashDiscount: "20% OFF",
        megaCoins: 30,
        variants: [
            { unit: "200ml", price: 249, discount_price: 199 },
            { unit: "400ml Pump Bottle", price: 449, discount_price: 349 }
        ]
    },
    {
        id: "pc-lizol-cleaner",
        name: "Lizol Cleaner",
        unit: "500ml",
        type: "Personal Care & Cleaning",
        quantity: 0,
        price: 110,
        discount_price: 98,
        stock: 35,
        maxPerOrder: 6,
        countryoforigin: "india",
        src: "https://cdn.zeptonow.com/production///tr:w-640,ar-1000-1000,pr-true,f-auto,q-80/inventory/product/d045d475-680c-43f1-b98f-a9db154aa1a4-1.jpeg",
        megaCoins: 15,
        variants: [
            { unit: "500ml", price: 110, discount_price: 98 },
            { unit: "1L Bottle", price: 215, discount_price: 185 },
            { unit: "2L Family Pack", price: 399, discount_price: 339 }
        ]
    }
];

/**
 * Returns variants for any product, guaranteeing fallback multi-weight options.
 */
export function getProductVariants(item) {
    if (item && Array.isArray(item.variants) && item.variants.length > 0) {
        return item.variants;
    }
    const unit = item?.unit || "1 unit";
    const p = item?.price || 50;
    const dp = item?.discount_price || 40;
    return [
        { unit: unit, price: p, discount_price: dp },
        { unit: `2x (${unit})`, price: Math.round(p * 1.9), discount_price: Math.round(dp * 1.85) }
    ];
}

/**
 * Returns Flipkart-style MegaCoins earned for an item purchase.
 */
export function getProductCoins(item) {
    if (item && item.megaCoins) return item.megaCoins;
    const dp = Number(item?.discount_price) || 0;
    return Math.max(15, Math.floor(dp * 0.15));
}

/**
 * Ironclad Price Tampering Guard & Authoritative Catalog
 * Deep-frozen catalog prevents runtime tampering via browser console or malicious scripts.
 */
export const IMMUTABLE_CATALOG = Object.freeze(
    Model.reduce((acc, item) => {
        acc[item.name] = Object.freeze({
            id: item.id,
            name: item.name,
            unit: item.unit,
            type: item.type,
            price: Number(item.price),
            discount_price: Number(item.discount_price),
            stock: Number(item.stock),
            maxPerOrder: Number(item.maxPerOrder || 6),
            countryoforigin: item.countryoforigin,
            src: item.src,
            isFlashDeal: item.isFlashDeal,
            flashDiscount: item.flashDiscount,
            megaCoins: item.megaCoins,
            variants: item.variants ? Object.freeze([...item.variants]) : undefined
        });
        return acc;
    }, {})
);

/**
 * Strictly returns authoritative, untamperable item definition.
 * Any client or DOM alterations to prices are ignored.
 */
export function getAuthoritativeItem(itemName) {
    if (!itemName || typeof itemName !== "string") return null;
    return IMMUTABLE_CATALOG[itemName.trim()] || null;
}

/**
 * Authoritatively computes subtotal from model definitions alone.
 */
export function computeSafeSubtotal(items) {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => {
        const auth = getAuthoritativeItem(item.name);
        if (!auth) return sum;
        const validQty = Math.max(0, Math.min(Number(item.quantity) || 0, auth.stock, auth.maxPerOrder));
        return sum + (auth.discount_price * validQty);
    }, 0);
}
