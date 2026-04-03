import mongoose, { Schema, Model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  color: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  sizes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, maxlength: 120 },
    color: { type: String, required: true, maxlength: 80 },
    image: { type: String, default: "/products/default.webp", maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "", maxlength: 2000 },
    category: { type: String, default: "Classic", maxlength: 80 },
    sizes: { type: [String], default: ["XS", "S", "M", "L", "XL", "XXL"] },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text" });
ProductSchema.index({ category: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;