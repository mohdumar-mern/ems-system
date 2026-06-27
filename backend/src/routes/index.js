import express from "express";
import employeeRoutes from "./employeeRoute.js"
import departmentRoutes from "./departmentRoute.js"
import userRoutes from "./userRoute.js"
import adminRoutes from "./adminRoute.js"

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/departments", departmentRoutes);
router.use("/employees", employeeRoutes);
router.use("/employees", employeeRoutes);

export default router;
