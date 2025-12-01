import dotenv from "dotenv";
dotenv.config(); // Load env early (best practice)

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { ensureIndexes } from "./src/startup/ensureIndexes.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1️⃣ Connect DB first
    await connectDB();
    console.log("✅ Database connected");

    // 2️⃣ Ensure indexes AFTER DB connection
    await ensureIndexes();
    console.log("⚙️ Indexes ensured successfully");

    // 3️⃣ Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // 4️⃣ Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });

    // 5️⃣ Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err);
      server.close(() => process.exit(1));
    });

    // 6️⃣ Handle SIGTERM (Docker/PM2 shutdown)
    process.on("SIGTERM", () => {
      console.log("🛑 SIGTERM received. Shutting down...");
      server.close(() => process.exit(0));
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
