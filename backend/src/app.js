import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import xss from "xss-clean";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utils/swaggerSpec.js";
import logger from "./utils/logger.js";


// console.log("Files in routes folder:", fs.readdirSync("./routes"));

// Routes
import adminRoutes from "./routes/adminRoute.js";
import userRoutes from "./routes/userRoute.js";
import departmentRoutes from "./routes/departmentRoute.js";
import employeeRoutes from "./routes/employeeRoute.js";
import salaryRoutes from "./routes/salaryRoute.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import leaveRoutes from "./routes/leaveRoute.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import { keepAlive } from "./utils/keepAlive.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Enable __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https://res.cloudinary.com;"
  );
  next();
});

// ✅ Security Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || "http://localhost:5173", "https://res.cloudinary.com"],
    },
  })
);

// ✅ Other Security Middlewares
app.use(globalLimiter);
// app.use(mongoSanitize());
// app.use(xss());
// app.use(hpp());

// ✅ CORS
const allowedOrigins = [
  "http://localhost:5173", // local dev frontend
  "https://ems-system-psi.vercel.app", // deployed frontend
  process.env.FRONTEND_URL,
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ✅ Parsing
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Logging
const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ✅ Compression
app.use(compression());

// ✅ Swagger API Docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Health Check
app.get("/health", (req, res) => {
  res.send("API is running securely...");
});

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/dashboard", summaryRoutes);

// 404 Fallback
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});


export default app

