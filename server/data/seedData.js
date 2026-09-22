export const initialStoreSettings = {
  storeName: "BACHAT BAZAR",
  tagline: "Har Din Ki Bachat",
  address: "ARAVALI VIHAR, CB-03, NEAR MANSA CHOWK, RTO OFFICE ROAD, BHIWADI, Alwar, Rajasthan, 301019",
  phone: "7073222340",
  whatsappNumber: "917073222340",
  email: "bachatbazar.rajeshdevi@gmail.com",
  openingHours: "07:30 AM - 10:00 PM (Mon - Sun)",
  freeDeliveryThreshold: 499,
  deliveryCharge: 30,
  membershipAnnualFee: 199,
  membershipPerks: [
    "Exclusive Member Pricing on 500+ daily items",
    "Extra ₹10 to ₹100 direct savings per product",
    "Priority home delivery in Bhiwadi within 2 hours",
    "Special festive & weekly grocery bundle discounts"
  ],
  announcement: "📢 Free Home Delivery in Bhiwadi on all orders above ₹499! Members save up to 30% extra.",
  grievanceOfficer: {
    name: "Rajesh Devi / Grievance Redressal Officer",
    designation: "Customer Support & Grievance Manager",
    phone: "7073222340",
    email: "bachatbazar.rajeshdevi@gmail.com",
    address: "ARAVALI VIHAR, CB-03, NEAR MANSA CHOWK, RTO OFFICE ROAD, BHIWADI, Alwar, Rajasthan, 301019",
    responseTime: "Within 24 to 48 business hours"
  },
  metaComplianceDisclaimer: "WhatsApp Business Platform access and approval are subject to Meta/WhatsApp eligibility requirements, review and applicable policies. WhatsApp policies and requirements may change from time to time."
};

export const initialCategories = [
  { id: "grocery", name: "Grocery & Staples", icon: "🌾", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80", count: "12+ items" },
  { id: "dairy-bakery", name: "Dairy & Bakery", icon: "🥛", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80", count: "6+ items" },
  { id: "fruits-vegetables", name: "Fruits & Vegetables", icon: "🥦", image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=80", count: "6+ items" },
  { id: "snacks-beverages", name: "Snacks & Namkeen", icon: "🍪", image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&auto=format&fit=crop&q=80", count: "8+ items" },
  { id: "beverages", name: "Tea, Coffee & Drinks", icon: "☕", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80", count: "6+ items" },
  { id: "cleaning", name: "Cleaning & Detergents", icon: "🧼", image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80", count: "6+ items" },
  { id: "personal-care", name: "Personal Care", icon: "🧴", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80", count: "6+ items" },
  { id: "household", name: "Household Needs", icon: "🏠", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80", count: "5+ items" }
];

export const initialProducts = [
  // Grocery & Staples
  {
    id: "prod-1",
    name: "Aashirvaad Shudh Chakki Atta 5kg",
    brand: "Aashirvaad",
    category: "grocery",
    unit: "5 kg",
    mrp: 280,
    normalPrice: 249,
    memberPrice: 229,
    stock: 85,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    description: "100% pure whole wheat flour processed with 4-step advantage for soft and fluffy rotis with natural dietary fiber."
  },
  {
    id: "prod-2",
    name: "Fortune Sunlite Refined Sunflower Oil 1L",
    brand: "Fortune",
    category: "grocery",
    unit: "1 Litre Pouch",
    mrp: 175,
    normalPrice: 145,
    memberPrice: 132,
    stock: 120,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
    description: "Light and healthy refined sunflower oil enriched with Vitamin A & D for every day guilt-free cooking."
  },
  {
    id: "prod-3",
    name: "India Gate Basmati Rice Feast Rozzana 5kg",
    brand: "India Gate",
    category: "grocery",
    unit: "5 kg",
    mrp: 450,
    normalPrice: 389,
    memberPrice: 349,
    stock: 60,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    description: "Premium aged long grain Basmati rice suitable for daily pulao, biryani, and steam rice."
  },
  {
    id: "prod-4",
    name: "Tata Sampann Unpolished Toor Dal 1kg",
    brand: "Tata Sampann",
    category: "grocery",
    unit: "1 kg",
    mrp: 210,
    normalPrice: 179,
    memberPrice: 165,
    stock: 95,
    isFeatured: true,
    isDealOfDay: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1585994192700-4e782977d405?w=600&auto=format&fit=crop&q=80",
    description: "Rich in natural protein, unpolished arhar / toor dal without artificial water, oil or stone polish."
  },
  {
    id: "prod-5",
    name: "Dhara Kachi Ghani Mustard Oil 1L",
    brand: "Dhara",
    category: "grocery",
    unit: "1 Litre Bottle",
    mrp: 185,
    normalPrice: 155,
    memberPrice: 139,
    stock: 110,
    isFeatured: true,
    isDealOfDay: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
    description: "Authentic strong aroma cold pressed mustard oil for rich taste and authentic North Indian dishes."
  },
  {
    id: "prod-6",
    name: "Tata Salt Vacuum Evaporated Iodized 1kg",
    brand: "Tata",
    category: "grocery",
    unit: "1 kg",
    mrp: 30,
    normalPrice: 28,
    memberPrice: 24,
    stock: 250,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
    description: "Desh Ka Namak - vacuum evaporated iodized salt essential for mental development and purity."
  },
  {
    id: "prod-7",
    name: "Madhur Pure & Hygienic Sugar 5kg",
    brand: "Madhur",
    category: "grocery",
    unit: "5 kg",
    mrp: 260,
    normalPrice: 235,
    memberPrice: 215,
    stock: 75,
    isFeatured: true,
    isDealOfDay: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=600&auto=format&fit=crop&q=80",
    description: "Sulphur-free refined crystalline sugar prepared under strict untouched hygienic process."
  },
  {
    id: "prod-8",
    name: "Catch Super Garam Masala Powder 100g",
    brand: "Catch",
    category: "grocery",
    unit: "100 g",
    mrp: 98,
    normalPrice: 85,
    memberPrice: 74,
    stock: 140,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80",
    description: "Blend of rich aromatic whole spices ground using Low Temperature Grinding technology."
  },

  // Dairy & Bakery
  {
    id: "prod-9",
    name: "Amul Butter Pasteurized 500g",
    brand: "Amul",
    category: "dairy-bakery",
    unit: "500 g",
    mrp: 285,
    normalPrice: 275,
    memberPrice: 255,
    stock: 80,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80",
    description: "Utterly Butterly Delicious fresh cream butter made from pure cow and buffalo milk."
  },
  {
    id: "prod-10",
    name: "Amul Taaza Homogenised Toned Milk 1L",
    brand: "Amul",
    category: "dairy-bakery",
    unit: "1 Litre Tetra",
    mrp: 74,
    normalPrice: 72,
    memberPrice: 65,
    stock: 90,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    description: "Long shelf life UHT treated toned milk with zero preservatives, rich in calcium and protein."
  },
  {
    id: "prod-11",
    name: "Mother Dairy Fresh Paneer 200g",
    brand: "Mother Dairy",
    category: "dairy-bakery",
    unit: "200 g",
    mrp: 95,
    normalPrice: 89,
    memberPrice: 79,
    stock: 50,
    isFeatured: true,
    isDealOfDay: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
    description: "Soft, smooth, and high-protein fresh cottage cheese for delicious curries, pakoras, and parathas."
  },
  {
    id: "prod-12",
    name: "Harvest Gold 100% Atta Whole Wheat Bread 400g",
    brand: "Harvest Gold",
    category: "dairy-bakery",
    unit: "400 g",
    mrp: 55,
    normalPrice: 50,
    memberPrice: 44,
    stock: 65,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    description: "Baked with 100% whole wheat grain without maida. Healthy breakfast choice with wholesome fiber."
  },

  // Snacks & Namkeen
  {
    id: "prod-13",
    name: "Haldiram's Nagpur Bhujia Sev 1kg",
    brand: "Haldiram's",
    category: "snacks-beverages",
    unit: "1 kg Mega Pack",
    mrp: 320,
    normalPrice: 285,
    memberPrice: 255,
    stock: 70,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80",
    description: "Crispy and spicy classic moth dal flour bhujia with traditional Rajasthani spices."
  },
  {
    id: "prod-14",
    name: "Parle-G Gold Biscuits 1kg Value Pack",
    brand: "Parle",
    category: "snacks-beverages",
    unit: "1 kg Pack",
    mrp: 140,
    normalPrice: 125,
    memberPrice: 110,
    stock: 150,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
    description: "Bigger, richer, crispier golden glucose biscuits loaded with milk and wheat goodness."
  },
  {
    id: "prod-15",
    name: "Britannia Good Day Butter Cookies 600g",
    brand: "Britannia",
    category: "snacks-beverages",
    unit: "600 g (Buy 1 Get 1 Free Promo)",
    mrp: 170,
    normalPrice: 145,
    memberPrice: 128,
    stock: 90,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
    description: "Delicious butter cookies with smile design, filled with rich buttery aroma and crunchy texture."
  },
  {
    id: "prod-16",
    name: "Maggi 2-Minute Masala Noodles 12-Pack (840g)",
    brand: "Nestle Maggi",
    category: "snacks-beverages",
    unit: "840 g (Pack of 12)",
    mrp: 192,
    normalPrice: 175,
    memberPrice: 158,
    stock: 130,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
    description: "India's favorite instant noodles with authentic roasted spices and herbs tastemaker."
  },

  // Tea, Coffee & Beverages
  {
    id: "prod-17",
    name: "Tata Tea Premium Desh Ki Chai 1kg",
    brand: "Tata Tea",
    category: "beverages",
    unit: "1 kg",
    mrp: 520,
    normalPrice: 440,
    memberPrice: 395,
    stock: 85,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    description: "Unique blend of big tea leaves for aroma and small tea leaves for strong kadak taste."
  },
  {
    id: "prod-18",
    name: "Nescafe Classic Instant Coffee 200g Glass Jar",
    brand: "Nescafe",
    category: "beverages",
    unit: "200 g Jar",
    mrp: 680,
    normalPrice: 590,
    memberPrice: 525,
    stock: 45,
    isFeatured: true,
    isDealOfDay: false,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    description: "100% pure roasted robusta coffee granules for signature aromatic morning boost."
  },
  {
    id: "prod-19",
    name: "Real Fruit Power Mixed Fruit Juice 1L",
    brand: "Real",
    category: "beverages",
    unit: "1 Litre Tetra",
    mrp: 140,
    normalPrice: 120,
    memberPrice: 105,
    stock: 95,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
    description: "Made from 9 delicious fruits packed with Vitamin C and natural fruit nutrition."
  },

  // Cleaning & Detergents
  {
    id: "prod-20",
    name: "Surf Excel Easy Wash Detergent Powder 5kg",
    brand: "Surf Excel",
    category: "cleaning",
    unit: "5 kg Mega Saver",
    mrp: 750,
    normalPrice: 625,
    memberPrice: 560,
    stock: 55,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80",
    description: "Removes tough stains easily like oil, curry, mud and grass while keeping fabric bright."
  },
  {
    id: "prod-21",
    name: "Vim Dishwash Gel Lemon 2 Litre Refill",
    brand: "Vim",
    category: "cleaning",
    unit: "2 Litres",
    mrp: 410,
    normalPrice: 345,
    memberPrice: 305,
    stock: 65,
    isFeatured: true,
    isDealOfDay: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80",
    description: "Power of 100 lemons dissolves tough grease on utensils without leaving white residue."
  },
  {
    id: "prod-22",
    name: "Lizol Disinfectant Floor Cleaner Citrus 2L",
    brand: "Lizol",
    category: "cleaning",
    unit: "2 Litres",
    mrp: 399,
    normalPrice: 340,
    memberPrice: 299,
    stock: 70,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80",
    description: "Kills 99.9% germs, leaves long-lasting refreshing citrus fragrance and sparkling shine."
  },
  {
    id: "prod-23",
    name: "Harpic Power Plus Toilet Cleaner 1L (Pack of 2)",
    brand: "Harpic",
    category: "cleaning",
    unit: "1L x 2 Saver Pack",
    mrp: 420,
    normalPrice: 360,
    memberPrice: 319,
    stock: 80,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80",
    description: "10x better stain removal than bleach with thick formula that clings to bowl surface."
  },

  // Personal Care
  {
    id: "prod-24",
    name: "Dettol Original Bathing Soap (125g x 5)",
    brand: "Dettol",
    category: "personal-care",
    unit: "Pack of 5 x 125g",
    mrp: 295,
    normalPrice: 250,
    memberPrice: 219,
    stock: 90,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1607006314358-9703de800ec2?w=600&auto=format&fit=crop&q=80",
    description: "Trusted 99.9% germ protection soap enriched with moisturizing glycerin for healthy skin."
  },
  {
    id: "prod-25",
    name: "Colgate Strong Teeth Dental Cream 500g Value Pack",
    brand: "Colgate",
    category: "personal-care",
    unit: "500 g Combo",
    mrp: 270,
    normalPrice: 235,
    memberPrice: 205,
    stock: 110,
    isFeatured: true,
    isDealOfDay: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    description: "With Amino Shakti calcium boosting formula to make teeth 2x stronger against cavities."
  },
  {
    id: "prod-26",
    name: "Head & Shoulders Anti-Dandruff Smooth & Silky 650ml",
    brand: "Head & Shoulders",
    category: "personal-care",
    unit: "650 ml Pump Bottle",
    mrp: 650,
    normalPrice: 535,
    memberPrice: 475,
    stock: 40,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
    description: "Clinically proven formula fights dandruff flakes and dryness while leaving hair silky smooth."
  },

  // Fruits & Vegetables
  {
    id: "prod-27",
    name: "Fresh Hybrid Tomato 1kg",
    brand: "Farm Fresh",
    category: "fruits-vegetables",
    unit: "1 kg",
    mrp: 40,
    normalPrice: 32,
    memberPrice: 26,
    stock: 100,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    description: "Locally sourced farm fresh ripe red tomatoes, firm and juicy for salads and gravies."
  },
  {
    id: "prod-28",
    name: "Fresh Red Onion / Pyaz 5kg Bag",
    brand: "Farm Fresh",
    category: "fruits-vegetables",
    unit: "5 kg Mesh Bag",
    mrp: 200,
    normalPrice: 165,
    memberPrice: 145,
    stock: 80,
    isFeatured: true,
    isDealOfDay: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    description: "High quality medium-large sized Nashik red onions with crispy layers and rich pungent flavor."
  },
  {
    id: "prod-29",
    name: "Fresh Golden Potato / Aloo 5kg",
    brand: "Farm Fresh",
    category: "fruits-vegetables",
    unit: "5 kg",
    mrp: 160,
    normalPrice: 130,
    memberPrice: 115,
    stock: 120,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    description: "Clean, mud-free firm potatoes suitable for fries, curries, boiling and roasting."
  },
  {
    id: "prod-30",
    name: "Fresh Shimla Apple 1kg (4-5 pcs)",
    brand: "Farm Fresh",
    category: "fruits-vegetables",
    unit: "1 kg (approx. 4-5 pcs)",
    mrp: 180,
    normalPrice: 149,
    memberPrice: 129,
    stock: 45,
    isFeatured: true,
    isDealOfDay: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
    description: "Sweet, crunchy and juicy Shimla apples rich in antioxidants and dietary fibers."
  },

  // Household Needs
  {
    id: "prod-31",
    name: "Origami Kitchen Paper Towel Roll (2 Ply x 4 Rolls)",
    brand: "Origami",
    category: "household",
    unit: "Pack of 4 Rolls",
    mrp: 280,
    normalPrice: 235,
    memberPrice: 199,
    stock: 60,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80",
    description: "Super absorbent 2-ply kitchen towels to soak excess oil from fried foods and clean counters."
  },
  {
    id: "prod-32",
    name: "Mangaldeep Sandalwood Agarbatti 120 Sticks",
    brand: "Mangaldeep",
    category: "household",
    unit: "120 Incense Sticks",
    mrp: 110,
    normalPrice: 95,
    memberPrice: 82,
    stock: 140,
    isFeatured: false,
    isDealOfDay: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    description: "Pure natural chandan sandalwood fragrance sticks for divine morning & evening pooja rituals."
  }
];

export const initialUsers = [
  {
    id: "user-admin",
    name: "Bachat Bazar Admin",
    phone: "7073222340",
    email: "bachatbazar.rajeshdevi@gmail.com",
    role: "admin",
    isMember: true,
    memberId: "BB-ADMIN-001",
    memberSince: "2024-01-01",
    addresses: [
      {
        id: "addr-admin",
        name: "Bachat Bazar Bhiwadi Store",
        phone: "7073222340",
        house: "CB-03, Aravali Vihar",
        area: "Near Mansa Chowk, RTO Office Road",
        landmark: "Near Mansa Chowk",
        city: "Bhiwadi",
        district: "Alwar",
        state: "Rajasthan",
        pincode: "301019",
        isDefault: true
      }
    ]
  },
  {
    id: "user-member",
    name: "Rajesh Kumar (Member Demo)",
    phone: "9876543210",
    email: "rajesh.member@example.com",
    role: "customer",
    isMember: true,
    memberId: "BB-MEM-8821",
    memberSince: "2024-06-15",
    addresses: [
      {
        id: "addr-1",
        name: "Rajesh Kumar",
        phone: "9876543210",
        house: "Flat 402, Tower B, Ashiana Town",
        area: "Thada Road",
        landmark: "Opposite Community Park",
        city: "Bhiwadi",
        district: "Alwar",
        state: "Rajasthan",
        pincode: "301019",
        isDefault: true
      }
    ]
  },
  {
    id: "user-regular",
    name: "Suresh Sharma (Normal Demo)",
    phone: "9123456780",
    email: "suresh.normal@example.com",
    role: "customer",
    isMember: false,
    memberId: null,
    memberSince: null,
    addresses: [
      {
        id: "addr-2",
        name: "Suresh Sharma",
        phone: "9123456780",
        house: "House No. 128, Phase 1",
        area: "UIT Sector 3",
        landmark: "Near Hanuman Mandir",
        city: "Bhiwadi",
        district: "Alwar",
        state: "Rajasthan",
        pincode: "301019",
        isDefault: true
      }
    ]
  }
];

export const initialOrders = [
  {
    id: "BB-ORD-9021",
    date: "2026-09-18T10:30:00.000Z",
    customer: {
      id: "user-member",
      name: "Rajesh Kumar",
      phone: "9876543210",
      email: "rajesh.member@example.com",
      isMember: true,
      memberId: "BB-MEM-8821"
    },
    shippingAddress: {
      name: "Rajesh Kumar",
      phone: "9876543210",
      house: "Flat 402, Tower B, Ashiana Town",
      area: "Thada Road",
      city: "Bhiwadi",
      state: "Rajasthan",
      pincode: "301019"
    },
    items: [
      {
        id: "prod-1",
        name: "Aashirvaad Shudh Chakki Atta 5kg",
        unit: "5 kg",
        quantity: 1,
        mrp: 280,
        normalPrice: 249,
        appliedPrice: 229,
        isMemberPrice: true,
        itemSavings: 20
      },
      {
        id: "prod-2",
        name: "Fortune Sunlite Refined Sunflower Oil 1L",
        unit: "1 Litre Pouch",
        quantity: 2,
        mrp: 175,
        normalPrice: 145,
        appliedPrice: 132,
        isMemberPrice: true,
        itemSavings: 26
      }
    ],
    mrpTotal: 630,
    normalTotal: 539,
    subtotal: 493,
    deliveryCharge: 30,
    total: 523,
    memberSavings: 46,
    totalSavingsFromMRP: 137,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Delivered",
    statusHistory: [
      { status: "Pending", time: "2026-09-18T10:30:00.000Z" },
      { status: "Confirmed", time: "2026-09-18T10:45:00.000Z" },
      { status: "Processing", time: "2026-09-18T11:15:00.000Z" },
      { status: "Out for Delivery", time: "2026-09-18T12:00:00.000Z" },
      { status: "Delivered", time: "2026-09-18T12:45:00.000Z" }
    ]
  }
];

export const initialWhatsAppConsents = [
  {
    id: "wac-001",
    userId: "user-member",
    customerName: "Rajesh Kumar",
    phone: "9876543210",
    transactionalConsent: true,
    marketingConsent: true,
    consentSource: "Registration & Checkout",
    timestamp: "2026-09-15T11:20:00.000Z",
    ipAddress: "192.168.1.10",
    status: "ACTIVE", // ACTIVE | OPTED_OUT | TRANSACTIONAL_ONLY | REVOKED
    history: [
      { action: "OPT_IN_TRANSACTIONAL", date: "2026-09-15T11:20:00.000Z", source: "Registration" },
      { action: "OPT_IN_MARKETING", date: "2026-09-15T11:20:00.000Z", source: "Registration" }
    ]
  },
  {
    id: "wac-002",
    userId: "user-regular",
    customerName: "Suresh Sharma",
    phone: "9123456780",
    transactionalConsent: true,
    marketingConsent: false,
    consentSource: "Checkout Form",
    timestamp: "2026-09-17T14:40:00.000Z",
    ipAddress: "192.168.1.15",
    status: "TRANSACTIONAL_ONLY",
    history: [
      { action: "OPT_IN_TRANSACTIONAL", date: "2026-09-17T14:40:00.000Z", source: "Checkout" }
    ]
  },
  {
    id: "wac-003",
    userId: null,
    customerName: "Amit Verma",
    phone: "9812345678",
    transactionalConsent: false,
    marketingConsent: false,
    consentSource: "Stop WhatsApp Form",
    timestamp: "2026-09-18T09:10:00.000Z",
    ipAddress: "192.168.1.20",
    status: "OPTED_OUT",
    history: [
      { action: "OPT_IN_MARKETING", date: "2026-09-01T10:00:00.000Z", source: "Old Campaign" },
      { action: "OPT_OUT_ALL", date: "2026-09-18T09:10:00.000Z", source: "Stop WhatsApp Page" }
    ]
  }
];

export const initialWhatsAppTemplates = [
  {
    id: "tpl-1",
    name: "order_confirmation_v1",
    category: "UTILITY",
    language: "en",
    message: "Namaste {{1}}, your Bachat Bazar order #{{2}} for amount {{3}} has been confirmed! We will deliver it to {{4}} shortly.",
    variables: ["Customer Name", "Order ID", "Amount", "Address"],
    status: "Approved",
    approvalStatus: "Meta Approved",
    createdDate: "2026-09-01T10:00:00.000Z"
  },
  {
    id: "tpl-2",
    name: "order_out_for_delivery_v1",
    category: "UTILITY",
    language: "en",
    message: "Namaste {{1}}, your grocery order #{{2}} is OUT FOR DELIVERY in Bhiwadi. Our delivery executive will arrive in approx 30 minutes.",
    variables: ["Customer Name", "Order ID"],
    status: "Approved",
    approvalStatus: "Meta Approved",
    createdDate: "2026-09-01T10:30:00.000Z"
  },
  {
    id: "tpl-3",
    name: "delivery_feedback_v1",
    category: "UTILITY",
    language: "en",
    message: "Namaste {{1}}, your order #{{2}} was delivered. Thank you for shopping with Bachat Bazar (Har Din Ki Bachat)! Rate your experience: {{3}}",
    variables: ["Customer Name", "Order ID", "Feedback Link"],
    status: "Approved",
    approvalStatus: "Meta Approved",
    createdDate: "2026-09-02T11:00:00.000Z"
  },
  {
    id: "tpl-4",
    name: "member_welcome_club_v1",
    category: "MARKETING",
    language: "en",
    message: "🎉 Welcome to Bachat Bazar VIP Member Club, {{1}}! Your Member ID is {{2}}. Enjoy lowest Member Prices on 500+ daily items on every purchase.",
    variables: ["Customer Name", "Member ID"],
    status: "Approved",
    approvalStatus: "Meta Approved",
    createdDate: "2026-09-03T14:00:00.000Z"
  },
  {
    id: "tpl-5",
    name: "weekly_bachat_special_offers_v1",
    category: "MARKETING",
    language: "en",
    message: "🛒 Har Din Ki Bachat! Special Member Offers this week on Atta, Mustard Oil, and Dairy. Save up to {{1}} extra. Browse deals: {{2}}",
    variables: ["Discount %", "Store Link"],
    status: "Approved",
    approvalStatus: "Meta Approved",
    createdDate: "2026-09-05T09:00:00.000Z"
  },
  {
    id: "tpl-6",
    name: "festive_grocery_mega_sale_v1",
    category: "MARKETING",
    language: "en",
    message: "✨ Festive Mega Savings at Bachat Bazar Bhiwadi! Get extra {{1}}% discount on ghee, dry fruits and sweets. Tap to order: {{2}}",
    variables: ["Discount %", "Store Link"],
    status: "Draft",
    approvalStatus: "Pending Meta Review",
    createdDate: "2026-09-18T16:00:00.000Z"
  }
];

export const initialDataDeletionRequests = [
  {
    id: "ddr-101",
    name: "Karan Singh",
    phone: "9876500001",
    email: "karan.singh@example.com",
    requestType: "WhatsApp Communication Data Deletion",
    reason: "No longer residing in Bhiwadi area",
    status: "COMPLETED", // PENDING | IN_REVIEW | COMPLETED | REJECTED
    dateRequested: "2026-09-16T12:30:00.000Z",
    resolutionNotes: "WhatsApp marketing and transactional data purged from active campaign lists."
  }
];

export const initialHeroSlides = [
  {
    id: "hero-1",
    title: "Fresh Vegetables & Daily Staples",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
    badgeText: "Zyada Kharido, Zyada Bachao",
    productName: "Aashirvaad Shudh Atta 5kg",
    mrp: 280,
    normalPrice: 249,
    memberPrice: 229,
    order: 1,
    isActive: true,
    createdAt: "2026-09-20T10:00:00.000Z"
  },
  {
    id: "hero-2",
    title: "Supermarket Fresh Produce & Greens",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80",
    badgeText: "Daily Fresh Harvest",
    productName: "Fortune Sunlite Refined Oil 1L",
    mrp: 175,
    normalPrice: 145,
    memberPrice: 132,
    order: 2,
    isActive: true,
    createdAt: "2026-09-20T10:05:00.000Z"
  },
  {
    id: "hero-3",
    title: "Dairy, Ghee & Morning Essentials",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
    badgeText: "VIP Member Deals",
    productName: "Amul Pure Ghee 1L Tin",
    mrp: 650,
    normalPrice: 599,
    memberPrice: 565,
    order: 3,
    isActive: true,
    createdAt: "2026-09-20T10:10:00.000Z"
  },
  {
    id: "hero-4",
    title: "Spices, Pulses & Wholesale Savings",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80",
    badgeText: "Wholesale Rates in Bhiwadi",
    productName: "Tata Sampann Toor Dal 1kg",
    mrp: 195,
    normalPrice: 175,
    memberPrice: 158,
    order: 4,
    isActive: true,
    createdAt: "2026-09-20T10:15:00.000Z"
  }
];

export const initialMembershipPlans = [
  {
    id: "plan-1yr",
    name: "1 Year VIP Plan",
    duration: "1 Year",
    durationMonths: 12,
    price: 999,
    mrp: 1499,
    badge: "Basic Savings",
    description: "1 Saal tak 500+ grocery items par direct Member rate & VIP priority delivery.",
    features: [
      "1 Year Unlimited Member Price Access",
      "Free Home Delivery on orders above ₹499",
      "Save ₹3,000–₹5,000 annually on groceries",
      "Dedicated Customer Support in Bhiwadi"
    ],
    isPopular: false,
    isActive: true
  },
  {
    id: "plan-2yr",
    name: "2 Years VIP Plan",
    duration: "2 Years",
    durationMonths: 24,
    price: 1799,
    mrp: 2999,
    badge: "Most Popular",
    description: "2 Saal ki continuous bachat aur exclusive seasonal festive discounts.",
    features: [
      "2 Years Unlimited Member Price Access",
      "Guaranteed Annual Savings of ₹8,000+",
      "Priority 2-Hour Express Delivery",
      "Special Festival Extra Discount Offers"
    ],
    isPopular: true,
    isActive: true
  },
  {
    id: "plan-3yr",
    name: "3 Years VIP Plan",
    duration: "3 Years",
    durationMonths: 36,
    price: 2499,
    mrp: 4499,
    badge: "Family Saver",
    description: "Large families ke liye 3 saal tak maximum wholesale savings guaranteed.",
    features: [
      "3 Years Unlimited VIP Member Pricing",
      "Maximum Savings for Joint Families",
      "Zero Delivery Fee Above ₹499",
      "Early Access to Flash Mega Sales"
    ],
    isPopular: false,
    isActive: true
  },
  {
    id: "plan-lifetime",
    name: "Lifetime VIP Club (Maha Bachat)",
    duration: "Lifetime",
    durationMonths: null,
    price: 5999,
    mrp: 9999,
    badge: "Best Value • Lifetime",
    description: "Zindagi bhar ki bachat — One-time payment, unlimited lifetime VIP wholesale prices.",
    features: [
      "Lifetime VIP Access — Never Expires",
      "500+ Daily Groceries at Lowest Wholesale Prices",
      "Free Priority Home Delivery Forever (above ₹499)",
      "VIP Dedicated Support & Exclusive Gifting on Festivals"
    ],
    isPopular: false,
    isActive: true
  }
];

export const initialMembershipRequests = [
  {
    id: "mem-req-101",
    userId: "user-regular",
    customerName: "Suresh Sharma (Normal Demo)",
    customerPhone: "9123456780",
    customerEmail: "suresh.normal@example.com",
    customerAddress: "House No. 128, Phase 1, UIT Sector 3, Bhiwadi, Rajasthan",
    planId: "plan-lifetime",
    planName: "Lifetime VIP Club (Maha Bachat)",
    planDuration: "Lifetime",
    planPrice: 5999,
    paymentMethod: "CASH", // CASH | UPI
    paymentStatus: "PENDING_COLLECTION", // PENDING_COLLECTION | COLLECTED | REFUNDED
    status: "PENDING_APPROVAL", // PENDING_APPROVAL | APPROVED | REJECTED | DEACTIVATED
    requestedAt: "2026-09-21T09:30:00.000Z",
    approvedAt: null,
    approvedBy: null,
    notes: "Customer opted for Cash on Delivery collection in Bhiwadi"
  },
  {
    id: "mem-req-100",
    userId: "user-member",
    customerName: "Rajesh Kumar (Member Demo)",
    customerPhone: "9876543210",
    customerEmail: "rajesh.member@example.com",
    customerAddress: "Flat 402, Tower B, Ashiana Town, Bhiwadi",
    planId: "plan-lifetime",
    planName: "Lifetime VIP Club (Maha Bachat)",
    planDuration: "Lifetime",
    planPrice: 5999,
    paymentMethod: "CASH",
    paymentStatus: "COLLECTED",
    status: "APPROVED",
    requestedAt: "2024-06-15T11:00:00.000Z",
    approvedAt: "2024-06-15T12:00:00.000Z",
    approvedBy: "Admin",
    notes: "Cash payment verified and collected at CB-03 store counter"
  }
];



