import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "products.json");

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    const initialProducts = [
      {
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
        id: 7,
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
        id: 8,
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
    fs.writeFileSync(dataFilePath, JSON.stringify(initialProducts, null, 2));
  }
};

// GET all products
export async function GET() {
  try {
    ensureDataDir();
    const data = fs.readFileSync(dataFilePath, "utf8");
    const products = JSON.parse(data);
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST new product
export async function POST(request: NextRequest) {
  try {
    ensureDataDir();
    const body = await request.json();
    const data = fs.readFileSync(dataFilePath, "utf8");
    const products = JSON.parse(data);

    const newProduct = {
      id:
        products.length > 0
          ? Math.max(...products.map((p: any) => p.id)) + 1
          : 1,
      ...body,
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));

    return NextResponse.json(
      { success: true, product: newProduct },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 },
    );
  }
}

// PUT update product
export async function PUT(request: NextRequest) {
  try {
    ensureDataDir();
    const body = await request.json();
    const { id, ...updates } = body;

    const data = fs.readFileSync(dataFilePath, "utf8");
    const products = JSON.parse(data);

    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));

    return NextResponse.json({ success: true, product: products[index] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE product
export async function DELETE(request: NextRequest) {
  try {
    ensureDataDir();
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    const data = fs.readFileSync(dataFilePath, "utf8");
    const products = JSON.parse(data);

    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    products.splice(index, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
