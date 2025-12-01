import expressAsyncHandler from "express-async-handler";

import { addEmployee, deleteEmployee, getEmployee, getEmployeeByDepartmentId, getEmployeeById, updateEmployee } from "../services/employeeServices.js";
import ApiResponse from "../utils/apiResponse.js";
import catchAsync from "../utils/catchAsync.js";

// ➕ Add new employee
export const addEmployeeController = expressAsyncHandler(async (req, res, next) => {
  try {
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

    const employee = await addEmployee({
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

    // if (!req.file?.path && !req.file?.url) {
    //   return res.status(400).json({ success: false, error: "No profile image uploaded" });
    // }
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    next(error); // Pass error to express-async-handler/global error handler
  }
});

// 📄 Get all employees
export const getEmployeeController = catchAsync(async (req, res) => {
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

  const employees = await getEmployee({ query, options });
  console.log("employee", employees)


  return res
    .status(200)
    .json(new ApiResponse(200, employees, "Employees fetched successfully"));
});


// 🔍 Get employee by ID
export const getEmployeeByIdController = expressAsyncHandler(async (req, res) => {
  const employee = await getEmployeeById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Employee fetched successfully",
    employee,
  });
});

// ✏️ Update employee
export const updateEmployeeController = expressAsyncHandler(async (req, res) => {
  const { name, maritalStatus, designation, department, salary, role } = req.body;
  const { id } = req.params;
  const updatedEmployee = await updateEmployee(id, {
    name,
    maritalStatus,
    designation,
    department,
    salary,
    role,
  });

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    employee: updatedEmployee,
  });
});

// 🏢 Get Employees by Department
export const getEmployeeByDepartmentIdController = expressAsyncHandler(async (req, res) => {
  const employees = await getEmployeeByDepartmentId(req.params.id);
  res.status(200).json({
    success: true,
    message: "Employees fetched successfully",
    totalEmployeesDepartment: employees.length,
    employees,
  });
});

// 🗑️ Delete employee
export const deleteEmployeeController = expressAsyncHandler(async (req, res) => {

  const { success, message } = await deleteEmployee(req.params.id);

  res.status(200).json({
    success: success,
    message: message,
  });
});
