import mongoose, { Schema, Model, Document } from "mongoose";

export interface IRating extends Document {
  userId: string;
  productId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    userId: { type: String, required: true, index: true },
    productId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

RatingSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Rating: Model<IRating> =
  mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema);

export default Rating;
