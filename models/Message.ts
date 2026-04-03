import mongoose, { Schema, Model, Document } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true, maxlength: 120 },
    email: { type: String, required: true, maxlength: 254 },
    subject: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 8000 },
    status: { type: String, enum: ["unread", "read"], default: "unread" },
  },
  { timestamps: true }
);

MessageSchema.index({ status: 1 });
MessageSchema.index({ createdAt: -1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;