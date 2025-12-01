import express from "express";
const router = express.Router();

import {
  addEmployee,
  getEmployee,
  getEmployeeById,
  updateEmployee,
  getEmployeeByDepartmentId,
  deleteEmployee
} from "../controllers/employeeController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

// =============================
//       EMPLOYEE ROUTES
// =============================

// 📄 Get all employees
router.get("/", protect, getEmployee);

// 🏢 Get employees of a department
// ⚠️ IMPORTANT: Place before "/:id" to avoid conflict
router.get("/department/:id", protect, getEmployeeByDepartmentId);

// ➕ Create employee (Admin only)
// If you add file upload in future: upload.single("profile")
router.post("/", protect, adminOnly, addEmployee);

// 🔍 Get employee by ID (works for employeeId or userId)
router.get("/:id/view", protect, getEmployeeById);

// ✏️ Update employee
router.put("/:id/edit", protect, updateEmployee);

// 🗑 Delete employee (Admin only)
router.delete("/:id/delete", protect, adminOnly, deleteEmployee);

export default router;
