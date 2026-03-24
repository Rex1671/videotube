import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const uri = process.env.MONGODB_URI;
const dbName = "videotube";

console.log("Testing connection to:", uri);

try {
  await mongoose.connect(`${uri}/${dbName}`);
  console.log("SUCCESS: Connected to MongoDB");
  process.exit(0);
} catch (error) {
  console.error("FAILURE: Connection failed:", error.message);
  process.exit(1);
}
