import expressAsyncHandler from "express-async-handler";

import { addEmployeeService, deleteEmployeeService, getEmployeeService, getEmployeeByDepartmentIdService, getEmployeeByIdService, updateEmployeeService } from "../services/employeeServices.js";
import ApiResponse from "../utils/apiResponse.js";
import catchAsync from "../utils/catchAsync.js";

// ➕ Add new employee
export const addEmployee = expressAsyncHandler(async (req, res) => {
  
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

  res.status(201).json({
    success: true,
    message: "Employee created successfully",
    employee,
  });
});


// 📄 Get all employees
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


// 🔍 Get employee by ID
export const getEmployeeById = expressAsyncHandler(async (req, res) => {
  const employee = await getEmployeeByIdService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, employee, "Employees fetched successfully"));
});

// ✏️ Update employee
export const updateEmployee = expressAsyncHandler(async (req, res) => {
  const updatedEmployee = await updateEmployeeService(req.params.id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, updatedEmployee, "Employee updated successfully"));

});

// 🏢 Get Employees by Department
export const getEmployeeByDepartmentId = expressAsyncHandler(async (req, res) => {
  const employees = await getEmployeeByDepartmentIdService(req.params.id);
  res.status(200).json({
    success: true,
    message: "Employees fetched successfully",
    totalEmployeesDepartment: employees.length,
    employees,
  });
});

// 🗑Delete employee
export const deleteEmployee = expressAsyncHandler(async (req, res) => {
  const { message } = await deleteEmployeeService(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, message));
});
