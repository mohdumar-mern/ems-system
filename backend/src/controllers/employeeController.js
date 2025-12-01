import {
  addEmployeeService,
  deleteEmployeeService,
  getEmployeeService,
  getEmployeeByDepartmentIdService,
  getEmployeeByIdService,
  updateEmployeeService
} from "../services/employeeServices.js";

import ApiResponse from "../utils/apiResponse.js";
import catchAsync from "../utils/catchAsync.js";

/* ===========================================================
    ➕ ADD EMPLOYEE
=========================================================== */
export const addEmployee = catchAsync(async (req, res) => {
  const {
    name,
    email,
    password,
    dob,
    gender,
    maritalStatus,
    designation,
    department,
    salary,
    role = "employee",
  } = req.body;

  const employee = await addEmployeeService({
    name,
    email,
    password,
    dob,
    gender,
    maritalStatus,
    designation,
    department,
    salary,
    role,
    created_by: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(201, employee, "Employee created successfully")
  );
});

/* ===========================================================
    📄 GET ALL EMPLOYEES (Pagination + Filtering)
=========================================================== */
export const getEmployee = catchAsync(async (req, res) => {
  const { page = 1, limit = 6, search = "" } = req.query;

  const options = {
    page: Number(page),
    limit: Number(limit),
    lean: true,
    populate: [
      { path: "userId", select: "_id name email profile" },
      { path: "department", select: "_id dep_name" },
      { path: "created_by", select: "_id name email" },
    ],
    sort: { createdAt: -1 },
  };

  const query = {};

  if (search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    query.$or = [
      { emp_name: regex },
      { empId: regex },
      { designation: regex },
      { salary: regex },
      { gender: regex },
      { maritalStatus: regex },
    ];
  }

  const employees = await getEmployeeService({ query, options });

  return res
    .status(200)
    .json(new ApiResponse(200, employees, "Employees fetched successfully"));
});

/* ===========================================================
    🔍 GET EMPLOYEE BY ID OR userId
=========================================================== */
export const getEmployeeById = catchAsync(async (req, res) => {
  const employee = await getEmployeeByIdService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, employee, "Employee fetched successfully"));
});

/* ===========================================================
    ✏️ UPDATE EMPLOYEE
=========================================================== */
export const updateEmployee = catchAsync(async (req, res) => {
  const updatedEmployee = await updateEmployeeService(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEmployee, "Employee updated successfully"));
});

/* ===========================================================
    🏢 GET EMPLOYEES BY DEPARTMENT ID
=========================================================== */
export const getEmployeeByDepartmentId = catchAsync(async (req, res) => {
  const employees = await getEmployeeByDepartmentIdService(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Employees fetched successfully",
    totalEmployeesDepartment: employees.length,
    employees,
  });
});

/* ===========================================================
    🗑 DELETE EMPLOYEE (with user + auto dep delete)
=========================================================== */
export const deleteEmployee = catchAsync(async (req, res) => {
  const { message } = await deleteEmployeeService(req.params.id);

  return res.status(200).json(new ApiResponse(200, {}, message));
});
