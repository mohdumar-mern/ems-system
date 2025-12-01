import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";

import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utils/swaggerSpec.js";
import mongoSanitize from "express-mongo-sanitize";



// console.log("Files in routes folder:", fs.readdirSync("./routes"));

// Routes
import routes from "./routes/index.js";
import adminRoutes from "./routes/adminRoute.js";
import userRoutes from "./routes/userRoute.js";
import departmentRoutes from "./routes/departmentRoute.js";
import employeeRoutes from "./routes/employeeRoute.js";
import salaryRoutes from "./routes/salaryRoute.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import leaveRoutes from "./routes/leaveRoute.js";
import { keepAlive } from "./utils/keepAlive.js";
import errorHandler from "./middlewares/errorHandler.js";
import corsOptions from "./config/corsOptions.js";
import { apiLimiter } from "./config/rateLimiter.js";
import sanitize from "./middlewares/sanitize.js";
import notFound from "./middlewares/notFound.js";

dotenv.config();
const app = express();

// Enable __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Security
app.use(helmet());
app.use(cors(corsOptions));
app.use(apiLimiter);


/// Body parsers
app.use(cookieParser());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));

// ⭐ FIX FOR EXPRESS 5 → CUSTOM MONGO SANITIZE
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  // IMPORTANT: DO NOT SANITIZE req.query (Express 5 getter-only)
  next();
});

// XSS Clean

// Logging
app.use(morgan("dev"));
// Compression
app.use(compression());


// ✅ Swagger API Docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Health Check
app.get("/health", (req, res) => {
  res.send("API is running securely...");
});

// API Routes
// app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/v1", routes);
// app.use("/api/salary", salaryRoutes);
// app.use("/api/leaves", leaveRoutes);
// app.use("/api/dashboard", summaryRoutes);

// 404
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app

