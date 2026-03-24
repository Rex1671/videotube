import mongoose from "mongoose";
import dotenv from "dotenv";

import { DB_NAME } from "../constants.js";

const connectDB=async()=>{
    try {
        const connectionString=`${process.env.MONGODB_URI}/${DB_NAME}`;
        const connectionInstance=await mongoose.connect(connectionString)
        console.log("DB: Connected successfully! Host:", connectionInstance.connection.host);
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR",error);
        process.exit(1);
    }
}

export default connectDB;