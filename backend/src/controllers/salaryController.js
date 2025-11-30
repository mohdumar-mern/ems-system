import expressAsyncHandler from "express-async-handler";
import { addSalary, getSalaryByEmpId } from "../services/salaryServices.js";

// ✅ Add Salary
export const addSalaryController = expressAsyncHandler(async (req, res) => {
  const {
    employeeId,
    basicSalary,
    allowances = 0,
    deductions = 0,
    payDate,
  } = req.body;

  const savedSalary = await addSalary({
    employeeId,
    basicSalary,
    allowances,
    deductions,
    payDate,
  })

  res.status(201).json({
    success: true,
    message: "Salary added successfully",
    salary: savedSalary,
  });
});

// ✅ Get All Salaries with Pagination + Search
export const getSalaryController = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 6, search = "" } = req.query;

  const salaries = await getSalary(page, limit, search);

  res.status(200).json({
    success: true,
    message: "Salaries fetched successfully",
    ...salaries,
  });
});

// ✅ Get Salary by EmployeeId or UserId
export const getSalaryByEmpIdController = expressAsyncHandler(async (req, res) => {
  const { empId } = req.params;

 const salaries = await getSalaryByEmpId(empId);


  res.status(200).json({
    success: true,
    message: "Salary records fetched successfully",
    salaries,
  });
});
