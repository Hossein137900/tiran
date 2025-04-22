import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Define a proper type for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define a proper type for the global object with mongoose property
interface CustomNodeJsGlobal {
  mongoose?: MongooseCache;
}
// Use the proper type instead of any
let cached: MongooseCache = (global as CustomNodeJsGlobal).mongoose || {
  conn: null,
  promise: null,
};

if (!cached) {
  cached = (global as CustomNodeJsGlobal).mongoose = {
    conn: null,
    promise: null,
  };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;
