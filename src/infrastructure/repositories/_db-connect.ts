import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongooseURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
const testURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";

const uri =
  process.env.NODE_ENV === "test"
    ? testURI // Connection for tests db
    : mongooseURI; // Remote connection

if (!uri) {
  throw new Error("URI not found");
}

export async function runDB() {
  try {
    await mongoose.connect(mongooseURI);
    console.log("Connection successful");
  } catch {
    await mongoose.disconnect();
    console.log("Connection to database failed");
  }
}
