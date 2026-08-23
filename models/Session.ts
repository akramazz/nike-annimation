import mongoose, { Schema, Model, Document } from "mongoose";

export interface ISession extends Document {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt?: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true, expires: 0 },
    createdAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date },
  },
  { timestamps: false }
);

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default Session;
