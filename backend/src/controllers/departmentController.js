import expressAsyncHandler from "express-async-handler";

import { 
  addDepartment, 
  deleteDepartment, 
  getDepartmentById, 
  getDepartments, 
  getDepartmentsName, 
  updateDepartment 
}  from "../services/departmentServices.js";

// ✅ Add Department
export const addDepartmentController = expressAsyncHandler(async (req, res) => {
  const { dep_name, description } = req.body;

  const result = await addDepartment({ dep_name, description, created_by: req.user._id })
  res.status(201).json({
    success: true,
    message: "Department added successfully",
    department: result,
  });
});

// ✅ Get All Departments with Search & Pagination
export const getDepartmentsController = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 6, search = "" } = req.query;
  const regex = new RegExp(search.trim(), "i");
  const result = await getDepartments({ page, limit, search, regex });

  res.status(200).json({
    success: true,
    message: "Departments fetched successfully",
    ...result,
  });
});

// ✅ Get Department by ID
export const getDepartmentByIdController = expressAsyncHandler(async (req, res) => {
  const department = await getDepartmentById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Department retrieved successfully",
    department,
  });
});

// ✅ Update Department
export const updateDepartmentController = expressAsyncHandler(async (req, res) => {
  const { dep_name, description } = req.body;
  const updated = await updateDepartment(req.params.id, { dep_name, description });

  res.status(200).json({
    success: true,
    message: "Department updated successfully",
    department: updated,
  });
});

// ✅ Soft Delete Department and Related Data
export const deleteDepartmentController = expressAsyncHandler(async (req, res) => {
  await deleteDepartment(req.params.id, { userId: req.user._id });
  res.status(200).json({
    success: true,
    message: "Department and related data deleted successfully",
  });
});

// ✅ Get All Department Names and IDs
export const getDepartmentsNameController = expressAsyncHandler(async (req, res) => {
  const departments = await getDepartmentsName();

  res.status(200).json({
    success: true,
    message: "Departments fetched successfully",
    departments,
  });
});
