import "dotenv/config";
import connectDB from "./utils/mongodb";
import Product from "./models/Product";
import Order from "./models/Order";
import Message from "./models/Message";
import { PRODUCT_CATALOG } from "./lib/product-catalog";

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
    total: 179.98,
    status: "confirmed",
    items: [
      {
        name: "Alger Soleil",
        price: 89.99,
        quantity: 2,
        color: "Orange",
        size: "M",
        image: "/products/algersoliel.webp",
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
    total: 119.99,
    status: "pending",
    items: [
      {
        name: "Sekiro",
        price: 119.99,
        quantity: 1,
        color: "Noir",
        size: "L",
        image: "/products/sekiro.webp",
      },
    ],
  },
];

const seedMessages = [
  {
    name: "Client Demo",
    email: "client@example.com",
    subject: "Question sur les tailles",
    message:
      "Bonjour, quelle taille recommandez-vous pour quelqu'un mesurant 1m75?",
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

    await Product.insertMany(PRODUCT_CATALOG);
    console.log(`✓ Inserted ${PRODUCT_CATALOG.length} products`);

    await Order.insertMany(seedOrders);
    console.log(`✓ Inserted ${seedOrders.length} orders`);

    await Message.insertMany(seedMessages);
    console.log(`✓ Inserted ${seedMessages.length} messages`);

    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const messageCount = await Message.countDocuments();

    console.log(`\nDatabase reset and seeded successfully!`);
    console.log(
      `Total: ${productCount} products, ${orderCount} orders, ${messageCount} messages`,
    );

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
