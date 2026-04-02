import type { Message, Order, OrderItem, Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

function decimalToNumber(d: Decimal): number {
  return Number(d);
}

export function productToJson(p: Product) {
  return {
    id: p.id,
    name: p.name,
    color: p.color,
    image: p.image,
    price: decimalToNumber(p.price),
    stock: p.stock,
    description: p.description,
    category: p.category,
    sizes: [...p.sizes],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export function orderItemToJson(i: OrderItem) {
  return {
    productId: i.productId,
    name: i.name,
    price: decimalToNumber(i.price),
    quantity: i.quantity,
    color: i.color,
    size: i.size,
    image: i.image,
  };
}

export function orderToJson(o: Order & { items: OrderItem[] }) {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    email: o.email,
    phone: o.phone,
    address: o.address,
    city: o.city,
    postalCode: o.postalCode,
    country: o.country,
    total: decimalToNumber(o.total),
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    items: o.items.map(orderItemToJson),
  };
}

export function messageToJson(m: Message) {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    status: m.status,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  };
}
