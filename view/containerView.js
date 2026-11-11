const MEGAMART_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23f8fafc%22/%3E%3Ctext x=%22100%22 y=%22110%22 font-size=%2218%22 font-family=%22sans-serif%22 font-weight=%22bold%22 fill=%22%2394a3b8%22 text-anchor=%22middle%22%3EMegaMart%3C/text%3E%3C/svg%3E";
import { Controller } from "../controller/controller";
import { getProductVariants, getProductCoins } from "../model/model";
import { supabase, cloudSignUp, cloudSignIn, cloudSignOut, createCloudOrder, getCloudOrders } from "../services/supabaseClient";
import { MegaAiCopilot } from "../services/aiCopilotService";
import { executeSemanticSearch } from "../services/semanticSearch";

const SUB_MEGA_MENU_DATA = {
    'Fashion & Apparel': {
        "Men's Apparel": [
            {
                title: "Ethnic Wear",
                items: [
                    { label: "Sherwani", query: "sherwani" },
                    { label: "Dhotis", query: "dhoti" },
                    { label: "Kurtas", query: "kurta" },
                    { label: "Harem Pants", query: "harem" },
                    { label: "Ethnic Bottom", query: "ethnic bottom" },
                    { label: "All Ethnic Wear", query: "ethnic" }
                ]
            },
            {
                title: "Western Wear",
                items: [
                    { label: "Jeans", query: "jeans" },
                    { label: "T-Shirts", query: "t-shirt" },
                    { label: "Jackets", query: "jacket" },
                    { label: "Sweatshirts", query: "sweatshirt" },
                    { label: "Shrugs", query: "shrug" },
                    { label: "Shorts", query: "shorts" },
                    { label: "Cargo Pants", query: "cargo" },
                    { label: "Co-ord Sets", query: "co-ord" },
                    { label: "Topwear", query: "shirt" },
                    { label: "Sweaters", query: "sweater" }
                ]
            },
            {
                title: "Mens Formal Wear",
                items: [
                    { label: "Shirts", query: "shirt" },
                    { label: "Blazers", query: "blazer" },
                    { label: "Waistcoats", query: "waistcoat" },
                    { label: "Trousers", query: "trouser" },
                    { label: "Suits", query: "suit" },
                    { label: "Formal Shirts", query: "formal shirt" }
                ]
            },
            {
                title: "Inner Wear",
                items: [
                    { label: "Vests", query: "vest" },
                    { label: "Underwear", query: "underwear" },
                    { label: "Lungis", query: "lungi" },
                    { label: "Night Suits", query: "night suit" },
                    { label: "Bandana", query: "bandana" },
                    { label: "Thermals", query: "thermal" },
                    { label: "Innerwear", query: "innerwear" },
                    { label: "Boxers", query: "boxer" },
                    { label: "Tights", query: "tights" },
                    { label: "Bodyshaper", query: "bodyshaper" }
                ]
            },
            {
                title: "Loungewear & Activewear",
                items: [
                    { label: "Track Pant", query: "track pant" },
                    { label: "Tracksuits", query: "tracksuit" },
                    { label: "Swimming Costume", query: "swim" },
                    { label: "Bathrobes", query: "bathrobe" },
                    { label: "Winter Wear", query: "winter" },
                    { label: "Gloves", query: "gloves" }
                ]
            }
        ],
        "Women's Ethnic": [
            {
                title: "Kurtas & Suits",
                items: [
                    { label: "Kurtas & Kurtis", query: "kurta" },
                    { label: "Anarkali Suits", query: "anarkali" },
                    { label: "Straight Kurta Sets", query: "set" },
                    { label: "Ethnic Tunics", query: "tunic" },
                    { label: "Short Kurtis", query: "kurti" }
                ]
            },
            {
                title: "Sarees & Silk Drapes",
                items: [
                    { label: "Pure Silk Sarees", query: "silk" },
                    { label: "Georgette Sarees", query: "georgette" },
                    { label: "Cotton Handloom", query: "cotton" },
                    { label: "Banarasi Silk", query: "banarasi" },
                    { label: "Chiffon Sarees", query: "chiffon" }
                ]
            },
            {
                title: "Festive Occasion",
                items: [
                    { label: "Designer Lehenga Choli", query: "lehenga" },
                    { label: "Festive Ethnic Gowns", query: "gown" },
                    { label: "Sharara Sets", query: "sharara" },
                    { label: "Festive Dupattas", query: "dupatta" }
                ]
            },
            {
                title: "Ethnic Bottoms",
                items: [
                    { label: "Palazzos", query: "palazzo" },
                    { label: "Ethnic Skirts", query: "skirt" },
                    { label: "Leggings & Salwars", query: "salwar" },
                    { label: "Cigarette Pants", query: "pants" }
                ]
            },
            {
                title: "Top Ethnic Brands",
                items: [
                    { label: "Biba", brand: "Biba" },
                    { label: "Aurelia", brand: "Aurelia" },
                    { label: "FabIndia", brand: "FabIndia" },
                    { label: "Libas", brand: "Libas" },
                    { label: "W for Woman", brand: "W for Woman" }
                ]
            }
        ],
        "Footwear & Shoes": [
            {
                title: "Sports & Running",
                items: [
                    { label: "Running Shoes", query: "running" },
                    { label: "Training & Gym Shoes", query: "gym" },
                    { label: "Walking Shoes", query: "walking" },
                    { label: "Turf Trainers", query: "sports" }
                ]
            },
            {
                title: "Casual Sneakers",
                items: [
                    { label: "Low-Top Sneakers", query: "sneaker" },
                    { label: "Canvas Shoes", query: "canvas" },
                    { label: "Slip-On Sneakers", query: "slip" },
                    { label: "High-Top Streetwear", query: "high" }
                ]
            },
            {
                title: "Daily & Clogs",
                items: [
                    { label: "Lightweight Clogs", query: "clog" },
                    { label: "Daily Sliders", query: "slide" },
                    { label: "Flip-Flops", query: "flip" },
                    { label: "Comfort Sandals", query: "sandal" }
                ]
            },
            {
                title: "Boots & Formal",
                items: [
                    { label: "Leather Ankle Boots", query: "boot" },
                    { label: "Derby Formal Shoes", query: "derby" },
                    { label: "Oxford Shoes", query: "oxford" },
                    { label: "Loafers", query: "loafer" }
                ]
            },
            {
                title: "Top Brands",
                items: [
                    { label: "Nike", brand: "Nike" },
                    { label: "Adidas", brand: "Adidas" },
                    { label: "Puma", brand: "Puma" },
                    { label: "Crocs", brand: "Crocs" },
                    { label: "Red Tape", brand: "Red Tape" },
                    { label: "Woodland", brand: "Woodland" }
                ]
            }
        ],
        "Watches & Accessories": [
            {
                title: "Chronograph & Analog",
                items: [
                    { label: "Chronograph Watches", query: "chronograph" },
                    { label: "Stainless Steel Dial", query: "stainless" },
                    { label: "Minimalist Watches", query: "watch" },
                    { label: "Sport Watches", query: "sport" }
                ]
            },
            {
                title: "Smart Wearables",
                items: [
                    { label: "Bluetooth Calling Watches", query: "smart" },
                    { label: "Fitness Trackers", query: "fitness" },
                    { label: "AMOLED Watches", query: "amoled" }
                ]
            },
            {
                title: "Sunglasses & Eyewear",
                items: [
                    { label: "Polarized Sunglasses", query: "sunglasses" },
                    { label: "Classic Aviators", query: "aviator" },
                    { label: "Wayfarer Frames", query: "wayfarer" },
                    { label: "UV400 Protection", query: "uv" }
                ]
            },
            {
                title: "Leather Essentials",
                items: [
                    { label: "Pure Leather Belts", query: "belt" },
                    { label: "Bifold Wallets", query: "wallet" },
                    { label: "Slim Cardholders", query: "card" }
                ]
            },
            {
                title: "Top Brands",
                items: [
                    { label: "Casio", brand: "Casio" },
                    { label: "Titan", brand: "Titan" },
                    { label: "Fastrack", brand: "Fastrack" },
                    { label: "Ray-Ban", brand: "Ray-Ban" },
                    { label: "Police", brand: "Police" }
                ]
            }
        ]
    },
    'Electronics & Gadgets': {
        "Smartphones": [
            {
                title: "Flagship 5G",
                items: [
                    { label: "Apple iPhone 15 Pro", brand: "Apple" },
                    { label: "Samsung Galaxy S24 Ultra", brand: "Samsung" },
                    { label: "Google Pixel 8 AI", brand: "Google" },
                    { label: "OnePlus 12 5G", brand: "OnePlus" }
                ]
            },
            {
                title: "Performance & Gaming",
                items: [
                    { label: "iQOO 12 5G", brand: "iQOO" },
                    { label: "Xiaomi 14 Leica", brand: "Xiaomi" },
                    { label: "Snapdragon 8 Gen 3", query: "snapdragon" },
                    { label: "120Hz AMOLED Phones", query: "amoled" }
                ]
            },
            {
                title: "Camera & Optics",
                items: [
                    { label: "200MP Ultra Vision", query: "camera" },
                    { label: "Periscope Zoom", query: "zoom" },
                    { label: "4K HDR Video", query: "video" }
                ]
            },
            {
                title: "Battery & Fast Charge",
                items: [
                    { label: "5000mAh+ Battery", query: "5000" },
                    { label: "120W HyperCharge", query: "charge" },
                    { label: "Wireless Qi Charging", query: "wireless" }
                ]
            },
            {
                title: "Top Phone Brands",
                items: [
                    { label: "Apple", brand: "Apple" },
                    { label: "Samsung", brand: "Samsung" },
                    { label: "Google", brand: "Google" },
                    { label: "OnePlus", brand: "OnePlus" },
                    { label: "Xiaomi", brand: "Xiaomi" }
                ]
            }
        ],
        "TWS & Audio": [
            {
                title: "Active Noise Cancelling",
                items: [
                    { label: "Flagship ANC Earbuds", query: "anc" },
                    { label: "Sony High-Res ANC", brand: "Sony" },
                    { label: "Dual Mic Clear Call", query: "mic" }
                ]
            },
            {
                title: "True Wireless Earbuds",
                items: [
                    { label: "40H+ Playtime TWS", query: "earbuds" },
                    { label: "Gaming Low Latency", query: "gaming" },
                    { label: "Touch Control Buds", query: "touch" }
                ]
            },
            {
                title: "Over-Ear Headphones",
                items: [
                    { label: "Studio Monitoring", query: "headphone" },
                    { label: "Deep Bass Boost", query: "bass" },
                    { label: "Wireless Foldable", query: "wireless" }
                ]
            },
            {
                title: "Neckbands & Sports",
                items: [
                    { label: "Magnetic Fast Charge", query: "neckband" },
                    { label: "Water Resistant IPX5", query: "ipx" }
                ]
            },
            {
                title: "Top Audio Brands",
                items: [
                    { label: "Sony", brand: "Sony" },
                    { label: "boAt", brand: "boAt" },
                    { label: "JBL", brand: "JBL" },
                    { label: "Boult", brand: "Boult" },
                    { label: "Noise", brand: "Noise" }
                ]
            }
        ],
        "Smartwatches": [
            {
                title: "AMOLED Calling",
                items: [
                    { label: "Ultra AMOLED Displays", query: "amoled" },
                    { label: "Bluetooth Calling", query: "calling" },
                    { label: "Rotating Digital Crown", query: "crown" }
                ]
            },
            {
                title: "Luxury Straps",
                items: [
                    { label: "Stainless Steel Mesh", query: "stainless" },
                    { label: "Magnetic Milanese", query: "magnetic" },
                    { label: "Genuine Leather", query: "leather" }
                ]
            },
            {
                title: "Health & Sports",
                items: [
                    { label: "SpO2 & Heart Rate", query: "heart" },
                    { label: "Sleep & Stress Tracking", query: "sleep" },
                    { label: "100+ Sports Modes", query: "sports" }
                ]
            },
            {
                title: "Top Watch Brands",
                items: [
                    { label: "Fire-Boltt", brand: "Fire-Boltt" },
                    { label: "Noise", brand: "Noise" },
                    { label: "Amazfit", brand: "Amazfit" },
                    { label: "Fastrack", brand: "Fastrack" }
                ]
            }
        ],
        "Power & Chargers": [
            {
                title: "High Capacity Banks",
                items: [
                    { label: "20,000mAh Power Banks", query: "20000" },
                    { label: "10,000mAh Slim Pocket", query: "10000" },
                    { label: "65W Laptop Banks", query: "65w" }
                ]
            },
            {
                title: "GaN Fast Adaptors",
                items: [
                    { label: "65W GaN Multi-Port", query: "gan" },
                    { label: "33W Fast Charger", query: "33w" },
                    { label: "Dual Type-C Adaptors", query: "dual" }
                ]
            },
            {
                title: "Braided Cables",
                items: [
                    { label: "100W Type-C to C", query: "type-c" },
                    { label: "Braided Lightning", query: "lightning" },
                    { label: "3-in-1 Universal Cable", query: "universal" }
                ]
            },
            {
                title: "Top Power Brands",
                items: [
                    { label: "Anker", brand: "Anker" },
                    { label: "Ambrane", brand: "Ambrane" },
                    { label: "URBN", brand: "URBN" },
                    { label: "Spigen", brand: "Spigen" }
                ]
            }
        ],
        "Speakers": [
            {
                title: "Portable Bluetooth",
                items: [
                    { label: "IPX7 Waterproof", query: "waterproof" },
                    { label: "20H Battery Outdoor", query: "portable" },
                    { label: "Clip-On Travel", query: "clip" }
                ]
            },
            {
                title: "Home Soundbars",
                items: [
                    { label: "Dolby Soundbars", query: "soundbar" },
                    { label: "Deep Bass Subwoofer", query: "subwoofer" },
                    { label: "TV Optical Sound", query: "optical" }
                ]
            },
            {
                title: "Top Speaker Brands",
                items: [
                    { label: "JBL", brand: "JBL" },
                    { label: "Marshall", brand: "Marshall" },
                    { label: "Sony", brand: "Sony" },
                    { label: "boAt", brand: "boAt" }
                ]
            }
        ],
        "Tech Accessories": [
            {
                title: "Laptop Stands & Hubs",
                items: [
                    { label: "Aluminum Laptop Stand", query: "stand" },
                    { label: "USB-C Multi Hubs", query: "hub" },
                    { label: "Cooling Pads", query: "cooling" }
                ]
            },
            {
                title: "Gaming & Productivity",
                items: [
                    { label: "RGB Mechanical Keyboard", query: "keyboard" },
                    { label: "Wireless Precision Mouse", query: "mouse" },
                    { label: "Extended Desk Mats", query: "mat" }
                ]
            },
            {
                title: "Phone Protection",
                items: [
                    { label: "Shockproof Armor Cases", query: "case" },
                    { label: "9H Tempered Glass", query: "glass" },
                    { label: "Camera Protectors", query: "lens" }
                ]
            }
        ]
    },
    'Home & Kitchen': {
        "Appliances": [
            {
                title: "Smart Cooking",
                items: [
                    { label: "Digital Air Fryers 5L+", query: "air fryer" },
                    { label: "Convection OTG Ovens", query: "otg" },
                    { label: "Induction Cooktops 2000W", query: "induction" }
                ]
            },
            {
                title: "Grinders & Blenders",
                items: [
                    { label: "750W Heavy Mixers", query: "mixer" },
                    { label: "Nutri-Blenders", query: "blender" },
                    { label: "Cold Press Juicers", query: "juicer" }
                ]
            },
            {
                title: "Kettles & Breakfast",
                items: [
                    { label: "Stainless Auto Kettles", query: "kettle" },
                    { label: "Pop-Up Toasters", query: "toaster" },
                    { label: "Egg Boilers", query: "egg boiler" }
                ]
            },
            {
                title: "Top Brands",
                items: [
                    { label: "Philips", brand: "Philips" },
                    { label: "Bajaj", brand: "Bajaj" },
                    { label: "Morphy Richards", brand: "Morphy Richards" },
                    { label: "Kent", brand: "Kent" }
                ]
            }
        ],
        "Cookware": [
            {
                title: "Triply Stainless Steel",
                items: [
                    { label: "Triply Heavy Base Kadai", query: "kadai" },
                    { label: "Triply Saucepan", query: "saucepan" },
                    { label: "Triply Deep Frypans", query: "frypan" }
                ]
            },
            {
                title: "Granite Non-Stick",
                items: [
                    { label: "5-Layer Dosa Tawa", query: "tawa" },
                    { label: "Deep Fry Pans", query: "pan" },
                    { label: "Grill Pans", query: "grill" }
                ]
            },
            {
                title: "Pressure Cookers",
                items: [
                    { label: "Hard Anodized Cookers", query: "cooker" },
                    { label: "Stainless Steel Handi", query: "handi" }
                ]
            },
            {
                title: "Top Cookware Brands",
                items: [
                    { label: "Prestige", brand: "Prestige" },
                    { label: "Hawkins", brand: "Hawkins" },
                    { label: "Vinod", brand: "Vinod" },
                    { label: "Wonderchef", brand: "Wonderchef" }
                ]
            }
        ],
        "Storage & Flasks": [
            {
                title: "Airtight Glass Jars",
                items: [
                    { label: "Borosilicate Spice Jars", query: "glass" },
                    { label: "Bamboo Lid Containers", query: "container" },
                    { label: "Oil Pourer Bottles", query: "pourer" }
                ]
            },
            {
                title: "Steel Flasks",
                items: [
                    { label: "24H Hot & Cold Bottles", query: "flask" },
                    { label: "Insulated Sippers", query: "bottle" },
                    { label: "Gym Shakers", query: "shaker" }
                ]
            },
            {
                title: "Top Storage Brands",
                items: [
                    { label: "Milton", brand: "Milton" },
                    { label: "Cello", brand: "Cello" },
                    { label: "Borosil", brand: "Borosil" },
                    { label: "Tupperware", brand: "Tupperware" }
                ]
            }
        ],
        "Furnishing & Decor": [
            {
                title: "Bedding & Comfort",
                items: [
                    { label: "100% Cotton Bedsheets", query: "bedsheet" },
                    { label: "Fitted Bed Sheets", query: "fitted" },
                    { label: "Reversible Comforters", query: "comforter" }
                ]
            },
            {
                title: "Pillows & Cushions",
                items: [
                    { label: "Memory Foam Ortho Pillows", query: "pillow" },
                    { label: "Microfiber Sleeping Pillows", query: "microfiber" },
                    { label: "Velvet Cushions", query: "cushion" }
                ]
            },
            {
                title: "Bath Linen",
                items: [
                    { label: "600 GSM Cotton Towels", query: "towel" },
                    { label: "Anti-Skid Memory Foam Mats", query: "mat" }
                ]
            },
            {
                title: "Top Brands",
                items: [
                    { label: "Spaces", brand: "Spaces" },
                    { label: "Solimo", brand: "Solimo" },
                    { label: "Wakefit", brand: "Wakefit" }
                ]
            }
        ]
    },
    'Beauty & Personal Care': {
        "Grooming Tools": [
            {
                title: "Beard Trimmers",
                items: [
                    { label: "Cordless 90 Min Run-time", query: "trimmer" },
                    { label: "Titanium Blades", query: "titanium" },
                    { label: "Precision 0.5mm Dial", query: "precision" }
                ]
            },
            {
                title: "Hair Styling",
                items: [
                    { label: "Salon Hair Dryers 2000W", query: "dryer" },
                    { label: "Ceramic Straighteners", query: "straightener" },
                    { label: "Curling Wands", query: "curler" }
                ]
            },
            {
                title: "Top Grooming Brands",
                items: [
                    { label: "Philips", brand: "Philips" },
                    { label: "Vega", brand: "Vega" },
                    { label: "Syska", brand: "Syska" },
                    { label: "Beardo", brand: "Beardo" }
                ]
            }
        ],
        "Skincare": [
            {
                title: "Cleansers & Facewash",
                items: [
                    { label: "Charcoal Deep Impact", query: "charcoal" },
                    { label: "Gentle Skin Cleansers", query: "cleanser" },
                    { label: "Foaming Face Wash", query: "face wash" }
                ]
            },
            {
                title: "Moisturizers & Body Milk",
                items: [
                    { label: "Deep Nourishing Milk", query: "milk" },
                    { label: "Ceramide Creams", query: "cream" },
                    { label: "Lightweight Gel Lotions", query: "gel" }
                ]
            },
            {
                title: "Top Skincare Brands",
                items: [
                    { label: "Nivea", brand: "Nivea" },
                    { label: "Cetaphil", brand: "Cetaphil" },
                    { label: "Mamaearth", brand: "Mamaearth" },
                    { label: "Neutrogena", brand: "Neutrogena" }
                ]
            }
        ],
        "Haircare": [
            {
                title: "Shampoos & Conditioners",
                items: [
                    { label: "Anti-Dandruff Shampoos", query: "shampoo" },
                    { label: "Total Repair 5 Keratin", query: "repair" },
                    { label: "Deep Hair Spa Masks", query: "conditioner" }
                ]
            },
            {
                title: "Top Haircare Brands",
                items: [
                    { label: "L'Oreal", brand: "L'Oreal" },
                    { label: "Tresemme", brand: "Tresemme" },
                    { label: "Dove", brand: "Dove" },
                    { label: "Head & Shoulders", brand: "Head & Shoulders" }
                ]
            }
        ],
        "Fragrance & Hygiene": [
            {
                title: "Deodorants & Perfumes",
                items: [
                    { label: "Long-Lasting Deodorants", query: "deodorant" },
                    { label: "Eau De Parfum Luxury", query: "perfume" },
                    { label: "Woody Gentleman Cologne", query: "cologne" }
                ]
            },
            {
                title: "Hand & Body Hygiene",
                items: [
                    { label: "Germ Protection Handwash", query: "handwash" },
                    { label: "Moisture Glycerin Soaps", query: "soap" }
                ]
            },
            {
                title: "Top Fragrance Brands",
                items: [
                    { label: "Fogg", brand: "Fogg" },
                    { label: "Wild Stone", brand: "Wild Stone" },
                    { label: "Yardley", brand: "Yardley" },
                    { label: "Dettol", brand: "Dettol" }
                ]
            }
        ]
    },
    'Snacks & Munchies': {
        "Chips & Crisps": [
            {
                title: "Crisps & Nachos",
                items: [
                    { label: "Potato Chips & Wafers", query: "chips" },
                    { label: "Gourmet Corn Nachos", query: "nachos" },
                    { label: "Roasted Makhana Puffs", query: "makhana" }
                ]
            },
            {
                title: "Top Brands",
                items: [
                    { label: "Lay's", brand: "Lay's" },
                    { label: "Pringles", brand: "Pringles" },
                    { label: "Doritos", brand: "Doritos" },
                    { label: "Bingo", brand: "Bingo" }
                ]
            }
        ],
        "Biscuits & Cookies": [
            {
                title: "Cookies & Bakery",
                items: [
                    { label: "Choco Filled Molten Lava", query: "choco" },
                    { label: "Butter Cashew Cookies", query: "butter" },
                    { label: "Whole Wheat Digestive", query: "digestive" }
                ]
            },
            {
                title: "Top Brands",
                items: [
                    { label: "Dark Fantasy", brand: "Dark Fantasy" },
                    { label: "Oreo", brand: "Oreo" },
                    { label: "Britannia", brand: "Britannia" },
                    { label: "Unibic", brand: "Unibic" }
                ]
            }
        ],
        "Chocolates & Sweets": [
            {
                title: "Chocolates & Gifts",
                items: [
                    { label: "Dairy Milk Silk Hazelnut", brand: "Cadbury" },
                    { label: "Ferrero Rocher Truffles", brand: "Ferrero Rocher" },
                    { label: "Celebrations Gift Boxes", query: "celebration" }
                ]
            }
        ],
        "Namkeen & Traditional": [
            {
                title: "Traditional Namkeen",
                items: [
                    { label: "Aloo Bhujia Spicy", brand: "Haldiram's" },
                    { label: "Royal Shahi Mixture", query: "mixture" },
                    { label: "Salted Roasted Cashews", brand: "Happilo" }
                ]
            }
        ]
    },
    'Cold Drinks & Beverages': {
        "Tea & Coffee": [
            {
                title: "Gourmet Coffee",
                items: [
                    { label: "100% Freeze-Dried Pure Coffee", query: "freeze" },
                    { label: "Rich Aroma Ground Coffee", query: "aroma" },
                    { label: "Davidoff & Nescafe", brand: "Davidoff" }
                ]
            },
            {
                title: "Assam & Green Tea",
                items: [
                    { label: "Assam CTC Gold Leaf", query: "assam" },
                    { label: "Twinings Green Tea", brand: "Twinings" },
                    { label: "Wagh Bakri Leaf Tea", brand: "Wagh Bakri" }
                ]
            }
        ],
        "Cold Drinks & Soda": [
            {
                title: "Carbonated Drinks",
                items: [
                    { label: "Coca-Cola & Thums Up", brand: "Coca-Cola" },
                    { label: "Sprite Lemon Soda", brand: "Sprite" },
                    { label: "Appy Fizz Sparkling", brand: "Appy Fizz" }
                ]
            }
        ],
        "Energy Drinks & Juices": [
            {
                title: "Juices & Boosters",
                items: [
                    { label: "Red Bull Energy Drink", brand: "Red Bull" },
                    { label: "Monster Energy", brand: "Monster" },
                    { label: "Tropicana 100% Fruit", brand: "Tropicana" },
                    { label: "Paper Boat Mango Aamras", brand: "Paper Boat" }
                ]
            }
        ]
    },
    'Dairy, Bread & Eggs': {
        "Milk & Dairy": [
            {
                title: "Fresh Milk & Paneer",
                items: [
                    { label: "Fresh Cow Milk & Toned", brand: "Amul" },
                    { label: "Mother Dairy Pouch Milk", brand: "Mother Dairy" },
                    { label: "Epigamia Greek Yogurt", brand: "Epigamia" }
                ]
            }
        ],
        "Butter & Cheese": [
            {
                title: "Butter & Cheese Blocks",
                items: [
                    { label: "Amul Pasteurized Butter", brand: "Amul" },
                    { label: "Go Cheese Slices & Cubes", brand: "Go Cheese" },
                    { label: "Britannia Cheese Block", brand: "Britannia" }
                ]
            }
        ],
        "Breads & Buns": [
            {
                title: "Artisan Bakery",
                items: [
                    { label: "100% Whole Wheat Bread", query: "wheat" },
                    { label: "English Oven Multigrain", brand: "English Oven" },
                    { label: "Harvest Gold Sweet Buns", brand: "Harvest Gold" }
                ]
            }
        ],
        "Eggs & Poultry": [
            {
                title: "Farm Fresh Eggs",
                items: [
                    { label: "Eggoz Farm White Eggs", brand: "Eggoz" },
                    { label: "Kadaknath Protein Eggs", brand: "Kadaknath" }
                ]
            }
        ]
    },
    'House Hold': {
        "Detergents & Laundry": [
            {
                title: "Laundry Detergents",
                items: [
                    { label: "Matic Top & Front Load Powder", query: "matic" },
                    { label: "Surf Excel Liquid Pouch", brand: "Surf Excel" },
                    { label: "Ariel Matic Powder", brand: "Ariel" }
                ]
            }
        ],
        "Cleaning & Disinfectants": [
            {
                title: "Surface Cleaners",
                items: [
                    { label: "Lizol Citrus Surface Cleaner", brand: "Lizol" },
                    { label: "Harpic Power Toilet Cleaner", brand: "Harpic" },
                    { label: "Colin Glass Cleaner", brand: "Colin" },
                    { label: "Vim & Pril Dishwash", brand: "Vim" }
                ]
            }
        ],
        "Pest Control & Paper": [
            {
                title: "Pest & Paper",
                items: [
                    { label: "Good knight Mosquito Refills", brand: "Good knight" },
                    { label: "Hit Insect Spray", brand: "Hit" },
                    { label: "Origami Soft Tissue Rolls", brand: "Origami" }
                ]
            }
        ]
    },
    'Staples, Atta & Oil': {
        "Atta & Flours": [
            {
                title: "Fresh Atta",
                items: [
                    { label: "Aashirvaad Shudh Chakki Atta", brand: "Aashirvaad" },
                    { label: "Fortune MP Sharbati Atta", brand: "Fortune" },
                    { label: "Pillsbury Whole Wheat", brand: "Pillsbury" }
                ]
            }
        ],
        "Edible Oils & Ghee": [
            {
                title: "Pure Oils & Ghee",
                items: [
                    { label: "Fortune Sunlite Refined Oil", brand: "Fortune" },
                    { label: "Saffola Gold Blended Oil", brand: "Saffola" },
                    { label: "Dhara Kachi Ghani Mustard", brand: "Dhara" },
                    { label: "Amul Pure Cow Ghee", brand: "Amul" }
                ]
            }
        ],
        "Rice & Grains": [
            {
                title: "Basmati & Grains",
                items: [
                    { label: "Kohinoor Super Silver Aged", brand: "Kohinoor" },
                    { label: "Daawat Rozana Daily Rice", brand: "Daawat" },
                    { label: "Quaker Rolled Oats", brand: "Quaker" }
                ]
            }
        ],
        "Dals & Pulses": [
            {
                title: "Unpolished Pulses",
                items: [
                    { label: "Tata Sampann Toor Dal", brand: "Tata Sampann" },
                    { label: "Organic Tattva Moong Dal", brand: "Organic Tattva" },
                    { label: "Everest Chaat Masala", brand: "Everest" }
                ]
            }
        ]
    }
};

const SUB_TYPE_IMAGES = {
    "Appliances": "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&auto=format&fit=crop&q=80",
    "Atta & Flours": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
    "Biscuits & Cookies": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80",
    "Breads & Buns": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80&sig=dry-britannia-brown-bread",
    "Butter & Cheese": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80&sig=dry-amul-pasteurised-butter",
    "Chips & Crisps": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80",
    "Chocolates & Sweets": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80",
    "Cleaning & Disinfectants": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80&sig=hh-lizol-disinfectant-floor-cleaner",
    "Cold Drinks & Soda": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&auto=format&fit=crop&q=80",
    "Cookware": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80",
    "Dals & Pulses": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80",
    "Detergents & Laundry": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80",
    "Edible Oils & Ghee": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80",
    "Eggs & Poultry": "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=500&auto=format&fit=crop&q=80",
    "Energy Drinks": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
    "Footwear & Shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
    "Fragrance & Hygiene": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=80",
    "Furnishing & Decor": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop&q=80",
    "Grooming Tools": "https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=80",
    "Haircare": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80",
    "Instant Noodles & Pasta": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80",
    "Juices & Health Drinks": "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80",
    "Men's Apparel": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80",
    "Milk & Dairy": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80",
    "Namkeen & Traditional": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
    "Pest Control & Paper": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80&sig=hh-goodknight-gold-flash",
    "Power & Chargers": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80",
    "Rice & Grains": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80&sig=stp-indiagate-basmati-rice",
    "Salt & Sugar": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80&sig=stp-tata-salt-iodized",
    "Skincare": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
    "Smartphones": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80",
    "Smartwatches": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80",
    "Speakers": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80",
    "Spices & Masalas": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80",
    "Storage & Flasks": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80",
    "TWS & Audio": "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80",
    "Tea & Coffee": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
    "Tech Accessories": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80",
    "Watches & Accessories": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=80&sig=fsh-titan-octane-chronograph",
    "Women's Ethnic": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80"
};

export class ContainerView {
    constructor(data) {
        this.data = data;
        
        // Views
        this.homeView = document.getElementById('homeView');
        this.categoryView = document.getElementById('categoryView');
        this.productDetailView = document.getElementById('productDetailView');
        this.profileView = document.getElementById('profileView');
        this.cartPageView = document.getElementById('cartPageView');
        this.wishlistPageView = document.getElementById('wishlistPageView');
        this.ordersPageView = document.getElementById('ordersPageView');
        this.searchSuggestionsDropdown = document.getElementById('searchSuggestionsDropdown');
        this.searchClearBtn = document.getElementById('searchClearBtn');
        
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
        this.categorySubFilterPills = document.getElementById('categorySubFilterPills');
        this.activeSubType = 'All';
        
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

        // Shopsy / Flipkart Dynamic Filter & Mega Menu Bindings
        this.categoryFilterSidebar = document.getElementById('categoryFilterSidebar');
        this.sidebarFilterSections = document.getElementById('sidebarFilterSections');
        this.sidebarClearAllBtn = document.getElementById('sidebarClearAllBtn');
        this.sidebarActiveCount = document.getElementById('sidebarActiveCount');
        this.categoryFilterToggleBtn = document.getElementById('categoryFilterToggleBtn') || document.getElementById('mobileFilterDrawerBtn');
        this.sidebarCloseBtn = document.getElementById('sidebarCloseBtn') || document.getElementById('sidebarCloseMobileBtn');
        this.sidebarMobileBackdrop = document.getElementById('sidebarMobileBackdrop');
        this.categoryEcomLayout = document.querySelector('.category-ecom-layout');
        this.isFilterSidebarOpen = false;
        this.filterCountBadge = document.getElementById('filterCountBadge');
        this.activeFilterChipsRow = document.getElementById('activeFilterChipsRow');
        this.activeChipsList = document.getElementById('activeChipsList');
        this.clearAllChipsBtn = document.getElementById('clearAllChipsBtn');
        this.filterEmptyState = document.getElementById('filterEmptyState');
        this.emptyResetFiltersBtn = document.getElementById('emptyResetFiltersBtn');
        this.categoryItemCountPill = document.getElementById('categoryItemCountPill');
        
        this.categorySubFilterBar = document.getElementById('categorySubFilterBar');
        this.subMegaMenuDropdown = document.getElementById('subMegaMenuDropdown');
        this.subMegaMenuOverlay = document.getElementById('subMegaMenuOverlay');
        this.subMegaMenuInner = document.getElementById('subMegaMenuInner');
        this.subMegaMenuTimer = null;
        this.subMegaMenuHoverTimer = null;
        this.subMegaMenuCache = new Map();

        this.selectedFilters = {
            subTypes: new Set(),
            brands: new Set(),
            priceRanges: new Set(),
            ratings: new Set(),
            discounts: new Set(),
            searchQuery: ''
        };
        
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
        this.setupPromoBanners();
        this.setupCuratedRailAutoMotion();
        this.setupCartPageView();
        this.setupWishlistPageView();
        this.setupOrdersPageView();
        this.setupCategorySubMegaMenu();
        this.setupDynamicCategoryFilters();
        this.setupFooterLinks();
        this.aiCopilot = new MegaAiCopilot(this.data);
        this.setupMegaAiCopilot();
        
        this.setActiveView(this.homeView);
        if (window.lucide) lucide.createIcons();
    }

    setupCuratedRailAutoMotion() {
        const rails = document.querySelectorAll('.flipkart-curated-rail');
        if (!rails.length) return;

        rails.forEach(section => {
            const track = section.querySelector('.curated-rail-track');
            if (!track) return;

            // Crucial: remove smooth scroll-behavior during frame-by-frame animation to eliminate micro-stutters
            track.style.scrollBehavior = 'auto';

            const direction = section.dataset.direction || 'left';
            const baseSpeed = parseFloat(section.dataset.speed || '1.0');
            // Silky smooth cruising speed (~110-130px/sec)
            const speedMultiplier = 1.85 * baseSpeed; 
            
            let isPaused = false;
            let pauseTimer = null;
            let currentDir = (direction === 'right') ? -1 : 1;
            
            // If direction is right, start initially scrolled towards the end so both directions move simultaneously
            if (direction === 'right' && track.scrollWidth > track.clientWidth) {
                track.scrollLeft = track.scrollWidth - track.clientWidth - 10;
            }

            // Accurate subpixel float position tracker
            let exactScroll = track.scrollLeft;

            // Pause on mouse hover
            section.addEventListener('mouseenter', () => { isPaused = true; });
            section.addEventListener('mouseleave', () => { 
                isPaused = false; 
                exactScroll = track.scrollLeft; 
            });

            // Pause on mobile touch
            section.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
            section.addEventListener('touchend', () => {
                clearTimeout(pauseTimer);
                pauseTimer = setTimeout(() => { 
                    isPaused = false; 
                    exactScroll = track.scrollLeft;
                }, 2000);
            }, { passive: true });

            // Prev & Next arrow button clicks
            const prevBtn = section.querySelector('.rail-nav-btn.rail-prev');
            const nextBtn = section.querySelector('.rail-nav-btn.rail-next');

            if (prevBtn) {
                prevBtn.onclick = (e) => {
                    e.preventDefault();
                    isPaused = true;
                    track.style.scrollBehavior = 'smooth';
                    track.scrollBy({ left: -360 });
                    clearTimeout(pauseTimer);
                    pauseTimer = setTimeout(() => { 
                        track.style.scrollBehavior = 'auto';
                        exactScroll = track.scrollLeft;
                        isPaused = false; 
                    }, 3000);
                };
            }

            if (nextBtn) {
                nextBtn.onclick = (e) => {
                    e.preventDefault();
                    isPaused = true;
                    track.style.scrollBehavior = 'smooth';
                    track.scrollBy({ left: 360 });
                    clearTimeout(pauseTimer);
                    pauseTimer = setTimeout(() => { 
                        track.style.scrollBehavior = 'auto';
                        exactScroll = track.scrollLeft;
                        isPaused = false; 
                    }, 3000);
                };
            }

            // High-precision 60fps/120fps smooth animation loop
            let lastTimestamp = 0;
            let endWaitTimer = null;
            let isWaitingAtEnd = false;

            const step = (timestamp) => {
                if (!lastTimestamp) lastTimestamp = timestamp;
                const delta = Math.min(timestamp - lastTimestamp, 50);
                lastTimestamp = timestamp;

                if (!isPaused && !isWaitingAtEnd && track.scrollWidth > track.clientWidth) {
                    const maxScroll = track.scrollWidth - track.clientWidth;
                    const moveAmount = speedMultiplier * (delta / 16.66);

                    exactScroll += (currentDir * moveAmount);

                    if (exactScroll >= maxScroll) {
                        exactScroll = maxScroll;
                        track.scrollLeft = maxScroll;
                        isWaitingAtEnd = true;
                        clearTimeout(endWaitTimer);
                        endWaitTimer = setTimeout(() => {
                            currentDir = -1;
                            isWaitingAtEnd = false;
                        }, 1200); // 1.2s graceful pause at the end
                    } else if (exactScroll <= 0) {
                        exactScroll = 0;
                        track.scrollLeft = 0;
                        isWaitingAtEnd = true;
                        clearTimeout(endWaitTimer);
                        endWaitTimer = setTimeout(() => {
                            currentDir = 1;
                            isWaitingAtEnd = false;
                        }, 1200); // 1.2s graceful pause at the beginning
                    } else {
                        track.scrollLeft = exactScroll;
                    }
                }
                requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        });

        this.setupBannerCountdowns();
    }

    setupBannerCountdowns() {
        let totalSeconds = 3 * 3600 + 42 * 60 + 18;
        const timerPills = document.querySelectorAll('.countdown-val');
        
        setInterval(() => {
            if (totalSeconds > 0) totalSeconds--;
            const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            timerPills.forEach(el => {
                el.textContent = `${h}:${m}:${s}`;
            });
        }, 1000);
    }

    setupPromoBanners() {
        const bannerElements = document.querySelectorAll(
            '.spotlight-card, .mega-festive-poster, .quad-deal-card, .promo-banner-card, .ecom-wide-poster, .spotlight-btn, .poster-main-cta, [data-category]'
        );
        bannerElements.forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const cat = el.getAttribute('data-category') || el.closest('[data-category]')?.getAttribute('data-category');
                if (cat) {
                    this.showCategoryView(cat);
                }
            });
        });
    }

    // ================= MOBILE UI =================
    setupBottomNav() {
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                
                if (item.id === 'mobileCartBtn') {
                    this.showCartPageView();
                    return;
                }
                if (item.id === 'bottomWishlistBtn') {
                    this.showWishlistPageView();
                    return;
                }
                if (item.id === 'mobileOrdersBtn') {
                    this.showOrdersPageView();
                    return;
                }
                
                bottomNavItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                if (view === 'home') {
                    this.showHomeView();
                } else if (view === 'categories') {
                    this.showCategoryView('All Products');
                } else if (view === 'search') {
                    this.globalSearchInput?.focus();
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
                this.showWishlistPageView();
            });
        }

        const mobileOrdersBtn = document.getElementById('mobileOrdersBtn');
        if (mobileOrdersBtn) {
            mobileOrdersBtn.addEventListener('click', () => {
                this.showOrdersPageView();
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
                    <img src="${item.src}" alt="${category}" onerror="this.src=MEGAMART_PLACEHOLDER">
                </div>
                <span>${category}</span>
            `;
            catItem.addEventListener('click', () => this.showCategoryView(category));
            this.quickCategories.appendChild(catItem);
        });
    }

    // ================= ROUTING & VIEWS =================
    setActiveView(activeView) {
        const allViews = [
            this.homeView, 
            this.categoryView, 
            this.productDetailView, 
            this.profileView, 
            this.cartPageView, 
            this.wishlistPageView, 
            this.ordersPageView
        ];

        allViews.forEach((view) => {
            if (!view) return;
            view.classList.remove('active');
            view.style.display = 'none';
        });

        if (activeView) {
            activeView.classList.add('active');
            activeView.style.display = 'flex';
        }
        
        // Hide footer on mobile for dedicated views (Orders, Wishlist, Cart, Profile)
        const hideFooterViews = [this.ordersPageView, this.wishlistPageView, this.cartPageView, this.profileView];
        if (hideFooterViews.includes(activeView)) {
            document.body.classList.add('hide-mobile-footer');
        } else {
            document.body.classList.remove('hide-mobile-footer');
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
        } else if (activeView === this.wishlistPageView) {
            document.getElementById('bottomWishlistBtn')?.classList.add('active');
        } else if (activeView === this.ordersPageView) {
            document.getElementById('mobileOrdersBtn')?.classList.add('active');
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

        const wishlistBtn = document.getElementById('wishlistButton');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showWishlistPageView();
            });
        }

        const ordersBtn = document.getElementById('headerOrdersBtn');
        if (ordersBtn) {
            ordersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showOrdersPageView();
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

    renderSubFilterPills(categoryName) {
        if (!this.categorySubFilterPills) return;
        this.categorySubFilterPills.innerHTML = '';
        this.closeSubMegaMenu();

        const catItems = this.getItemsForCategory(categoryName);
        if (!catItems || catItems.length === 0) return;

        const subTypeCounts = {};
        catItems.forEach(item => {
            if (item.subType) {
                subTypeCounts[item.subType] = (subTypeCounts[item.subType] || 0) + 1;
            }
        });

        const subTypes = Object.entries(subTypeCounts);
        if (subTypes.length <= 1) return;

        // 1. "All" Pill (Rounded with Icon Avatar)
        const allBtn = document.createElement('button');
        allBtn.type = 'button';
        allBtn.className = 'category-sub-pill active';
        allBtn.dataset.subtype = 'All';
        allBtn.innerHTML = `
            <div class="pill-thumb-avatar pill-avatar-all">
                <i data-lucide="layout-grid"></i>
            </div>
            <div class="pill-text-wrap">
                <span class="pill-title">All</span>
                <span class="pill-count">${catItems.length}</span>
            </div>
        `;
        allBtn.addEventListener('click', () => {
            this.closeSubMegaMenu();
            this.selectedFilters.subTypes.clear();
            this.activeSubType = 'All';
            this.syncSubFilterPillsWithSelection();
            this.applyFiltersAndRender();
        });
        this.categorySubFilterPills.appendChild(allBtn);

        // 2. SubType Pills (Rounded with Real Images & Chevron)
        subTypes.forEach(([subType, count]) => {
            const hasMega = !!(SUB_MEGA_MENU_DATA[categoryName] && SUB_MEGA_MENU_DATA[categoryName][subType]);
            const imgSrc = SUB_TYPE_IMAGES[subType] || MEGAMART_PLACEHOLDER;

            const pill = document.createElement('div');
            pill.className = `category-sub-pill ${hasMega ? 'has-sub-megamenu' : ''}`;
            pill.dataset.subtype = subType;
            pill.innerHTML = `
                <div class="pill-thumb-avatar">
                    <img src="${imgSrc}" alt="${subType}" class="pill-avatar-img" loading="lazy" onerror="this.src=MEGAMART_PLACEHOLDER">
                </div>
                <div class="pill-text-wrap">
                    <span class="pill-title">${subType}</span>
                    <span class="pill-count">${count}</span>
                </div>
                ${hasMega ? '<i data-lucide="chevron-down" class="pill-chevron"></i>' : ''}
            `;

            if (hasMega) {
                pill.addEventListener('mouseenter', () => {
                    if (window.innerWidth <= 900) return;
                    clearTimeout(this.subMegaMenuTimer);

                    // If menu is already open, switch pills smoothly with short 40ms debounce
                    if (this.subMegaMenuDropdown?.classList.contains('show')) {
                        clearTimeout(this.subMegaMenuHoverTimer);
                        this.subMegaMenuHoverTimer = setTimeout(() => {
                            this.openSubMegaMenu(categoryName, subType, pill, true);
                        }, 40);
                    } else {
                        // User hovered from outside: require 120ms hover intent to eliminate fly-by flicker
                        clearTimeout(this.subMegaMenuHoverTimer);
                        this.subMegaMenuHoverTimer = setTimeout(() => {
                            this.openSubMegaMenu(categoryName, subType, pill, false);
                        }, 120);
                    }
                });

                pill.addEventListener('mouseleave', (e) => {
                    if (window.innerWidth <= 900) return;
                    clearTimeout(this.subMegaMenuHoverTimer);

                    // If moving into dropdown, another pill, or the sub-filter bar container, DO NOT close!
                    if (e.relatedTarget && (
                        this.subMegaMenuDropdown?.contains(e.relatedTarget) || 
                        e.relatedTarget.closest?.('.category-sub-pill') ||
                        e.relatedTarget.closest?.('.category-sub-filter-bar')
                    )) {
                        return;
                    }
                    this.subMegaMenuTimer = setTimeout(() => {
                        this.closeSubMegaMenu();
                    }, 280);
                });

                pill.addEventListener('click', (e) => {
                    clearTimeout(this.subMegaMenuHoverTimer);
                    // On touch or small screens, toggle menu
                    if (window.innerWidth <= 900) {
                        if (!this.subMegaMenuDropdown?.classList.contains('show') || !pill.classList.contains('megamenu-open')) {
                            this.openSubMegaMenu(categoryName, subType, pill);
                        } else {
                            this.closeSubMegaMenu();
                        }
                    } else {
                        // On desktop click, close mega menu and filter
                        this.closeSubMegaMenu();
                    }
                    this.selectedFilters.subTypes.clear();
                    this.selectedFilters.subTypes.add(subType);
                    this.activeSubType = subType;
                    this.syncSubFilterPillsWithSelection();
                    this.applyFiltersAndRender();
                });
            } else {
                pill.addEventListener('click', () => {
                    clearTimeout(this.subMegaMenuHoverTimer);
                    this.closeSubMegaMenu();
                    this.selectedFilters.subTypes.clear();
                    this.selectedFilters.subTypes.add(subType);
                    this.activeSubType = subType;
                    this.syncSubFilterPillsWithSelection();
                    this.applyFiltersAndRender();
                });
            }

            this.categorySubFilterPills.appendChild(pill);
        });

        if (window.lucide) lucide.createIcons();
    }

    showCategoryView(categoryName, initialFilter = '') {
        this.currentCategory = categoryName;
        this.setActiveView(this.categoryView);
        
        if (this.categoryPageTitle) this.categoryPageTitle.textContent = categoryName;
        if (this.sortSelect) this.sortSelect.value = 'featured';
        
        // Ensure filter sidebar is closed by default on new category visit
        this.isFilterSidebarOpen = false;
        if (!this.categoryEcomLayout) this.categoryEcomLayout = document.querySelector('.category-ecom-layout');
        if (this.categoryEcomLayout) this.categoryEcomLayout.classList.remove('sidebar-open');
        if (this.categoryFilterSidebar) this.categoryFilterSidebar.classList.remove('mobile-open');
        if (this.sidebarMobileBackdrop) this.sidebarMobileBackdrop.classList.remove('open');
        if (this.categoryFilterToggleBtn) this.categoryFilterToggleBtn.classList.remove('btn-active');
        document.body.style.overflow = '';
        
        this.updateNavHighlight(categoryName);

        // Reset and seed selected filters
        this.selectedFilters = {
            subTypes: new Set(),
            brands: new Set(),
            priceRanges: new Set(),
            ratings: new Set(),
            discounts: new Set(),
            searchQuery: ''
        };

        if (initialFilter) {
            if (typeof initialFilter === 'string' && initialFilter.trim() !== '') {
                // If it matches a subType in this category, set subType; otherwise set searchQuery
                const catItems = this.getItemsForCategory(categoryName);
                const matchingSubType = catItems.find(it => it.subType && it.subType.toLowerCase() === initialFilter.toLowerCase());
                if (matchingSubType) {
                    this.selectedFilters.subTypes.add(matchingSubType.subType);
                    this.activeSubType = matchingSubType.subType;
                } else {
                    this.selectedFilters.searchQuery = initialFilter.trim();
                }
            } else if (typeof initialFilter === 'object') {
                if (initialFilter.subType) {
                    this.selectedFilters.subTypes.add(initialFilter.subType);
                    this.activeSubType = initialFilter.subType;
                }
                if (initialFilter.brand) this.selectedFilters.brands.add(initialFilter.brand);
                if (initialFilter.query) this.selectedFilters.searchQuery = initialFilter.query;
            }
        } else {
            this.activeSubType = 'All';
        }

        this.renderSubFilterPills(categoryName);
        this.buildDynamicSidebarFilters(categoryName);
        this.applyFiltersAndRender();
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
        const typeLower = (item.type || '').toLowerCase();
        let shelfLife = "6 - 24 Months (Brand Sealed)";
        let storageInstruction = "Store in a cool, dry place away from moisture";
        if (typeLower.includes('electronic')) {
            shelfLife = "1 Year Official Brand Warranty";
            storageInstruction = "Keep away from water & extreme heat";
        } else if (typeLower.includes('fashion')) {
            shelfLife = "Genuine Fabric & Color Guarantee";
            storageInstruction = "Machine wash cold; dry in shade";
        } else if (typeLower.includes('kitchen') || typeLower.includes('home')) {
            shelfLife = "5-Year Triply Base Durability Guarantee";
            storageInstruction = "Hand wash with mild sponge cleanser";
        }
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
            <!-- Top Fold: 2 Columns (Sticky Gallery Left, Core Purchase Info Right) -->
            <div class="pd-top-fold">
                <div class="pd-gallery">
                    <div class="pd-main-image-wrap" id="pdMainImageWrap">
                        <button class="pd-wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" data-name="${item.name}" id="pdWishlistBtn" aria-label="Toggle Wishlist" title="Wishlist">
                            <i data-lucide="heart"></i>
                        </button>
                        <img id="pdMainImage" src="${item.src}" alt="${item.name}" loading="eager" decoding="async" onerror="this.onerror=null;this.src=MEGAMART_PLACEHOLDER">
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
                </div>
            </div>

            <!-- Bottom Fold: FULL WIDTH 100% CONTAINER below top fold -->
            <div class="pd-full-width-details">
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
                                    <img src="${item.src}" alt="${item.name}" onerror="this.src=MEGAMART_PLACEHOLDER">
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
                                    <img src="${comp1.src}" alt="${comp1.name}" onerror="this.src=MEGAMART_PLACEHOLDER">
                                </div>
                                <div class="fbt-item-details">
                                    <span class="fbt-item-name">${comp1.name}</span>
                                    <span class="fbt-item-price">₹${comp1.discount_price}</span>
                                </div>
                            </div>

                            <div class="fbt-plus-symbol"><i data-lucide="plus"></i></div>

                            <div class="fbt-item" data-name="${comp2.name}">
                                <div class="fbt-img-wrap">
                                    <img src="${comp2.src}" alt="${comp2.name}" onerror="this.src=MEGAMART_PLACEHOLDER">
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

                <!-- Key Specifications Grid -->
                <div class="pd-specs-section">
                    <h3 class="specs-section-title"><i data-lucide="clipboard-list"></i> Product Specifications</h3>
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
        const relatedItems = this.controller.filterItems(item.type).filter(i => i.name !== item.name).slice(0, 10);
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

        // Also highlight matching sub-header tab
        document.querySelectorAll('.sub-nav-tab').forEach(tab => {
            const tabTarget = tab.dataset.tab;
            if (tabTarget === categoryName || (categoryName === 'Home' && tabTarget === 'For You')) {
                tab.classList.add('active');
                tab.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
            } else {
                tab.classList.remove('active');
            }
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
                <img src="${item.src}" alt="${item.name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=MEGAMART_PLACEHOLDER">
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
            'Electronics & Gadgets': {
                title: '⚡ Top Tech, Crazy Gadget Deals',
                subtitle: 'Wireless earbuds, smartwatches, power banks & fast chargers',
                ribbons: ['Min. 55% Off', 'Top Tech Deal', 'Under ₹1499', 'Best Seller', 'Min. 40% Off'],
                ribbonClass: 'ribbon-red'
            },
            'Fashion & Apparel': {
                title: '👟 Cool Kicks, Crazy Fashion Deals',
                subtitle: 'Trending polo t-shirts, sneakers, jeans & accessories',
                ribbons: ['Min. 60% Off', 'Crazy Deal', 'Under ₹999', 'Top Trending', 'Min. 50% Off'],
                ribbonClass: 'ribbon-amber'
            },
            'Home & Kitchen': {
                title: '🍳 Modern Home & Kitchen Essentials',
                subtitle: 'Triply non-stick cookware, storage sets & study lamps',
                ribbons: ['Up to 60% Off', 'Kitchen Special', 'Under ₹699', 'Min. 40% Off'],
                ribbonClass: 'ribbon-green'
            },
            'Snacks & Munchies': {
                title: '🍪 Daily Munchies & Pantry Savers',
                subtitle: 'Crispy snacks, noodles, biscuits & chocolates',
                ribbons: ['Special Price', 'Under ₹99', 'Mega Pack', 'Family Saver'],
                ribbonClass: 'ribbon-red'
            },
            'Cold Drinks & Beverages': {
                title: '🥤 Chilled Drinks, Juices & Cold Brews',
                subtitle: 'Red Bull, cold brews, Tropicana juices, green teas & soda mixers',
                ribbons: ['Chilled at 4°C', 'Min. 30% Off', 'Under ₹99', 'Buy 2 Get 1', 'Party Pack'],
                ribbonClass: 'ribbon-blue'
            },
            'Dairy, Bread & Eggs': {
                title: '🥛 Dairy, Bread & Morning Essentials',
                subtitle: 'Farm fresh milk, butter, paneer, brown bread & organic eggs',
                ribbons: ['Fresh at 6 AM', 'Cold Chain', 'Under ₹99', 'Breakfast Special', '100% Pure'],
                ribbonClass: 'ribbon-dairy'
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
                            <img src="${item.src}" alt="${displayTitle}" class="curated-card-img" loading="lazy" onerror="this.src=MEGAMART_PLACEHOLDER">
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
            'Dairy, Bread & Eggs': '<i data-lucide="egg"></i>',
            'Snacks & Munchies': '<i data-lucide="cookie"></i>',
            'Cold Drinks & Beverages': '<i data-lucide="cup-soda"></i>',
            'Staples, Atta & Oil': '<i data-lucide="wheat"></i>',
            'Personal Care & Cleaning': '<i data-lucide="sparkles"></i>',
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
        if (this.sortSelect && sortBy) this.sortSelect.value = sortBy;
        this.applyFiltersAndRender(searchQuery);
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
                <img class="itemImage" src="${element.src}" alt="${element.name}" loading="lazy" onerror="this.src=MEGAMART_PLACEHOLDER">
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

            // 3. Click on Any Product Card (Card, Media, Title, Price) -> Show Detail View
            const actionBtn = e.target.closest('.add-btn, .subtract-btn, .addandsub, .wishlist-card-btn, .pd-buy-now-btn, button');
            if (!actionBtn) {
                const card = e.target.closest('.itemName, .deal-mini-item, .curated-deal-card, .slide-item');
                if (card) {
                    const name = card.dataset.name;
                    const item = this.data.find(i => i.name === name);
                    if (item) {
                        e.preventDefault();
                        this.showProductDetailView(item);
                        return;
                    }
                }
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
        const input = this.globalSearchInput;
        const dropdown = this.searchSuggestionsDropdown;
        const clearBtn = this.searchClearBtn;
        let selectedIndex = -1;
        let activeMatches = [];

        const escapeHtml = (str) => {
            return String(str || '').replace(/[&<>"']/g, (m) => {
                return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
            });
        };

        const highlightMatch = (text, query) => {
            if (!query) return escapeHtml(text);
            const safeText = escapeHtml(text);
            const lowerText = text.toLowerCase();
            const lowerQuery = query.toLowerCase();
            const index = lowerText.indexOf(lowerQuery);
            if (index === -1) return safeText;
            const match = escapeHtml(text.slice(index, index + query.length));
            const before = escapeHtml(text.slice(0, index));
            const after = escapeHtml(text.slice(index + query.length));
            return `${before}<mark>${match}</mark>${after}`;
        };

        const closeDropdown = () => {
            if (dropdown) dropdown.style.display = 'none';
            selectedIndex = -1;
            activeMatches = [];
        };

        const updateSelectionHighlight = () => {
            if (!dropdown) return;
            const items = dropdown.querySelectorAll('.suggestion-item, .suggestion-view-all');
            items.forEach((item, idx) => {
                if (idx === selectedIndex) {
                    item.classList.add('selected');
                    item.scrollIntoView({ block: 'nearest' });
                } else {
                    item.classList.remove('selected');
                }
            });
        };

        const renderSuggestions = (query) => {
            if (!dropdown) return;
            const q = (query || '').trim();
            if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';

            if (q.length < 1) {
                closeDropdown();
                return;
            }

            const lowerQ = q.toLowerCase();
            const matches = this.data.filter(item => 
                item.name.toLowerCase().includes(lowerQ) ||
                (item.type && item.type.toLowerCase().includes(lowerQ))
            );

            activeMatches = matches.slice(0, 6);
            selectedIndex = -1;

            if (matches.length === 0) {
                dropdown.innerHTML = `
                    <div class="suggestion-empty-state">
                        <i data-lucide="search-x" style="width:24px;height:24px;margin-bottom:6px;opacity:0.6;"></i>
                        <div>No groceries found matching "<strong>${escapeHtml(q)}</strong>"</div>
                    </div>
                `;
            } else {
                const itemsHtml = activeMatches.map((item, index) => {
                    return `
                        <div class="suggestion-item" data-index="${index}" data-name="${escapeHtml(item.name)}" role="option">
                            <img class="suggestion-thumb" src="${item.src}" alt="${escapeHtml(item.name)}" onerror="this.src=MEGAMART_PLACEHOLDER">
                            <div class="suggestion-info">
                                <div class="suggestion-name-row">
                                    <span class="suggestion-name">${highlightMatch(item.name, q)}</span>
                                    <span class="suggestion-cat-badge">${item.type}</span>
                                </div>
                                <div class="suggestion-sub">${item.unit}</div>
                            </div>
                            <div class="suggestion-price-col">
                                <span class="suggestion-price">₹${item.discount_price}</span>
                                ${item.price > item.discount_price ? `<span class="suggestion-mrp">₹${item.price}</span>` : ''}
                            </div>
                        </div>
                    `;
                }).join('');

                const viewAllHtml = `
                    <div class="suggestion-view-all" id="suggestionViewAllBtn" data-index="${activeMatches.length}" role="option">
                        <span>View all <strong>${matches.length}</strong> results for "${escapeHtml(q)}"</span>
                        <i data-lucide="arrow-right"></i>
                    </div>
                `;

                dropdown.innerHTML = itemsHtml + viewAllHtml;
            }

            dropdown.style.display = 'block';
            if (window.lucide) lucide.createIcons();
        };

        if (input) {
            input.addEventListener('input', (e) => {
                renderSuggestions(e.target.value);
            });

            input.addEventListener('focus', () => {
                if (input.value.trim().length >= 1) {
                    renderSuggestions(input.value);
                }
            });

            input.addEventListener('keydown', (e) => {
                const totalOptions = activeMatches.length + (activeMatches.length > 0 ? 1 : 0);

                if (e.key === 'ArrowDown') {
                    if (dropdown.style.display === 'none' && input.value.trim().length >= 1) {
                        renderSuggestions(input.value);
                        return;
                    }
                    if (totalOptions > 0) {
                        e.preventDefault();
                        selectedIndex = (selectedIndex + 1) % totalOptions;
                        updateSelectionHighlight();
                    }
                } else if (e.key === 'ArrowUp') {
                    if (totalOptions > 0) {
                        e.preventDefault();
                        selectedIndex = (selectedIndex - 1 + totalOptions) % totalOptions;
                        updateSelectionHighlight();
                    }
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectedIndex >= 0 && selectedIndex < activeMatches.length) {
                        const chosen = activeMatches[selectedIndex];
                        closeDropdown();
                        this.showProductDetailView(chosen);
                    } else {
                        const q = input.value.trim();
                        closeDropdown();
                        if (q) {
                            this.showCategoryView('Search Results', q);
                        }
                    }
                } else if (e.key === 'Escape') {
                    closeDropdown();
                }
            });
        }

        if (dropdown) {
            dropdown.addEventListener('click', (e) => {
                const itemEl = e.target.closest('.suggestion-item');
                if (itemEl) {
                    const itemName = itemEl.dataset.name;
                    const item = this.data.find(d => d.name === itemName);
                    closeDropdown();
                    if (item) {
                        this.showProductDetailView(item);
                    }
                    return;
                }

                const viewAllEl = e.target.closest('.suggestion-view-all');
                if (viewAllEl) {
                    const q = input ? input.value.trim() : '';
                    closeDropdown();
                    if (q) {
                        this.showCategoryView('Search Results', q);
                    }
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (input) {
                    input.value = '';
                    input.focus();
                }
                closeDropdown();
                clearBtn.style.display = 'none';
                if (this.currentCategory === 'Search Results') {
                    this.showHomeView();
                }
            });
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#globalSearchContainer')) {
                closeDropdown();
            }
        });

        // Mobile search bar
        if (this.mobileSearchInput) {
            this.mobileSearchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const q = this.mobileSearchInput.value.trim();
                    if (q) this.showCategoryView('Search Results', q);
                }
            });
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
        if (this.wishlistPageView && this.wishlistPageView.classList.contains('active')) {
            this.renderWishlistPageView();
        }
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
        if (this.wishlistPageView && this.wishlistPageView.classList.contains('active')) {
            this.renderWishlistPageView();
        }
    }

    setupWishlistModal() {
        const wishlistBtn = document.getElementById('wishlistButton');
        const mobileWishlistBtn = document.getElementById('mobileWishlistBtn');
        const closeWishlist = document.getElementById('closeWishlist');
        const overlay = document.getElementById('wishlistOverlay');

        wishlistBtn?.addEventListener('click', () => this.showWishlistPageView());
        mobileWishlistBtn?.addEventListener('click', () => this.showWishlistPageView());
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
                        <img src="${item.src}" alt="${item.name}" class="wishlist-item-img" onerror="this.src=MEGAMART_PLACEHOLDER">
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
                    <img src="${item.src}" alt="${item.name}" class="cart-item-image" onerror="this.src=MEGAMART_PLACEHOLDER">
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
            items: cartItems.map(i => ({ name: i.name, qty: i.quantity, price: i.discount_price, unit: i.unit, src: i.src })),
            total: grandTotal,
            paymentMethod,
            coinsEarned: earnedCoins,
            coinsRedeemed: coinsDiscount
        };

        const existingOrders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
        existingOrders.unshift(orderRecord);
        localStorage.setItem('megamart_orders', JSON.stringify(existingOrders));

        // Persist Order into Supabase Cloud PostgreSQL DB
        try {
            createCloudOrder(this.currentUser?.id || '00000000-0000-0000-0000-000000000000', {
                orderNumber: orderId,
                totalAmount: grandTotal,
                paymentMethod,
                address: { name, phone, address, pin },
                items: orderRecord.items
            }).then(res => {
                if (res?.success) {
                    console.log('[Supabase Cloud] Order saved successfully:', res.order?.order_number);
                }
            }).catch(e => console.warn('[Supabase Cloud] Order sync warning:', e));
        } catch (e) {
            console.warn('[Supabase Cloud] Order sync notice:', e);
        }

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
            'Whitelower': ['Rose', 'Marigold'],
            'Watermelon': ['Pomegranate', 'Green Grapes'],
            'Pomegranate': ['Green Grapes', 'Apple'],
            'Green Grapes': ['Pomegranate', 'Banana'],
            'Carrot': ['Cucumber', 'Tomato'],
            'Cucumber': ['Carrot', 'Tomato'],
            'Lady Finger': ['Onion', 'Potato'],
            'Green Peas': ['Paneer', 'Potato'],
            'Amul Butter': ['Brown Bread', 'Farm Eggs'],
            'Farm Eggs': ['Brown Bread', 'Amul Butter'],
            'Paneer': ['Curd', 'Amul Butter'],
            'Curd': ['Paneer', 'Brown Bread'],
            'Brown Bread': ['Amul Butter', 'Farm Eggs'],
            'Lays Chips': ['Coca-Cola', 'Kurkure'],
            'Kurkure': ['Sprite', 'Lays Chips'],
            'Haldiram Bhujia': ['Parle-G', 'Tea'],
            'Parle-G': ['Tea', 'Milk'],
            'Maggi Noodles': ['Coca-Cola', 'Lays Chips'],
            'Cadbury Dairy Milk': ['Lays Chips', 'Coca-Cola'],
            'Coca-Cola': ['Lays Chips', 'Kurkure'],
            'Sprite': ['Kurkure', 'Lays Chips'],
            'Real Mango Juice': ['Parle-G', 'Cadbury Dairy Milk'],
            'Red Bull': ['Lays Chips', 'Cadbury Dairy Milk'],
            'Fortune Sunflower Oil': ['Aashirvaad Atta', 'Tata Toor Dal'],
            'Aashirvaad Atta': ['Fortune Sunflower Oil', 'Daawat Basmati Rice'],
            'Daawat Basmati Rice': ['Tata Toor Dal', 'Fortune Sunflower Oil'],
            'Tata Toor Dal': ['Daawat Basmati Rice', 'Fortune Sunflower Oil'],
            'Colgate Toothpaste': ['Dettol Handwash', 'Nivea Lotion'],
            'Dettol Handwash': ['Lizol Cleaner', 'Colgate Toothpaste'],
            'Nivea Lotion': ['Dettol Handwash', 'Colgate Toothpaste'],
            'Lizol Cleaner': ['Dettol Handwash', 'Colgate Toothpaste']
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

                // Geolocation / Current Location Detection
        const detectBtn = document.getElementById('detectLocationBtn');
        detectBtn?.addEventListener('click', () => {
            if (!navigator.geolocation) {
                this.showToast('Geolocation is not supported by your browser.');
                return;
            }
            detectBtn.disabled = true;
            detectBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Detecting your location...`;
            if (window.lucide) lucide.createIcons();

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    detectBtn.disabled = false;
                    detectBtn.innerHTML = `<i data-lucide="navigation"></i> Detect My Current Location`;
                    if (window.lucide) lucide.createIcons();
                    // Set default metro based on coordinates or primary hub
                    applyPincode('400001', 'Mumbai');
                    this.showToast('📍 Live GPS location detected: Mumbai (400001)');
                    setTimeout(closeModal, 600);
                },
                (err) => {
                    detectBtn.disabled = false;
                    detectBtn.innerHTML = `<i data-lucide="navigation"></i> Detect My Current Location`;
                    if (window.lucide) lucide.createIcons();
                    this.showToast('Location permission unavailable. Please select your city or enter Pincode.');
                },
                { timeout: 7000 }
            );
        });

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
        // Header MegaCoins button removed; loyalty balance kept in Profile & Checkout
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

    
    // ================= SHOPSY / FLIPKART SUB-CATEGORY MEGA MENU =================
    setupCategorySubMegaMenu() {
        if (!this.subMegaMenuDropdown) return;
        if (!this.categorySubFilterBar) this.categorySubFilterBar = document.getElementById('categorySubFilterBar');

        // Prevent premature closing while moving within the entire sub-filter bar
        if (this.categorySubFilterBar) {
            this.categorySubFilterBar.addEventListener('mouseenter', () => {
                clearTimeout(this.subMegaMenuTimer);
            });
            this.categorySubFilterBar.addEventListener('mouseleave', (e) => {
                if (e.relatedTarget && this.subMegaMenuDropdown?.contains(e.relatedTarget)) return;
                this.subMegaMenuTimer = setTimeout(() => {
                    this.closeSubMegaMenu();
                }, 280);
            });
        }

        // Dropdown hover persistence: NEVER close or reload while mouse is inside dropdown!
        this.subMegaMenuDropdown.addEventListener('mouseenter', () => {
            clearTimeout(this.subMegaMenuTimer);
            clearTimeout(this.subMegaMenuHoverTimer);
        });

        this.subMegaMenuDropdown.addEventListener('mouseleave', (e) => {
            if (e.relatedTarget && (
                this.categorySubFilterPills?.contains(e.relatedTarget) || 
                this.categorySubFilterBar?.contains(e.relatedTarget)
            )) {
                return;
            }
            this.subMegaMenuTimer = setTimeout(() => {
                this.closeSubMegaMenu();
            }, 280);
        });

        // Overlay: closes ONLY on click or touch (NEVER on mouseenter to avoid deadzone flicker!)
        if (this.subMegaMenuOverlay) {
            this.subMegaMenuOverlay.addEventListener('click', () => {
                this.closeSubMegaMenu();
            });
            this.subMegaMenuOverlay.addEventListener('touchstart', () => {
                this.closeSubMegaMenu();
            }, { passive: true });
        }

        // Close on Escape Key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.subMegaMenuDropdown?.classList.contains('show')) {
                this.closeSubMegaMenu();
            }
        });

        // Click on any link in mega menu
        if (this.subMegaMenuInner) {
            this.subMegaMenuInner.addEventListener('click', (e) => {
                const link = e.target.closest('.sub-mega-link') || e.target.closest('.sub-mega-promo-card');
                if (!link) return;
                e.preventDefault();
                const cat = link.dataset.category || this.currentOpenCategory || this.currentCategory;
                const subType = link.dataset.subtype || this.currentOpenSubType || '';
                const brand = link.dataset.brand || '';
                const query = link.dataset.query || '';

                this.closeSubMegaMenu();

                this.selectedFilters.subTypes.clear();
                this.selectedFilters.brands.clear();
                this.selectedFilters.searchQuery = '';

                if (subType) {
                    this.selectedFilters.subTypes.add(subType);
                    this.activeSubType = subType;
                }
                if (brand) this.selectedFilters.brands.add(brand);
                if (query) this.selectedFilters.searchQuery = query;

                this.syncSubFilterPillsWithSelection();
                this.applyFiltersAndRender();

                const grid = document.getElementById('categoryProductsGrid');
                if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    openSubMegaMenu(categoryName, subType, pillElement, isFastSwitch = false) {
        // Robust case-insensitive lookup
        const catKey = Object.keys(SUB_MEGA_MENU_DATA).find(k => k.toLowerCase() === (categoryName || '').toLowerCase()) || categoryName;
        const subMap = SUB_MEGA_MENU_DATA[catKey] || {};
        const subKey = Object.keys(subMap).find(s => s.toLowerCase() === (subType || '').toLowerCase()) || subType;
        const config = subMap[subKey];

        if (!config || !this.subMegaMenuInner || !this.subMegaMenuDropdown) return;

        // GUARD: If already open for this exact category & subType, DO NOT re-render / re-trigger animation!
        if (this.currentOpenCategory === catKey && this.currentOpenSubType === subKey && this.subMegaMenuDropdown.classList.contains('show')) {
            clearTimeout(this.subMegaMenuTimer);
            return;
        }

        const isAlreadyOpen = this.subMegaMenuDropdown.classList.contains('show');
        this.currentOpenCategory = catKey;
        this.currentOpenSubType = subKey;
        clearTimeout(this.subMegaMenuTimer);

        // Active pill styling
        if (this.categorySubFilterPills) {
            this.categorySubFilterPills.querySelectorAll('.category-sub-pill').forEach(p => p.classList.remove('megamenu-open'));
        }
        if (pillElement) pillElement.classList.add('megamenu-open');

        // Check in-memory template cache to eliminate image reloading and DOM thrashing
        const cacheKey = `${catKey}::${subKey}`;
        let html = this.subMegaMenuCache ? this.subMegaMenuCache.get(cacheKey) : null;

        if (!html) {
            const heroImage = SUB_TYPE_IMAGES[subType] || SUB_TYPE_IMAGES[subKey] || MEGAMART_PLACEHOLDER;

            // Render multi-column layout with right visual promo card
            html = `<div class="sub-mega-grid cols-${config.length + 1}">`;
            
            config.forEach(col => {
                html += `
                    <div class="sub-mega-col">
                        <h4 class="sub-col-title">
                            <span>${col.title}</span>
                        </h4>
                        <ul class="sub-col-list">
                `;
                col.items.forEach(item => {
                    html += `
                        <li>
                            <a href="#" class="sub-mega-link" 
                               data-category="${categoryName}" 
                               data-subtype="${subType}" 
                               data-brand="${item.brand || ''}" 
                               data-query="${item.query || ''}">
                                <span class="link-bullet"></span>
                                <span>${item.label}</span>
                            </a>
                        </li>
                    `;
                });
                html += `</ul></div>`;
            });

            // 5th Column: Shopsy-Style Rounded Visual Promo Card with Image
            html += `
                <div class="sub-mega-promo-col">
                    <div class="sub-mega-promo-card" data-category="${categoryName}" data-subtype="${subType}">
                        <div class="promo-img-wrap">
                            <img src="${heroImage}" alt="${subType}" class="promo-card-img" onerror="this.src='${MEGAMART_PLACEHOLDER}'">
                            <span class="promo-tag-badge">⚡ 10 MINS</span>
                        </div>
                        <div class="promo-content">
                            <h5>${subType} Deals</h5>
                            <p>100% Genuine • MegaAssured Quality</p>
                            <div class="promo-explore-pill">
                                <span>Explore Store</span>
                                <i data-lucide="arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            html += `</div>`;
            if (this.subMegaMenuCache) this.subMegaMenuCache.set(cacheKey, html);
        }

        // Seamless Cross-Fade if already open, or smooth open
        if (isAlreadyOpen) {
            // Dropdown is already open: cross-fade content with zero layout jump
            this.subMegaMenuInner.style.opacity = '0.35';
            requestAnimationFrame(() => {
                this.subMegaMenuInner.innerHTML = html;
                if (window.lucide) lucide.createIcons();
                this.subMegaMenuInner.style.opacity = '1';
            });
        } else {
            this.subMegaMenuInner.style.opacity = '1';
            this.subMegaMenuInner.innerHTML = html;
            if (window.lucide) lucide.createIcons();
            this.subMegaMenuDropdown.classList.add('show');
            if (this.subMegaMenuOverlay) this.subMegaMenuOverlay.classList.add('show');
        }
    }

    closeSubMegaMenu() {
        clearTimeout(this.subMegaMenuTimer);
        clearTimeout(this.subMegaMenuHoverTimer);
        this.currentOpenCategory = null;
        this.currentOpenSubType = null;
        if (this.subMegaMenuDropdown) this.subMegaMenuDropdown.classList.remove('show');
        if (this.subMegaMenuOverlay) this.subMegaMenuOverlay.classList.remove('show');
        if (this.categorySubFilterPills) {
            this.categorySubFilterPills.querySelectorAll('.category-sub-pill').forEach(p => p.classList.remove('megamenu-open'));
        }
    }

    // ================= FOOTER LINKS & NAVIGATION SYSTEM =================
    setupFooterLinks() {
        const footerLogoBtn = document.getElementById('footerLogoBtn');
        const footerHomeLink = document.getElementById('footerHomeLink');
        const footerAllProductsLink = document.getElementById('footerAllProductsLink');
        const footerOffersLink = document.getElementById('footerOffersLink');
        const contactUsFooterBtn = document.getElementById('contactUsFooterBtn');
        const returnPolicyFooterBtn = document.getElementById('returnPolicyFooterBtn');
        const appStoreBtn = document.getElementById('appStoreBtn');
        const googlePlayBtn = document.getElementById('googlePlayBtn');

        footerLogoBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showHomeView();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        footerHomeLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showHomeView();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        footerAllProductsLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCategoryView('All Products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        footerOffersLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCategoryView('All Products');
            setTimeout(() => {
                const flashSale = document.getElementById('flashSaleBanner');
                if (flashSale) flashSale.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });

        contactUsFooterBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.openMegaAiDrawer();
            const aiInput = document.getElementById('megaAiInput');
            if (aiInput) {
                aiInput.value = 'Mera order status check karo aur customer support se baat karvao';
                this.sendAiMessage();
            }
        });

        returnPolicyFooterBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showToast('🛡️ MegaMart 100% Genuine Return Policy: Instant refunds within 24 hours on all groceries & electronics!');
        });

        const showAppComingSoon = () => {
            this.showToast('📱 MegaMart Mobile App coming soon to App Store & Google Play with 10-Minute lightning delivery!');
        };
        appStoreBtn?.addEventListener('click', showAppComingSoon);
        googlePlayBtn?.addEventListener('click', showAppComingSoon);
    }

    // ================= DYNAMIC CATEGORY FILTERS & 2-COLUMN ECOM ENGINE =================
    setupDynamicCategoryFilters() {
        // Clear all buttons
        if (this.sidebarClearAllBtn) {
            this.sidebarClearAllBtn.addEventListener('click', () => this.clearAllCategoryFilters());
        }
        if (this.clearAllChipsBtn) {
            this.clearAllChipsBtn.addEventListener('click', () => this.clearAllCategoryFilters());
        }
        if (this.emptyResetFiltersBtn) {
            this.emptyResetFiltersBtn.addEventListener('click', () => this.clearAllCategoryFilters());
        }

        // Desktop & Mobile Filter Toggle Button
        const toggleSidebar = () => {
            if (!this.categoryEcomLayout) this.categoryEcomLayout = document.querySelector('.category-ecom-layout');
            this.isFilterSidebarOpen = !this.isFilterSidebarOpen;
            
            if (this.categoryEcomLayout) {
                this.categoryEcomLayout.classList.toggle('sidebar-open', this.isFilterSidebarOpen);
            }
            if (this.categoryFilterToggleBtn) {
                this.categoryFilterToggleBtn.classList.toggle('btn-active', this.isFilterSidebarOpen);
            }

            // On mobile / tablet, also handle off-canvas drawer
            if (window.innerWidth <= 900) {
                if (this.categoryFilterSidebar) this.categoryFilterSidebar.classList.toggle('mobile-open', this.isFilterSidebarOpen);
                if (this.sidebarMobileBackdrop) this.sidebarMobileBackdrop.classList.toggle('open', this.isFilterSidebarOpen);
                document.body.style.overflow = this.isFilterSidebarOpen ? 'hidden' : '';
            }
        };

        if (this.categoryFilterToggleBtn) {
            this.categoryFilterToggleBtn.addEventListener('click', toggleSidebar);
        }

        const closeSidebar = () => {
            this.isFilterSidebarOpen = false;
            if (!this.categoryEcomLayout) this.categoryEcomLayout = document.querySelector('.category-ecom-layout');
            if (this.categoryEcomLayout) this.categoryEcomLayout.classList.remove('sidebar-open');
            if (this.categoryFilterToggleBtn) this.categoryFilterToggleBtn.classList.remove('btn-active');
            if (this.categoryFilterSidebar) this.categoryFilterSidebar.classList.remove('mobile-open');
            if (this.sidebarMobileBackdrop) this.sidebarMobileBackdrop.classList.remove('open');
            document.body.style.overflow = '';
        };

        if (this.sidebarCloseBtn) {
            this.sidebarCloseBtn.addEventListener('click', closeSidebar);
        }
        if (this.sidebarMobileBackdrop) {
            this.sidebarMobileBackdrop.addEventListener('click', closeSidebar);
        }

        // Sort select listener
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => {
                this.applyFiltersAndRender();
            });
        }
    }

    buildDynamicSidebarFilters(categoryName) {
        if (!this.sidebarFilterSections) return;
        this.sidebarFilterSections.innerHTML = '';

        const allItems = this.getItemsForCategory(categoryName);
        if (!allItems.length) return;

        // 1. Gather SubTypes
        const subTypeCounts = {};
        allItems.forEach(it => {
            if (it.subType) {
                subTypeCounts[it.subType] = (subTypeCounts[it.subType] || 0) + 1;
            }
        });
        const subTypes = Object.entries(subTypeCounts);

        // 2. Gather Brands
        const brandCounts = {};
        allItems.forEach(it => {
            if (it.brand) {
                brandCounts[it.brand] = (brandCounts[it.brand] || 0) + 1;
            }
        });
        const brands = Object.entries(brandCounts).sort((a,b) => b[1] - a[1]);

        // 3. Price Brackets
        const priceRanges = [
            { id: 'under499', label: 'Under ₹499', min: 0, max: 499 },
            { id: '500-999', label: '₹500 - ₹999', min: 500, max: 999 },
            { id: '1000-2499', label: '₹1,000 - ₹2,499', min: 1000, max: 2499 },
            { id: '2500-9999', label: '₹2,500 - ₹9,999', min: 2500, max: 9999 },
            { id: 'above10000', label: '₹10,000 & Above', min: 10000, max: Infinity }
        ];
        const priceCounts = {};
        priceRanges.forEach(r => {
            priceCounts[r.id] = allItems.filter(it => it.discount_price >= r.min && it.discount_price <= r.max).length;
        });

        // 4. Customer Ratings
        const ratingOptions = [
            { id: '4.5', label: '4.5★ & Above', min: 4.5 },
            { id: '4.0', label: '4.0★ & Above', min: 4.0 },
            { id: '3.5', label: '3.5★ & Above', min: 3.5 }
        ];

        // 5. Discounts
        const discountOptions = [
            { id: '50', label: '50% or more', min: 0.50 },
            { id: '30', label: '30% or more', min: 0.30 },
            { id: '20', label: '20% or more', min: 0.20 },
            { id: '10', label: '10% or more', min: 0.10 }
        ];

        let html = '';

        // SubType Section (Categories)
        if (subTypes.length > 0) {
            html += `
                <div class="sidebar-filter-group expanded" data-group="subTypes">
                    <button type="button" class="filter-group-header">
                        <span class="group-title">Category / Sub-Type</span>
                        <i data-lucide="chevron-down" class="group-chevron"></i>
                    </button>
                    <div class="filter-group-content">
                        <div class="filter-options-list">
            `;
            subTypes.forEach(([st, cnt]) => {
                const checked = this.selectedFilters.subTypes.has(st) ? 'checked' : '';
                html += `
                    <label class="filter-option-item">
                        <input type="checkbox" data-group="subTypes" value="${st}" ${checked}>
                        <span class="custom-checkbox"></span>
                        <span class="option-label">${st}</span>
                        <span class="option-count">${cnt}</span>
                    </label>
                `;
            });
            html += `</div></div></div>`;
        }

        // Brand Section
        if (brands.length > 0) {
            html += `
                <div class="sidebar-filter-group expanded" data-group="brands">
                    <button type="button" class="filter-group-header">
                        <span class="group-title">Brand</span>
                        <i data-lucide="chevron-down" class="group-chevron"></i>
                    </button>
                    <div class="filter-group-content">
                        ${brands.length > 6 ? `
                        <div class="brand-search-box">
                            <i data-lucide="search"></i>
                            <input type="text" placeholder="Search brand..." class="brand-search-input">
                        </div>` : ''}
                        <div class="filter-options-list brand-options-list">
            `;
            brands.forEach(([br, cnt]) => {
                const checked = this.selectedFilters.brands.has(br) ? 'checked' : '';
                html += `
                    <label class="filter-option-item brand-option-item">
                        <input type="checkbox" data-group="brands" value="${br}" ${checked}>
                        <span class="custom-checkbox"></span>
                        <span class="option-label">${br}</span>
                        <span class="option-count">${cnt}</span>
                    </label>
                `;
            });
            html += `</div></div></div>`;
        }

        // Price Section
        html += `
            <div class="sidebar-filter-group expanded" data-group="priceRanges">
                <button type="button" class="filter-group-header">
                    <span class="group-title">Price</span>
                    <i data-lucide="chevron-down" class="group-chevron"></i>
                </button>
                <div class="filter-group-content">
                    <div class="filter-options-list">
        `;
        priceRanges.forEach(r => {
            const cnt = priceCounts[r.id] || 0;
            if (cnt > 0) {
                const checked = this.selectedFilters.priceRanges.has(r.id) ? 'checked' : '';
                html += `
                    <label class="filter-option-item">
                        <input type="checkbox" data-group="priceRanges" value="${r.id}" ${checked}>
                        <span class="custom-checkbox"></span>
                        <span class="option-label">${r.label}</span>
                        <span class="option-count">${cnt}</span>
                    </label>
                `;
            }
        });
        html += `</div></div></div>`;

        // Customer Rating Section
        html += `
            <div class="sidebar-filter-group expanded" data-group="ratings">
                <button type="button" class="filter-group-header">
                    <span class="group-title">Customer Ratings</span>
                    <i data-lucide="chevron-down" class="group-chevron"></i>
                </button>
                <div class="filter-group-content">
                    <div class="filter-options-list">
        `;
        ratingOptions.forEach(r => {
            const checked = this.selectedFilters.ratings.has(r.id) ? 'checked' : '';
            html += `
                <label class="filter-option-item">
                    <input type="checkbox" data-group="ratings" value="${r.id}" ${checked}>
                    <span class="custom-checkbox"></span>
                    <span class="option-label rating-label">
                        <span class="star-pill">${r.id}★</span>
                        <span>& Above</span>
                    </span>
                </label>
            `;
        });
        html += `</div></div></div>`;

        // Discount Section
        html += `
            <div class="sidebar-filter-group expanded" data-group="discounts">
                <button type="button" class="filter-group-header">
                    <span class="group-title">Discount</span>
                    <i data-lucide="chevron-down" class="group-chevron"></i>
                </button>
                <div class="filter-group-content">
                    <div class="filter-options-list">
        `;
        discountOptions.forEach(d => {
            const checked = this.selectedFilters.discounts.has(d.id) ? 'checked' : '';
            html += `
                <label class="filter-option-item">
                    <input type="checkbox" data-group="discounts" value="${d.id}" ${checked}>
                    <span class="custom-checkbox"></span>
                    <span class="option-label">${d.label}</span>
                </label>
            `;
        });
        html += `</div></div></div>`;

        this.sidebarFilterSections.innerHTML = html;
        if (window.lucide) lucide.createIcons();

        // Bind Accordion headers toggle
        this.sidebarFilterSections.querySelectorAll('.filter-group-header').forEach(hdr => {
            hdr.addEventListener('click', () => {
                const grp = hdr.closest('.sidebar-filter-group');
                if (grp) grp.classList.toggle('expanded');
            });
        });

        // Brand quick-search filter inside sidebar
        const brandSearchInput = this.sidebarFilterSections.querySelector('.brand-search-input');
        if (brandSearchInput) {
            brandSearchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                const items = this.sidebarFilterSections.querySelectorAll('.brand-option-item');
                items.forEach(it => {
                    const txt = it.querySelector('.option-label')?.textContent.toLowerCase() || '';
                    it.style.display = txt.includes(term) ? 'flex' : 'none';
                });
            });
        }

        // Bind Checkbox Changes
        this.sidebarFilterSections.querySelectorAll('input[type="checkbox"]').forEach(chk => {
            chk.addEventListener('change', () => {
                const group = chk.dataset.group;
                const val = chk.value;
                if (!this.selectedFilters[group]) this.selectedFilters[group] = new Set();
                
                if (chk.checked) {
                    this.selectedFilters[group].add(val);
                } else {
                    this.selectedFilters[group].delete(val);
                }

                // If subType changed, sync activeSubType and subFilterPills
                if (group === 'subTypes') {
                    if (this.selectedFilters.subTypes.size === 1) {
                        this.activeSubType = [...this.selectedFilters.subTypes][0];
                    } else if (this.selectedFilters.subTypes.size === 0) {
                        this.activeSubType = 'All';
                    } else {
                        this.activeSubType = 'Multiple';
                    }
                    this.syncSubFilterPillsWithSelection();
                }

                this.applyFiltersAndRender();
            });
        });
    }

    syncSubFilterPillsWithSelection() {
        if (!this.categorySubFilterPills) return;
        const pills = this.categorySubFilterPills.querySelectorAll('.category-sub-pill');
        pills.forEach(p => {
            const st = p.dataset.subtype;
            if (st === 'All') {
                if (this.selectedFilters.subTypes.size === 0) p.classList.add('active');
                else p.classList.remove('active');
            } else {
                if (this.selectedFilters.subTypes.has(st)) p.classList.add('active');
                else p.classList.remove('active');
            }
        });
    }

    applyFiltersAndRender(overrideQuery = null) {
        if (!this.categoryProductsGrid) return;
        this.categoryProductsGrid.innerHTML = '';

        if (overrideQuery !== null) {
            this.selectedFilters.searchQuery = overrideQuery;
        }

        let items = this.getItemsForCategory(this.currentCategory);
        const totalCategoryCount = items.length;

        // 1. SubType filter
        if (this.selectedFilters.subTypes.size > 0) {
            items = items.filter(it => this.selectedFilters.subTypes.has(it.subType));
        }

        // 2. Brand filter
        if (this.selectedFilters.brands.size > 0) {
            items = items.filter(it => this.selectedFilters.brands.has(it.brand));
        }

        // 3. Price Ranges filter
        if (this.selectedFilters.priceRanges.size > 0) {
            items = items.filter(it => {
                const p = it.discount_price;
                for (const range of this.selectedFilters.priceRanges) {
                    if (range === 'under499' && p < 500) return true;
                    if (range === '500-999' && p >= 500 && p <= 999) return true;
                    if (range === '1000-2499' && p >= 1000 && p <= 2499) return true;
                    if (range === '2500-9999' && p >= 2500 && p <= 9999) return true;
                    if (range === 'above10000' && p >= 10000) return true;
                }
                return false;
            });
        }

        // 4. Rating filter
        if (this.selectedFilters.ratings.size > 0) {
            const minRatingThreshold = Math.min(...[...this.selectedFilters.ratings].map(Number));
            items = items.filter(it => {
                const score = parseFloat(this.getProductRating(it).score);
                return score >= minRatingThreshold;
            });
        }

        // 5. Discount filter
        if (this.selectedFilters.discounts.size > 0) {
            const minDiscThreshold = Math.min(...[...this.selectedFilters.discounts].map(Number)) / 100;
            items = items.filter(it => {
                const disc = (it.price - it.discount_price) / it.price;
                return disc >= minDiscThreshold;
            });
        }

        // 6. Search Query
        if (this.selectedFilters.searchQuery && this.selectedFilters.searchQuery.trim() !== '') {
            const q = this.selectedFilters.searchQuery.toLowerCase().trim();
            items = items.filter(it => 
                it.name.toLowerCase().includes(q) ||
                (it.brand && it.brand.toLowerCase().includes(q)) ||
                (it.subType && it.subType.toLowerCase().includes(q)) ||
                (it.type && it.type.toLowerCase().includes(q))
            );
        }

        // 7. Apply Sorting
        const sortBy = this.sortSelect ? this.sortSelect.value : 'featured';
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
        } else if (sortBy === 'rating') {
            items.sort((a,b) => parseFloat(this.getProductRating(b).score) - parseFloat(this.getProductRating(a).score));
        } else {
            // Featured
            items.sort((a,b) => (b.price - b.discount_price) - (a.price - a.discount_price));
        }

        // 8. Update Counts
        const activeCount = 
            this.selectedFilters.subTypes.size + 
            this.selectedFilters.brands.size + 
            this.selectedFilters.priceRanges.size + 
            this.selectedFilters.ratings.size + 
            this.selectedFilters.discounts.size + 
            (this.selectedFilters.searchQuery ? 1 : 0);

        if (this.categoryItemCountPill) {
            this.categoryItemCountPill.textContent = `${items.length} of ${totalCategoryCount} items`;
        }
        if (this.categoryProductCount) {
            this.categoryProductCount.textContent = `${items.length} Product${items.length === 1 ? '' : 's'}`;
        }

        if (this.sidebarActiveCount) {
            this.sidebarActiveCount.textContent = activeCount;
            this.sidebarActiveCount.style.display = activeCount > 0 ? 'inline-flex' : 'none';
        }
        if (this.filterCountBadge) {
            this.filterCountBadge.textContent = activeCount;
            this.filterCountBadge.style.display = activeCount > 0 ? 'inline-flex' : 'none';
        }

        // 9. Render Active Filter Chips
        this.renderActiveFilterChips();

        // 10. Render Product Grid / Empty State
        if (items.length === 0) {
            this.categoryProductsGrid.style.display = 'none';
            if (this.filterEmptyState) this.filterEmptyState.style.display = 'block';
        } else {
            this.categoryProductsGrid.style.display = 'grid';
            if (this.filterEmptyState) this.filterEmptyState.style.display = 'none';
            
            items.forEach(item => {
                this.categoryProductsGrid.appendChild(this.createProductCard(item));
            });

            if (window.lucide) lucide.createIcons();
            if (window.gsap) {
                gsap.from("#categoryProductsGrid .itemName", { y: 20, opacity: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" });
            }
        }
    }

    renderActiveFilterChips() {
        if (!this.activeFilterChipsRow || !this.activeChipsList) return;

        const chips = [];
        this.selectedFilters.subTypes.forEach(v => chips.push({ group: 'subTypes', value: v, label: v }));
        this.selectedFilters.brands.forEach(v => chips.push({ group: 'brands', value: v, label: `Brand: ${v}` }));
        this.selectedFilters.priceRanges.forEach(v => {
            const labelMap = {
                'under499': 'Under ₹499',
                '500-999': '₹500 - ₹999',
                '1000-2499': '₹1,000 - ₹2,499',
                '2500-9999': '₹2,500 - ₹9,999',
                'above10000': '₹10,000+'
            };
            chips.push({ group: 'priceRanges', value: v, label: labelMap[v] || v });
        });
        this.selectedFilters.ratings.forEach(v => chips.push({ group: 'ratings', value: v, label: `${v}★ & above` }));
        this.selectedFilters.discounts.forEach(v => chips.push({ group: 'discounts', value: v, label: `${v}%+ Off` }));
        if (this.selectedFilters.searchQuery) {
            chips.push({ group: 'searchQuery', value: this.selectedFilters.searchQuery, label: `"${this.selectedFilters.searchQuery}"` });
        }

        if (chips.length === 0) {
            this.activeFilterChipsRow.style.display = 'none';
            this.activeChipsList.innerHTML = '';
            return;
        }

        this.activeFilterChipsRow.style.display = 'flex';
        this.activeChipsList.innerHTML = chips.map(c => `
            <div class="active-filter-chip">
                <span>${c.label}</span>
                <button type="button" class="chip-remove-btn" data-group="${c.group}" data-value="${c.value}">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `).join('');

        if (window.lucide) lucide.createIcons();

        // Delegate chip removal
        this.activeChipsList.querySelectorAll('.chip-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const group = btn.dataset.group;
                const value = btn.dataset.value;
                if (group === 'searchQuery') {
                    this.selectedFilters.searchQuery = '';
                } else if (this.selectedFilters[group]) {
                    this.selectedFilters[group].delete(value);
                    const chk = this.sidebarFilterSections?.querySelector(`input[data-group="${group}"][value="${value}"]`);
                    if (chk) chk.checked = false;
                }

                if (group === 'subTypes') {
                    if (this.selectedFilters.subTypes.size === 1) {
                        this.activeSubType = [...this.selectedFilters.subTypes][0];
                    } else if (this.selectedFilters.subTypes.size === 0) {
                        this.activeSubType = 'All';
                    }
                    this.syncSubFilterPillsWithSelection();
                }

                this.applyFiltersAndRender();
            });
        });
    }

    clearAllCategoryFilters() {
        this.selectedFilters.subTypes.clear();
        this.selectedFilters.brands.clear();
        this.selectedFilters.priceRanges.clear();
        this.selectedFilters.ratings.clear();
        this.selectedFilters.discounts.clear();
        this.selectedFilters.searchQuery = '';
        this.activeSubType = 'All';

        if (this.sidebarFilterSections) {
            this.sidebarFilterSections.querySelectorAll('input[type="checkbox"]').forEach(chk => chk.checked = false);
            const brandSearch = this.sidebarFilterSections.querySelector('.brand-search-input');
            if (brandSearch) brandSearch.value = '';
            this.sidebarFilterSections.querySelectorAll('.brand-option-item').forEach(it => it.style.display = 'flex');
        }

        this.syncSubFilterPillsWithSelection();
        this.applyFiltersAndRender();
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
                                <img src="${item.src}" alt="${item.name}" loading="lazy" onerror="this.src=MEGAMART_PLACEHOLDER">
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
                        <img src="${item.src}" alt="${item.name}" loading="lazy" onerror="this.src=MEGAMART_PLACEHOLDER">
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
                } else if (target === 'Top Offers') {
                    this.showCategoryView('All Products');
                    const flashSale = document.getElementById('flashSaleBanner');
                    if (flashSale) flashSale.scrollIntoView({ behavior: 'smooth' });
                } else {
                    this.showCategoryView(target);
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

        const electronics = this.controller.filterItems('Electronics & Gadgets').slice(0, 4);
        const fashion = this.controller.filterItems('Fashion & Apparel').slice(0, 4);
        const budget = this.data.filter(i => i.discount_price <= 199).slice(0, 4);
        const allItems = this.data.slice(0, 16);
        const topSaver = fashion.length ? fashion : allItems.slice(0, 4);

        const renderMiniGrid = (container, items, labelPrefix = '') => {
            if (!container) return;
            container.innerHTML = items.map(item => `
                <div class="deal-mini-item" data-name="${item.name}">
                    <div class="deal-mini-img-wrap">
                        <img src="${item.src}" alt="${item.name}" loading="lazy" onerror="this.src=MEGAMART_PLACEHOLDER">
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

        renderMiniGrid(col1, electronics.length ? electronics : allItems.slice(0, 4), 'From ');
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
                            <img src="${item.src}" alt="${safeName}" loading="lazy" class="curated-card-img" onerror="this.src=MEGAMART_PLACEHOLDER">
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
            this.showOrdersPageView();
        });

        dropdownWishlistBtn?.addEventListener('click', () => {
            headerUserDropdown?.classList.remove('active');
            headerUserBtn?.setAttribute('aria-expanded', 'false');
            this.showWishlistPageView();
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

        const openOrdersPage = (e) => {
            if (e && e.preventDefault) e.preventDefault();
            this.showOrdersPageView();
        };
        const closeDrawer = () => this.closeOrderHistoryDrawer();

        headerOrdersBtn?.addEventListener('click', openOrdersPage);
        mobileOrdersBtn?.addEventListener('click', openOrdersPage);
        profileOrdersBtn?.addEventListener('click', openOrdersPage);
        footerOrdersBtn?.addEventListener('click', openOrdersPage);

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

    // ================= FULL-PAGE DEDICATED WISHLIST VIEW =================
    showWishlistPageView() {
        this.currentCategory = 'Wishlist';
        this.setActiveView(this.wishlistPageView);
        this.renderWishlistPageView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderWishlistPageView() {
        const grid = document.getElementById('wishlistPageGrid');
        const empty = document.getElementById('wishlistPageEmpty');
        const countPill = document.getElementById('wishlistPageItemCount');
        const moveAllBtn = document.getElementById('wishlistPageMoveAllBtn');

        const wishlistedItems = this.data.filter(item => this.wishlist.has(item.name));
        const count = wishlistedItems.length;

        if (countPill) countPill.textContent = `${count} Item${count === 1 ? '' : 's'}`;

        if (count === 0) {
            if (grid) grid.style.display = 'none';
            if (empty) empty.style.display = 'block';
            if (moveAllBtn) moveAllBtn.style.display = 'none';
        } else {
            if (empty) empty.style.display = 'none';
            if (moveAllBtn) moveAllBtn.style.display = 'inline-flex';
            if (grid) {
                grid.style.display = 'grid';
                grid.innerHTML = wishlistedItems.map(item => {
                    const discountPercent = item.price > item.discount_price 
                        ? Math.round(((item.price - item.discount_price) / item.price) * 100) 
                        : 0;
                    return `
                        <div class="wishlist-card" data-name="${item.name}">
                            <div class="wc-image-wrap" data-name="${item.name}">
                                <img src="${item.src}" alt="${item.name}" onerror="this.src=MEGAMART_PLACEHOLDER">
                                ${discountPercent > 0 ? `<span class="wc-discount-tag">${discountPercent}% OFF</span>` : ''}
                                <button class="wc-remove-btn" data-name="${item.name}" title="Remove from wishlist">
                                    <i data-lucide="trash-2"></i>
                                </button>
                            </div>
                            <div class="wc-content">
                                <span class="wc-category-pill">${item.type}</span>
                                <h4 class="wc-title" data-name="${item.name}">${item.name}</h4>
                                <div class="wc-unit">${item.unit}</div>
                                <div class="wc-price-row">
                                    <div class="wc-prices">
                                        <span class="wc-current-price">₹${item.discount_price}</span>
                                        ${item.price > item.discount_price ? `<span class="wc-mrp">₹${item.price}</span>` : ''}
                                    </div>
                                    <div class="wc-rating">
                                        <i data-lucide="star"></i>
                                        <span>4.8</span>
                                    </div>
                                </div>
                                <button class="wc-move-to-cart-btn" data-name="${item.name}">
                                    <i data-lucide="shopping-cart"></i>
                                    <span>Move to Cart</span>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        if (window.lucide) lucide.createIcons();
    }

    setupWishlistPageView() {
        document.getElementById('wishlistPageBackBtn')?.addEventListener('click', () => {
            this.showHomeView();
        });

        document.getElementById('wishlistEmptyShopBtn')?.addEventListener('click', () => {
            this.showCategoryView('All Products');
        });

        document.getElementById('wishlistPageMoveAllBtn')?.addEventListener('click', () => {
            const wishlistedItems = this.data.filter(item => this.wishlist.has(item.name));
            if (wishlistedItems.length === 0) return;

            wishlistedItems.forEach(item => {
                item.quantity = (item.quantity || 0) + 1;
            });

            this.saveCartToStorage();
            this.data.forEach(item => this.updateAllCardDOMs(item));
            this.updateCartUI();
            this.showToast(`Moved all ${wishlistedItems.length} items to cart! 🛒`);
        });

        const grid = document.getElementById('wishlistPageGrid');
        if (grid) {
            grid.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('.wc-remove-btn');
                if (removeBtn) {
                    const name = removeBtn.dataset.name;
                    this.wishlist.delete(name);
                    this.saveWishlistToStorage();
                    this.updateWishlistUI();
                    this.updateWishlistButtonStates();
                    this.renderWishlistPageView();
                    this.showToast(`Removed ${name} from wishlist`);
                    return;
                }

                const moveBtn = e.target.closest('.wc-move-to-cart-btn');
                if (moveBtn) {
                    const name = moveBtn.dataset.name;
                    const item = this.data.find(d => d.name === name);
                    if (item) {
                        item.quantity = (item.quantity || 0) + 1;
                        this.saveCartToStorage();
                        this.updateAllCardDOMs(item);
                        this.updateCartUI();
                        this.showToast(`Added ${item.name} to cart 🛒`);
                    }
                    return;
                }

                const titleOrImg = e.target.closest('.wc-title, .wc-image-wrap');
                if (titleOrImg) {
                    const name = titleOrImg.dataset.name;
                    const item = this.data.find(d => d.name === name);
                    if (item) {
                        this.showProductDetailView(item);
                    }
                }
            });
        }
    }

    // ================= FULL-PAGE DEDICATED ORDERS VIEW =================
    showOrdersPageView() {
        this.currentCategory = 'Orders';
        this.setActiveView(this.ordersPageView);
        this.renderOrdersPageView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderOrdersPageView() {
        const list = document.getElementById('ordersPageList');
        const empty = document.getElementById('ordersPageEmpty');
        const countPill = document.getElementById('ordersPageCountPill');

        const orders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
        const count = orders.length;

        if (countPill) countPill.textContent = `${count} Order${count === 1 ? '' : 's'} Placed`;

        if (count === 0) {
            if (list) list.style.display = 'none';
            if (empty) empty.style.display = 'block';
        } else {
            if (empty) empty.style.display = 'none';
            if (list) {
                list.style.display = 'flex';
                list.innerHTML = orders.map((order, idx) => {
                    const dateStr = order.date ? new Date(order.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'Recently';

                    const isLatestLive = idx === 0;
                    const statusBadgeHtml = isLatestLive 
                        ? `<span class="order-status-badge status-out-for-delivery"><i data-lucide="truck"></i> Out for Delivery (10 min)</span>`
                        : `<span class="order-status-badge status-delivered"><i data-lucide="check-circle-2"></i> Delivered</span>`;

                    const itemsHtml = (order.items || []).map(item => {
                        const catalogItem = this.data.find(d => d.name === item.name);
                        const img = item.src || catalogItem?.src || MEGAMART_PLACEHOLDER;
                        const unit = item.unit || catalogItem?.unit || '1 unit';
                        const unitPrice = item.price || catalogItem?.discount_price || 0;
                        const qty = item.qty || 1;
                        const totalItemPrice = unitPrice * qty;

                        return `
                            <div class="order-item-row">
                                <img src="${img}" alt="${item.name}" class="order-item-img" onerror="this.src=MEGAMART_PLACEHOLDER">
                                <div class="order-item-info">
                                    <span class="order-item-name">${item.name}</span>
                                    <span class="order-item-unit">${unit}</span>
                                </div>
                                <div class="order-item-qty">Qty: ${qty}</div>
                                <div class="order-item-price">
                                    ₹${totalItemPrice.toFixed(2)}
                                    <span class="order-item-unit-calc">(₹${unitPrice} ea)</span>
                                </div>
                            </div>
                        `;
                    }).join('');

                    return `
                        <div class="order-full-card" data-order-id="${order.orderId}">
                            <div class="order-card-header">
                                <div class="och-left">
                                    <span class="och-order-id">${order.orderId}</span>
                                    <span class="och-date">${dateStr}</span>
                                </div>
                                ${statusBadgeHtml}
                            </div>
                            <div class="order-card-items">
                                ${itemsHtml}
                            </div>
                            <div class="order-card-footer">
                                <div class="ocf-bill">
                                    <span class="ocf-total">Total: ₹${Number(order.total || 0).toFixed(2)}</span>
                                    <span class="ocf-method">${order.paymentMethod || 'UPI'}</span>
                                    ${order.coinsEarned ? `<span class="ocf-coins">🪙 +${order.coinsEarned} Coins Earned</span>` : ''}
                                </div>
                                <div class="ocf-actions">
                                    <button class="order-track-btn" data-order-id="${order.orderId}">
                                        <i data-lucide="navigation"></i>
                                        <span>Track Live Order</span>
                                    </button>
                                    <button class="order-reorder-btn" data-order-id="${order.orderId}">
                                        <i data-lucide="rotate-ccw"></i>
                                        <span>Reorder All</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        if (window.lucide) lucide.createIcons();
    }

    setupOrdersPageView() {
        document.getElementById('ordersPageBackBtn')?.addEventListener('click', () => {
            this.showHomeView();
        });

        document.getElementById('ordersEmptyShopBtn')?.addEventListener('click', () => {
            this.showCategoryView('All Products');
        });

        document.getElementById('profileOrdersCount')?.parentElement?.addEventListener('click', () => {
            this.showOrdersPageView();
        });

        const list = document.getElementById('ordersPageList');
        if (list) {
            list.addEventListener('click', (e) => {
                const trackBtn = e.target.closest('.order-track-btn');
                if (trackBtn) {
                    const orderId = trackBtn.dataset.orderId;
                    this.openLiveTracker(orderId);
                    return;
                }

                const reorderBtn = e.target.closest('.order-reorder-btn');
                if (reorderBtn) {
                    const orderId = reorderBtn.dataset.orderId;
                    const orders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
                    const order = orders.find(o => o.orderId === orderId);
                    if (order && order.items) {
                        let reorderedCount = 0;
                        order.items.forEach(orderItem => {
                            const catalogItem = this.data.find(d => d.name === orderItem.name);
                            if (catalogItem) {
                                catalogItem.quantity = (catalogItem.quantity || 0) + (orderItem.qty || 1);
                                reorderedCount += (orderItem.qty || 1);
                            }
                        });
                        this.saveCartToStorage();
                        this.data.forEach(item => this.updateAllCardDOMs(item));
                        this.updateCartUI();
                        this.showToast(`Reordered ${reorderedCount} items from ${orderId}! 🛒`);
                        this.showCartPageView();
                    }
                }
            });
        }
    }


    setupMegaAiCopilot() {
        const triggerBtn = document.getElementById('megaAiTriggerBtn');
        const drawer = document.getElementById('megaAiDrawer');
        const overlay = document.getElementById('megaAiOverlay');
        const closeBtn = document.getElementById('closeMegaAiBtn');
        const form = document.getElementById('megaAiInputForm');
        const textInput = document.getElementById('megaAiTextInput');
        const chips = document.querySelectorAll('.ai-prompt-chip');

        if (!triggerBtn || !drawer) return;

        const openDrawer = () => {
            drawer.classList.add('active');
            overlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => textInput?.focus(), 300);
            if (window.lucide) lucide.createIcons();
        };

        const closeDrawer = () => {
            drawer.classList.remove('active');
            overlay?.classList.remove('active');
            document.body.style.overflow = '';
        };

        triggerBtn.addEventListener('click', openDrawer);
        closeBtn?.addEventListener('click', closeDrawer);
        overlay?.addEventListener('click', closeDrawer);

        // Quick prompt chips
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const prompt = chip.dataset.prompt;
                if (prompt) {
                    this.executeAiQuery(prompt);
                }
            });
        });

        // Form submit
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = (textInput?.value || '').trim();
            if (!query) return;
            textInput.value = '';
            this.executeAiQuery(query);
        });
    }

    async executeAiQuery(query) {
        const chatBody = document.getElementById('megaAiChatBody');
        if (!chatBody) return;

        // 1. Render User Outgoing Bubble
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message-row ai-outgoing';
        userMsg.innerHTML = `
            <div class="ai-msg-bubble"><p>${query}</p></div>
            <div class="ai-msg-avatar">👤</div>
        `;
        chatBody.appendChild(userMsg);

        // 2. Render Thinking Indicator
        const thinkingRow = document.createElement('div');
        thinkingRow.className = 'ai-message-row ai-incoming';
        thinkingRow.id = 'aiThinkingRow';
        thinkingRow.innerHTML = `
            <div class="ai-msg-avatar">✨</div>
            <div class="ai-thinking-row">
                <span>MegaAI is thinking...</span>
                <div class="ai-thinking-dots">
                    <div class="ai-thinking-dot"></div>
                    <div class="ai-thinking-dot"></div>
                    <div class="ai-thinking-dot"></div>
                </div>
            </div>
        `;
        chatBody.appendChild(thinkingRow);
        chatBody.scrollTop = chatBody.scrollHeight;

        // User Context for History & Support
        const userOrders = JSON.parse(localStorage.getItem('megamart_orders') || '[]');
        const activeCart = this.data.filter(i => i.quantity > 0);
        const context = {
            orders: userOrders,
            cart: activeCart,
            user: this.currentUser
        };

        // 3. Process with Autonomous AI Agent
        const response = await this.aiCopilot.processQuery(query, context);

        // Remove thinking placeholder
        document.getElementById('aiThinkingRow')?.remove();

        // 4. Render Specialized Response Card
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message-row ai-incoming';

        let cardHtml = '';

        // --- A. Interactive Shopping Checklist ---
        if (response.type === 'interactive_checklist' && response.checklist) {
            let checklistState = response.checklist.map((item, idx) => ({
                id: item.product.id,
                name: item.product.name || item.product.title,
                unit: item.product.unit || '1 unit',
                price: Number(item.product.discount_price || item.product.price || 0),
                img: item.product.src || item.product.image_url,
                qty: 1,
                selected: true
            }));

            const computeTotal = () => {
                return checklistState
                    .filter(i => i.selected)
                    .reduce((sum, i) => sum + (i.price * i.qty), 0);
            };

            const renderChecklistRows = () => {
                return checklistState.map((item, idx) => `
                    <div class="ai-check-item-row ${item.selected ? '' : 'unselected'}" data-index="${idx}">
                        <input type="checkbox" class="ai-check-box" data-index="${idx}" ${item.selected ? 'checked' : ''}>
                        <img src="${item.img}" alt="${item.name}" class="ai-check-thumb">
                        <div class="ai-check-details">
                            <div class="ai-check-name">${item.name}</div>
                            <div class="ai-check-meta">
                                <span class="ai-check-price">₹${item.price}</span>
                                <span>• ${item.unit}</span>
                            </div>
                        </div>
                        <div class="ai-micro-stepper">
                            <button type="button" class="ai-step-btn ai-minus-btn" data-index="${idx}">-</button>
                            <span class="ai-step-val">${item.qty}</span>
                            <button type="button" class="ai-step-btn ai-plus-btn" data-index="${idx}">+</button>
                        </div>
                        <button type="button" class="ai-remove-item-btn" data-index="${idx}" title="Remove item">✕</button>
                    </div>
                `).join('');
            };

            cardHtml = `
                <div class="ai-checklist-card" id="aiChecklistCard">
                    <div class="ai-checklist-header">
                        <span class="ai-checklist-title">📋 Editable Shopping List</span>
                        <span class="ai-checklist-live-total" id="aiLiveTotal">Total: ₹${computeTotal()}</span>
                    </div>
                    <div class="ai-checklist-items-container" id="aiChecklistRows">
                        ${renderChecklistRows()}
                    </div>
                    <button class="ai-transfer-cart-btn" id="aiTransferBtn" type="button">
                        <i data-lucide="shopping-bag"></i>
                        <span id="aiTransferBtnText">Transfer ${checklistState.filter(i => i.selected).length} Items to Cart (₹${computeTotal()})</span>
                    </button>
                </div>
            `;

            aiMsg.innerHTML = `
                <div class="ai-msg-avatar">✨</div>
                <div class="ai-msg-bubble">
                    <p>${response.reply}</p>
                    ${cardHtml}
                </div>
            `;
            chatBody.appendChild(aiMsg);

            // Wire up interactive checklist events
            const cardEl = aiMsg.querySelector('#aiChecklistCard');
            const updateTotalUI = () => {
                const totalEl = cardEl.querySelector('#aiLiveTotal');
                const btnText = cardEl.querySelector('#aiTransferBtnText');
                const selectedCount = checklistState.filter(i => i.selected).length;
                const grand = computeTotal();
                if (totalEl) totalEl.textContent = `Total: ₹${grand}`;
                if (btnText) btnText.textContent = `Transfer ${selectedCount} Items to Cart (₹${grand})`;
            };

            cardEl.addEventListener('click', (e) => {
                // Checkbox toggle
                if (e.target.classList.contains('ai-check-box')) {
                    const idx = Number(e.target.dataset.index);
                    checklistState[idx].selected = e.target.checked;
                    const row = cardEl.querySelector(`.ai-check-item-row[data-index="${idx}"]`);
                    row?.classList.toggle('unselected', !e.target.checked);
                    updateTotalUI();
                }
                // Plus qty
                if (e.target.classList.contains('ai-plus-btn')) {
                    const idx = Number(e.target.dataset.index);
                    checklistState[idx].qty += 1;
                    const valEl = e.target.parentElement.querySelector('.ai-step-val');
                    if (valEl) valEl.textContent = checklistState[idx].qty;
                    updateTotalUI();
                }
                // Minus qty
                if (e.target.classList.contains('ai-minus-btn')) {
                    const idx = Number(e.target.dataset.index);
                    if (checklistState[idx].qty > 1) {
                        checklistState[idx].qty -= 1;
                        const valEl = e.target.parentElement.querySelector('.ai-step-val');
                        if (valEl) valEl.textContent = checklistState[idx].qty;
                        updateTotalUI();
                    }
                }
                // Remove item
                if (e.target.classList.contains('ai-remove-item-btn')) {
                    const idx = Number(e.target.dataset.index);
                    checklistState.splice(idx, 1);
                    const container = cardEl.querySelector('#aiChecklistRows');
                    if (container) container.innerHTML = renderChecklistRows();
                    updateTotalUI();
                }
                // Transfer to cart
                if (e.target.closest('#aiTransferBtn')) {
                    const selected = checklistState.filter(i => i.selected && i.qty > 0);
                    if (selected.length === 0) {
                        this.showToast('Please select at least 1 item to add!');
                        return;
                    }
                    selected.forEach(item => {
                        const target = this.data.find(d => d.id === item.id);
                        if (target) {
                            target.quantity = (target.quantity || 0) + item.qty;
                        }
                    });
                    this.updateCartUI();
                    this.saveCartToStorage();
                    const btn = cardEl.querySelector('#aiTransferBtn');
                    if (btn) {
                        btn.innerHTML = `<i data-lucide="check"></i> <span>✓ Transferred ${selected.length} Items to Cart!</span>`;
                        btn.style.background = '#059669';
                    }
                    this.showToast(`🎉 Added ${selected.length} items to your cart!`);
                    if (window.lucide) lucide.createIcons();
                }
            });
        }
        // --- B. Live Order Tracking Card ---
        else if (response.type === 'order_tracking_card') {
            cardHtml = `
                <div class="ai-tracking-card">
                    <span class="ai-tracking-badge">⚡ 10-MIN EXPRESS DISPATCH</span>
                    <div class="ai-tracking-stepper">
                        <div class="ai-track-line"></div>
                        <div class="ai-track-step">
                            <div class="ai-track-dot">✓</div>
                            <span>Placed</span>
                        </div>
                        <div class="ai-track-step">
                            <div class="ai-track-dot">✓</div>
                            <span>Packed</span>
                        </div>
                        <div class="ai-track-step">
                            <div class="ai-track-dot">🚴</div>
                            <span>On the way</span>
                        </div>
                        <div class="ai-track-step">
                            <div class="ai-track-dot pending">📍</div>
                            <span>Delivered</span>
                        </div>
                    </div>
                    <button class="ai-add-all-btn" id="aiViewLiveOrderBtn" style="margin-top:8px;background:#16a34a;" type="button">
                        <i data-lucide="package"></i>
                        <span>Open Live Orders Page</span>
                    </button>
                </div>
            `;
            aiMsg.innerHTML = `
                <div class="ai-msg-avatar">✨</div>
                <div class="ai-msg-bubble">
                    <p style="white-space:pre-line;">${response.reply}</p>
                    ${cardHtml}
                </div>
            `;
            chatBody.appendChild(aiMsg);
            aiMsg.querySelector('#aiViewLiveOrderBtn')?.addEventListener('click', () => {
                document.getElementById('megaAiDrawer')?.classList.remove('active');
                document.getElementById('megaAiOverlay')?.classList.remove('active');
                document.body.style.overflow = '';
                this.showOrdersPageView();
            });
        }
        // --- C. Feedback Card with Interactive Stars ---
        else if (response.type === 'feedback_acknowledged') {
            cardHtml = `
                <div class="ai-feedback-stars-row" id="aiStarsRow">
                    <button class="ai-star-btn" data-val="1">⭐</button>
                    <button class="ai-star-btn" data-val="2">⭐</button>
                    <button class="ai-star-btn" data-val="3">⭐</button>
                    <button class="ai-star-btn" data-val="4">⭐</button>
                    <button class="ai-star-btn" data-val="5">⭐</button>
                </div>
            `;
            aiMsg.innerHTML = `
                <div class="ai-msg-avatar">✨</div>
                <div class="ai-msg-bubble">
                    <p style="white-space:pre-line;">${response.reply}</p>
                    ${cardHtml}
                </div>
            `;
            chatBody.appendChild(aiMsg);
            aiMsg.querySelectorAll('.ai-star-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const val = e.target.dataset.val;
                    this.showToast(`⭐ Thank you for rating us ${val}/5 Stars!`);
                    aiMsg.querySelector('#aiStarsRow').innerHTML = `<span style="font-weight:700;color:#16a34a;font-size:0.75rem;">✓ Recorded: ${val} Star Rating. Thank you!</span>`;
                });
            });
        }
        // --- D. Guardrail Rejection with Actionable Chips ---
        else if (response.type === 'guardrail_reject' && response.suggestions) {
            const chipsHtml = response.suggestions.map(s => `
                <button class="ai-prompt-chip" data-prompt="${s}" style="margin:3px 2px;" type="button">${s}</button>
            `).join('');

            aiMsg.innerHTML = `
                <div class="ai-msg-avatar">✨</div>
                <div class="ai-msg-bubble">
                    <p style="white-space:pre-line;">${response.reply}</p>
                    <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;">${chipsHtml}</div>
                </div>
            `;
            chatBody.appendChild(aiMsg);
            aiMsg.querySelectorAll('.ai-prompt-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    this.executeAiQuery(chip.dataset.prompt);
                });
            });
        }
        // --- E. Standard Product Bundles & Recommendations ---
        else {
            if (response.items && response.items.length > 0) {
                cardHtml = `
                    <div class="ai-product-bundle-card">
                        <div class="ai-bundle-header">
                            <span>${response.title}</span>
                            <span>₹${response.totalPrice}</span>
                        </div>
                        <div class="ai-bundle-items-list">
                            ${response.items.map(item => `
                                <div class="ai-bundle-item-row">
                                    <img src="${item.src || item.image_url}" alt="${item.name || item.title}" class="ai-bundle-item-img">
                                    <div class="ai-bundle-item-info">
                                        <div class="ai-bundle-item-name">${item.name || item.title}</div>
                                        <div class="ai-bundle-item-price">₹${item.discount_price || item.price} <span style="font-weight:400;color:#64748b;font-size:0.65rem;">(${item.unit || '1 unit'})</span></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="ai-add-all-btn" type="button">
                            <i data-lucide="shopping-bag"></i>
                            <span>${response.actionLabel || 'Add All to Cart'} (₹${response.totalPrice})</span>
                        </button>
                    </div>
                `;
            }

            aiMsg.innerHTML = `
                <div class="ai-msg-avatar">✨</div>
                <div class="ai-msg-bubble">
                    <p style="white-space:pre-line;">${response.reply}</p>
                    ${cardHtml}
                </div>
            `;
            chatBody.appendChild(aiMsg);

            aiMsg.querySelector('.ai-add-all-btn')?.addEventListener('click', (e) => {
                const btn = e.currentTarget;
                response.items.forEach(item => {
                    const target = this.data.find(d => d.id === item.id);
                    if (target) {
                        target.quantity = (target.quantity || 0) + 1;
                    }
                });
                this.updateCartUI();
                this.saveCartToStorage();
                btn.innerHTML = `<i data-lucide="check"></i> <span>✓ Added ${response.items.length} Items to Cart!</span>`;
                btn.style.background = '#059669';
                this.showToast(`🎉 Added ${response.items.length} items to your cart!`);
                if (window.lucide) lucide.createIcons();
            });
        }

        chatBody.scrollTop = chatBody.scrollHeight;
        if (window.lucide) lucide.createIcons();
    }
}
