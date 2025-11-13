import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "./config/database.js";
import { app } from "./app.js";
import { Logger } from "./utils/Logger.js";
const PORT = process.env.PORT || 8000;

// connect_DB().then(() => {
//     app.listen(PORT, () => console.log(`Active connection at Port: ${PORT}`) );
// }).catch((err) => console.log("mongoDB Connection failed ", err));


// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.on("error", (error) => {
      Logger.error("Express app error:", error);
      throw error;
    });

    app.listen(PORT, () => {
      Logger.info(`⚡️ Server is running on port: ${PORT}`);
      Logger.info(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      Logger.info(
        `🔗 Health check: http://localhost:${PORT}/api/healthcheck`
      );
    });
  })
  .catch((err) => {
    Logger.error("MongoDB connection failed:", err);
    process.exit(1);
});
