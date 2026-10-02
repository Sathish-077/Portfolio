export const CATEGORIES = [
  { id: "audio", label: "Audio" },
  { id: "wearables", label: "Wearables" },
  { id: "accessories", label: "Accessories" },
  { id: "home", label: "Home & Lifestyle" }
];

export const products = [
  { id: "aurora-wireless-headphones", name: "Aurora Wireless Headphones", category: "audio", price: 4999, rating: 4.6, reviews: 328, image: "headphones", featured: true,
    description: "Over-ear headphones with active noise cancellation and soft memory-foam ear cups for all-day comfort.",
    features: ["Active noise cancellation", "40-hour battery life", "Bluetooth 5.3 with multipoint", "Foldable design with carry pouch"] },
  { id: "pulse-smartwatch", name: "Pulse Smartwatch", category: "wearables", price: 3499, rating: 4.4, reviews: 512, image: "smartwatch", featured: true,
    description: "A lightweight smartwatch that tracks your steps, heart rate and sleep with a bright AMOLED display.",
    features: ["1.4-inch AMOLED display", "Heart rate and SpO2 tracking", "7-day battery life", "Water resistant up to 50 m"] },
  { id: "boom-portable-speaker", name: "Boom Portable Speaker", category: "audio", price: 2499, rating: 4.5, reviews: 207, image: "speaker", featured: true,
    description: "A rugged Bluetooth speaker with deep bass and a built-in microphone for calls.",
    features: ["360-degree sound", "12-hour playtime", "IPX6 splash proof", "USB-C fast charging"] },
  { id: "stride-running-sneakers", name: "Stride Running Sneakers", category: "accessories", price: 2999, rating: 4.3, reviews: 441, image: "sneakers", featured: false,
    description: "Breathable mesh sneakers with a cushioned sole built for daily runs and long walks.",
    features: ["Breathable mesh upper", "Shock-absorbing sole", "Slip-resistant grip", "Available in sizes 6 to 11"] },
  { id: "nomad-travel-backpack", name: "Nomad Travel Backpack", category: "accessories", price: 1899, rating: 4.7, reviews: 689, image: "backpack", featured: true,
    description: "A 30-litre backpack with a padded laptop compartment, hidden pockets and a water-resistant finish.",
    features: ["Fits laptops up to 15.6 inch", "Water-resistant fabric", "Anti-theft back pocket", "Padded ergonomic straps"] },
  { id: "snap-mirrorless-camera", name: "Snap Mirrorless Camera", category: "wearables", price: 38999, rating: 4.8, reviews: 96, image: "camera", featured: false,
    description: "A compact 24 MP mirrorless camera with fast autofocus and 4K video for creators on the move.",
    features: ["24 MP APS-C sensor", "4K video at 30 fps", "Eye-detection autofocus", "Wi-Fi and Bluetooth sharing"] },
  { id: "click-mechanical-keyboard", name: "Click Mechanical Keyboard", category: "accessories", price: 3299, rating: 4.6, reviews: 254, image: "keyboard", featured: true,
    description: "A compact 75% mechanical keyboard with hot-swappable switches and soft white backlighting.",
    features: ["Hot-swappable switches", "Wired and Bluetooth modes", "PBT keycaps", "Customisable backlight"] },
  { id: "glide-wireless-mouse", name: "Glide Wireless Mouse", category: "accessories", price: 999, rating: 4.2, reviews: 733, image: "mouse", featured: false,
    description: "A quiet, ergonomic wireless mouse with adjustable DPI and a 12-month battery.",
    features: ["Silent click buttons", "Adjustable 800 to 3200 DPI", "2.4 GHz receiver", "12-month battery life"] },
  { id: "glow-desk-lamp", name: "Glow Desk Lamp", category: "home", price: 1299, rating: 4.5, reviews: 175, image: "lamp", featured: false,
    description: "An eye-care LED desk lamp with three colour temperatures and touch dimming.",
    features: ["3 colour modes, 5 brightness levels", "Touch control panel", "Flexible neck", "Built-in USB charging port"] },
  { id: "shade-polarised-sunglasses", name: "Shade Polarised Sunglasses", category: "wearables", price: 1499, rating: 4.1, reviews: 142, image: "sunglasses", featured: false,
    description: "Lightweight polarised sunglasses with UV400 protection and a durable frame.",
    features: ["UV400 polarised lenses", "Flexible lightweight frame", "Scratch-resistant coating", "Includes hard case"] },
  { id: "volt-power-bank", name: "Volt 20000 mAh Power Bank", category: "accessories", price: 1799, rating: 4.4, reviews: 612, image: "powerbank", featured: false,
    description: "A slim 20000 mAh power bank with 22.5 W fast charging for phones, tablets and earbuds.",
    features: ["20000 mAh capacity", "22.5 W fast charging", "Dual USB-A and USB-C ports", "LED battery indicator"] },
  { id: "brew-insulated-mug", name: "Brew Insulated Mug", category: "home", price: 699, rating: 4.7, reviews: 389, image: "mug", featured: false,
    description: "A stainless-steel insulated mug that keeps drinks hot for 8 hours and cold for 16.",
    features: ["Double-wall vacuum insulation", "Leak-proof lid", "BPA-free, food-grade steel", "Fits most car cup holders"] }
];

export const getProduct = id => products.find(p => p.id === id);
