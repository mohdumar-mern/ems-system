import {
  addDepartmentService,
  deleteDepartmentService,
  getDepartmentByIdService,
  getDepartmentsService,
  getDepartmentsNameService,
  updateDepartmentService
} from "../services/departmentServices.js";
import ApiResponse from "../utils/apiResponse.js";
import catchAsync from "../utils/catchAsync.js";

// ➕ Add Department
export const addDepartment = catchAsync(async (req, res) => {
  const { dep_name, description } = req.body;

  const result = await addDepartmentService({
    dep_name,
    description,
    created_by: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, result, "Department created successfully"));
});

// 📄 Get All Departments (Search + Pagination)
export const getDepartments = catchAsync(async (req, res) => {
  const { page = 1, limit = 6, search = "" } = req.query;

  const query = {
    is_deleted: false,
    ...(search.trim() && {
      $or: [
        { dep_name: new RegExp(search.trim(), "i") },
        { description: new RegExp(search.trim(), "i") }
      ]
    })
  };

  const options = {
    page: Number(page),
    limit: Number(limit),
    sort: { createdAt: -1 }
  };

  const result = await getDepartmentsService(query, options);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Departments fetched successfully"));
});

// 🔍 Get Department by ID
export const getDepartmentById = catchAsync(async (req, res) => {
  const department = await getDepartmentByIdService(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, department, "Department fetched successfully"));
});

// ✏ Update Department
export const updateDepartment = catchAsync(async (req, res) => {
  const updated = await updateDepartmentService(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Department updated successfully"));
});

// 🗑 Soft Delete
export const deleteDepartment = catchAsync(async (req, res) => {
  await deleteDepartmentService(req.params.id, { userId: req.user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Department deleted successfully"));
});

// 📌 Get Department Names Only
export const getDepartmentsName = catchAsync(async (req, res) => {
  const list = await getDepartmentsNameService();
  return res
    .status(200)
    .json(new ApiResponse(200, list, "Department names fetched successfully"));
});
