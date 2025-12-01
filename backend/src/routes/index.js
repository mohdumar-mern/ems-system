import express from "express";
import employeeRoutes from "./employeeRoute.js"
import departmentRoutes from "./departmentRoute.js"

const router = express.Router();

router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);

export default router;
