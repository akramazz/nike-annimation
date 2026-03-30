import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "orders.json");

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
  }
};

// GET all orders
export async function GET(request: NextRequest) {
  try {
    ensureDataDir();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const data = fs.readFileSync(dataFilePath, "utf8");
    let orders = JSON.parse(data);

    if (status) {
      orders = orders.filter((order: any) => order.status === status);
    }

    // Sort by date descending
    orders.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

// POST new order
export async function POST(request: NextRequest) {
  try {
    ensureDataDir();
    const body = await request.json();
    const data = fs.readFileSync(dataFilePath, "utf8");
    const orders = JSON.parse(data);

    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map((o: any) => o.id)) + 1 : 1,
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));

    // Update product stock
    const productsPath = path.join(process.cwd(), "data", "products.json");
    if (fs.existsSync(productsPath)) {
      const productsData = fs.readFileSync(productsPath, "utf8");
      const products = JSON.parse(productsData);

      body.items.forEach((item: any) => {
        const productIndex = products.findIndex(
          (p: any) => p.id === item.productId,
        );
        if (productIndex !== -1) {
          products[productIndex].stock = Math.max(
            0,
            products[productIndex].stock - item.quantity,
          );
        }
      });

      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    }

    return NextResponse.json(
      { success: true, order: newOrder },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 },
    );
  }
}

// PUT update order status
export async function PUT(request: NextRequest) {
  try {
    ensureDataDir();
    const body = await request.json();
    const { id, status } = body;

    const data = fs.readFileSync(dataFilePath, "utf8");
    const orders = JSON.parse(data);

    const index = orders.findIndex((o: any) => o.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    orders[index] = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));

    return NextResponse.json({ success: true, order: orders[index] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 },
    );
  }
}

// DELETE order
export async function DELETE(request: NextRequest) {
  try {
    ensureDataDir();
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    const data = fs.readFileSync(dataFilePath, "utf8");
    const orders = JSON.parse(data);

    const index = orders.findIndex((o: any) => o.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    orders.splice(index, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));

    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 },
    );
  }
}
