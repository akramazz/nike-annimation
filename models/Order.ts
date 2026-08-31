import mongoose, { Schema, Model, Document } from "mongoose";

export interface IOrderItem {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
  category?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  total: number;
  status: string;
  stockAdjusted: boolean;
  userId?: string;
  items: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, maxlength: 120 },
    name: { type: String, required: true, maxlength: 200 },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    color: { type: String, maxlength: 80 },
    size: { type: String, maxlength: 32 },
    image: { type: String, maxlength: 500 },
    category: { type: String, maxlength: 80 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, maxlength: 120 },
    email: { type: String, required: true, maxlength: 254 },
    phone: { type: String, maxlength: 40 },
    address: { type: String, maxlength: 500 },
    city: { type: String, maxlength: 120 },
    postalCode: { type: String, maxlength: 32 },
    country: { type: String, maxlength: 120 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    stockAdjusted: { type: Boolean, default: false },
    userId: { type: String, index: true },
    items: { type: [OrderItemSchema], required: true },
  },
  { timestamps: true }
);

OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ email: 1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;