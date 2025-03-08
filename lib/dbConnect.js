import mongoose from "mongoose";

const connection = {};

export const dbConnect = async () => {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  } else {
    mongoose.set('debug', true);
    try {
      // Log URI for debugging (remove sensitive info in production)
      const uri = process.env.MONGODB_URI || '';
      console.log(`Connecting to MongoDB with URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
      
      const db = await mongoose.connect(uri, {
        connectTimeoutMS: 60000,
        serverSelectionTimeoutMS: 60000
      });

      connection.isConnected = db.connections[0].readyState;
      console.log("\nConnected to database");
    } catch (error) {
      console.error("Failed to connect to database :: \n" + error);
      // More detailed error information
      if (error.name === 'MongooseServerSelectionError') {
        console.error("Server selection failed. Check your MongoDB URI, network, and firewall settings.");
        console.error(`MongoDB servers: ${JSON.stringify(error.topology?.description?.servers || {})}`);
      }
      process.exit(1);
    }
  }
};