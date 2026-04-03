import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./utils/mongodb";
import Product from "./models/Product";
import Order from "./models/Order";
import Message from "./models/Message";

const seedProducts = [
  {
    name: "Veste Rouge",
    color: "Rouge",
    image: "/products/rouge.webp",
    price: 69.99,
    stock: 25,
    description: "Élégance audacieuse pour un style unique",
    category: "Premium",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Veste Gris",
    color: "Gris",
    image: "/products/gris.webp",
    price: 220.99,
    stock: 15,
    description: "Sophistication et confort absolu",
    category: "Luxury",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Veste Bleue",
    color: "Bleu",
    image: "/products/blue.webp",
    price: 59.99,
    stock: 30,
    description: "Style moderne et dynamique",
    category: "Classic",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Veste Marron",
    color: "Marron",
    image: "/products/maron.webp",
    price: 33.99,
    stock: 40,
    description: "Chaleur et élégance naturelle",
    category: "Classic",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Veste Beige",
    color: "Beige",
    image: "/products/beage.webp",
    price: 59.99,
    stock: 20,
    description: "Minimalisme sophistiqué",
    category: "Premium",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Veste Noire",
    color: "Noir",
    image: "/products/noir.webp",
    price: 59.99,
    stock: 35,
    description: "Intemporelle et raffinée",
    category: "Classic",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Veste Verte",
    color: "Vert",
    image: "/products/vert.webp",
    price: 88.99,
    stock: 18,
    description: "Fraîcheur et originalité",
    category: "Premium",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Veste Pistache",
    color: "Pistache",
    image: "/products/pistache.webp",
    price: 69.99,
    stock: 22,
    description: "Couleur vive et esprit jeune",
    category: "Premium",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
];

const seedOrders = [
  {
    orderNumber: "ORD-DEMO-001",
    customerName: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de la Paix",
    city: "Paris",
    postalCode: "75001",
    country: "France",
    total: 139.98,
    status: "confirmed",
    items: [
      {
        name: "Veste Rouge",
        price: 69.99,
        quantity: 2,
        color: "Rouge",
        size: "M",
        image: "/products/rouge.webp",
      },
    ],
  },
  {
    orderNumber: "ORD-DEMO-002",
    customerName: "Marie Martin",
    email: "marie.martin@example.com",
    phone: "+33 6 98 76 54 32",
    address: "45 Avenue des Champs-Élysées",
    city: "Lyon",
    postalCode: "69002",
    country: "France",
    total: 220.99,
    status: "pending",
    items: [
      {
        name: "Veste Gris",
        price: 220.99,
        quantity: 1,
        color: "Gris",
        size: "L",
        image: "/products/gris.webp",
      },
    ],
  },
];

const seedMessages = [
  {
    name: "Client Demo",
    email: "client@example.com",
    subject: "Question sur les tailles",
    message: "Bonjour, quelle taille recommendez-vous pour quelqu'un mesurant 1m75?",
    status: "unread",
  },
  {
    name: "Acheteur Test",
    email: "test@example.com",
    subject: "Délai de livraison",
    message: "Quel est le délai de livraison pour la France?",
    status: "read",
  },
];

async function checkCollections() {
  const conn = await connectDB();
  const db = conn.connection.db;
  if (!db) return false;

  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);
  
  console.log("Collections found:", collectionNames.join(", "));
  return collectionNames;
}

async function resetCollections() {
  await checkCollections();

  await Promise.all([
    Product.deleteMany({}),
    Order.deleteMany({}),
    Message.deleteMany({}),
  ]);
  
  console.log("All collections cleared");
}

async function seed() {
  try {
    console.log("Starting database seed...\n");

    await resetCollections();

    await Product.insertMany(seedProducts);
    console.log(`✓ Inserted ${seedProducts.length} products`);

    await Order.insertMany(seedOrders);
    console.log(`✓ Inserted ${seedOrders.length} orders`);

    await Message.insertMany(seedMessages);
    console.log(`✓ Inserted ${seedMessages.length} messages`);

    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const messageCount = await Message.countDocuments();

    console.log(`\nDatabase reset and seeded successfully!`);
    console.log(`Total: ${productCount} products, ${orderCount} orders, ${messageCount} messages`);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();