import "dotenv/config";
import connectDB from "./utils/mongodb";
import Product from "./models/Product";

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

async function seed() {
  try {
    await connectDB();

    const count = await Product.countDocuments();
    if (count > 0) {
      console.log("Database already has products, skipping seed");
      return;
    }

    await Product.insertMany(seedProducts);
    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();