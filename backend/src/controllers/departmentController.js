import expressAsyncHandler from "express-async-handler";

import { 
  addDepartmentService, 
  deleteDepartmentService, 
  getDepartmentByIdService, 
  getDepartmentsService, 
  getDepartmentsNameService, 
  updateDepartmentService 
}  from "../services/departmentServices.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/apiResponse.js";

// ✅ Add Department
export const addDepartment = catchAsync(async (req, res) => {
  const { dep_name, description } = req.body;

  const result = await addDepartmentService({ dep_name, description, created_by: req.user._id })
  return res.
    status(201).json(new ApiResponse(201, result, "Department created successfully" ));
  
});

// ✅ Get All Departments with Search & Pagination
export const getDepartments = catchAsync(async (req, res) => {
  const { page = 1, limit = 6, search = "" } = req.query;

  const regex = new RegExp(search.trim(), "i");

  const query = {
    is_deleted: false,
    ...(search && {
      $or: [{ dep_name: regex }, { description: regex }],
    }),
  };

  const options = {
    page: Number(page),
    limit: Number(limit),
    lean: true,
    sort: { createdAt: -1 },
    populate: {
      path: "created_by",
      select: "name email",
    },
  };

  const result = await getDepartmentsService(query, options);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Departments fetched successfully"));
});


// ✅ Get Department by ID
export const getDepartmentById = expressAsyncHandler(async (req, res) => {
  const department = await getDepartmentByIdService(req.params.id);

  return res.status(200).json(new ApiResponse(200, department, "Department fetched successfully"));
});

// ✅ Update Department
export const updateDepartment = expressAsyncHandler(async (req, res) => {
  const { dep_name, description } = req.body;
  const updated = await updateDepartmentService(req.params.id, { dep_name, description });

  res.status(200).json(new ApiResponse(200, updated, "Department updated successfully"));
});

// ✅ Soft Delete Department and Related Data
export const deleteDepartment = expressAsyncHandler(async (req, res) => {
  await deleteDepartmentService(req.params.id, { userId: req.user._id });
  res.status(200).json(new ApiResponse(200, null, "Department deleted successfully"));
});

// ✅ Get All Department Names and IDs
export const getDepartmentsName = expressAsyncHandler(async (req, res) => {
  const departments = await getDepartmentsNameService();

  res.status(200).json(new ApiResponse(200, departments, "Department names fetched successfully"));
});
