import mongoose from "mongoose";
import { MongoClient } from "mongodb";

type MongooseState = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseState: MongooseState | undefined;
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

let cached: MongooseState = global.mongooseState || {
  conn: null,
  promise: null,
};

if (!global.mongooseState) {
  global.mongooseState = cached;
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;

// For raw MongoDB operations
let mongoClientCache: MongoClient | null = null;

export async function getMongoClient() {
  if (mongoClientCache) {
    return mongoClientCache;
  }

  const client = new MongoClient(MONGO_URI!);
  await client.connect();
  mongoClientCache = client;
  return client;
}
