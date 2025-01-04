import mongoose from "mongoose";

let cachedConnection = null;

const connectDatabase = async () => {
  console.log("connectDatabase called");

  // Check if a cached connection exists
  if (cachedConnection) {
    console.log("Using cached MongoDB connection.");
    return cachedConnection;
  }

  console.log("No cached connection found. Proceeding to connect.");
  try {
    console.log("MongoDB URI:", process.env.MONGO_URL);

    console.log("Setting strictQuery to false...");
    mongoose.set("strictQuery", false);

    const startTime = Date.now();
    console.log("Attempting to connect to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 10000, // Timeout for server selection
      connectTimeoutMS: 10000,        // Timeout for connection establishment
    });
    console.log("Connection established. Checking connection details...");

    const endTime = Date.now();
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Connection time: ${(endTime - startTime)} ms`);

    cachedConnection = conn; // Cache the connection
    console.log("Cached connection updated.");
    return conn;
  } catch (error) {
    console.log("Connection attempt failed. Checking details...");
    console.error("MongoDB connection error:", error.message);

    if (error.reason) {
      console.error("Error reason:", error.reason);
    }

    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }

    console.log("Re-throwing the error for upstream handling...");
    throw error;
  }
};

export default connectDatabase;
