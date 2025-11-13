import mongoose from "mongoose";
import { Logger } from "../utils/Logger.js";
const connect_DB = async ()=>{
    try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`,{ serverSelectionTimeoutMS: 5000})
        console.log(`Mongo db connected !! DB host ${connectionInstance.connection.host}`)       
    Logger.info(
      `✅ MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`
    );
    } catch (err) {
         Logger.error("❌ MongoDB connection error:", err);
        console.log("MongoDB connection error FAILED ", err)
        process.exit(1);
    }
}

export default connect_DB;