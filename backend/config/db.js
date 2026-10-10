import mongoose from "mongoose";

let connectionPromise;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!process.env.MONGODBURI) {
    throw new Error("MONGODBURI environment variable is not configured");
  }

  // Reuse a pending connection across warm Vercel function invocations.
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODBURI).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  const conn = await connectionPromise;
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn.connection;
};
