import mongoose, { Mongoose } from "mongoose";
import dns from "dns";

// Contourne querySrv ECONNREFUSED (Node DNS Windows / certains FAI)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

let MONGODB_URI: string;

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

async function connectDB(): Promise<Mongoose> {
  if (!MONGODB_URI) {
    MONGODB_URI = process.env.MONGODB_URI!;
    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable");
    }
  }

  const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

  if (!global.mongoose) {
    global.mongoose = cached;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
