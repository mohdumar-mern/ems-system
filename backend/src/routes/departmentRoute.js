/**
 * @swagger
 * tags:
 *   name: Department
 *   description: Endpoints for managing departments
 */

import express from "express";
const router = express.Router();

import {
  addDepartment,
  getDepartmentById,
  deleteDepartment,
  updateDepartment,
  getDepartments,
  getDepartmentsName,
} from "../controllers/departmentController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";


router.post("/", protect, adminOnly, addDepartment);


router.get("/", getDepartments);


router.get("/dep-name", getDepartmentsName);


router.get("/:id/view", protect, adminOnly, getDepartmentById);


router.put("/:id/edit", protect, adminOnly, updateDepartment);


router.delete("/:id/delete", protect, adminOnly, deleteDepartment);

export default router;
