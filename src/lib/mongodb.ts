import { MongoClient } from "mongodb";
import mongoose, { Mongoose } from "mongoose";

declare global {
  var mongooseCache: CachedMongoose | undefined;
  var mongoClientCache: CachedMongoClient | undefined;
}

interface CachedMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

interface CachedMongoClient {
  conn: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

const MONGO_URI: string | undefined = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env"
  );
}

let mongooseCache: CachedMongoose = global.mongooseCache || {
  conn: null,
  promise: null,
};

let mongoClientCache: CachedMongoClient = global.mongoClientCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = mongooseCache;
}

if (!global.mongoClientCache) {
  global.mongoClientCache = mongoClientCache;
}

// For Mongoose ORM
export async function dbConnect(): Promise<Mongoose> {
  if (mongooseCache.conn) return mongooseCache.conn;

  if (!mongooseCache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    };

    mongooseCache.promise = mongoose
      .connect(MONGO_URI!, opts)
      .then((mongoose) => {
        console.log("MongoDB connection established (Mongoose)");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection failed, retrying...", err);
        mongooseCache.promise = null;
        return dbConnect(); // Dobara try karo
      });
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
    return mongooseCache.conn;
  } catch (error) {
    mongooseCache.promise = null;
    throw error;
  }
}

// For Native MongoDB Driver
export async function connectToDatabase() {
  if (mongoClientCache.conn) {
    return { db: mongoClientCache.conn.db() };
  }

  if (!mongoClientCache.promise) {
    mongoClientCache.promise = MongoClient.connect(MONGO_URI!)
      .then((client) => {
        console.log("MongoDB connection established (Native)");
        return client;
      })
      .catch((err) => {
        console.error("MongoDB connection failed, retrying...", err);
        mongoClientCache.promise = null;
        throw err;
      });
  }

  try {
    mongoClientCache.conn = await mongoClientCache.promise;
    return { db: mongoClientCache.conn.db() };
  } catch (error) {
    mongoClientCache.promise = null;
    throw error;
  }
}

export default dbConnect;
