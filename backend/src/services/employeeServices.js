import bcrypt from "bcryptjs";
import Department from "../models/departmentModel.js";
import Employee from "../models/employeeModel.js";
import User from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";
import { employeeRepository } from "../repositories/employeeRepo.js";
import ApiError from "../utils/ApiError.js";


const addEmployeeService = async ({
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
  created_by
}) => {

  // Check if user exists
  const existingUser = await employeeRepository.findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(400, "Email already in use");
  }

  // Check department
  const departmentDoc = await employeeRepository.findDepartmentByName(department);
  if (!departmentDoc) {
    throw new ApiError(400, `Department '${department}' not found`);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await employeeRepository.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // Generate employee ID
  const empId = `${user.name.replace(/\s+/g, "")}-${uuidv4().split("-")[0]}`;

  // Convert dob
  const dobDate = dob ? new Date(dob) : null;

  // Create employee
  const employee = await employeeRepository.createEmployee({
    userId: user._id,
    emp_name: user.name,
    empId,
    dob: dobDate,
    gender,
    maritalStatus,
    designation,
    department: departmentDoc._id,
    salary,
    created_by,
  });

  return employee;
};


const getEmployeeService = async ({ query, options }) => {
  const employees = await employeeRepository.Services(query, options);

  if (!employees?.data?.length) {
    throw new ApiError(404, "No employees found");
  }

  return employees;
};


const getEmployeeByIdService = async (id) => {
  // First, find employee by _id
  let employee = await employeeRepository.findByIdWithRelations(id);

  // If not found, try userId
  if (!employee) {
    employee = await employeeRepository.findByUserId(id);
  }

  //  If still not found, throw custom error
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  return employee;


}
const updateEmployeeService = async (id, data) => {
  const { name, maritalStatus, designation, department, salary, role } = data;

  // 1️⃣ Get employee
  const employee = await employeeRepository.findById(id);
  if (!employee) throw new ApiError(404, "Employee not found");

  // 2️⃣ Get associated User
  const user = await employeeRepository.findUser(employee.userId);
  if (!user) throw new ApiError(404, "Associated user not found");

  // 3️⃣ Update User
  user.name = name || user.name;
  user.role = role || user.role;
  await user.save();

  // 4️⃣ Generate employee ID
  const empId = `${user.name.replace(/\s+/g, "")}-${uuidv4().split("-")[0]}`;

  // 5️⃣ Department update logic
  let departmentId = department;

  if (department && isNaN(department)) {
    const dept = await employeeRepository.findDepartmentByName(department);
    if (!dept) {
      throw new ApiError(400, `Department '${department}' not found`);
    }
    departmentId = dept._id;
  }

  // 6️⃣ Update employee fields
  const updatedEmployee = await employeeRepository.updateEmployee(id, {
    emp_name: user.name,
    empId,
    maritalStatus: maritalStatus || employee.maritalStatus,
    designation: designation || employee.designation,
    department: departmentId || employee.department,
    salary: salary || employee.salary,
  });

  return updatedEmployee;
};


const getEmployeeByDepartmentIdService = async (departmentId) => {

  const exists = await employeeRepository.departmentExists({ _id: departmentId });
  if (!exists) {
    throw new ApiError(404, "Department not found");
  }

  const employees = await employeeRepository.findEmployeesByDepartment(departmentId);
  if (!employees.length) {
    throw new ApiError(404, "No employees found in this department");
  }
  return employees;
}

const deleteEmployeeService = async (id) => {

  const employee = await employeeRepository.findById(id);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  // Delete user + employee
  await Promise.all([
    employeeRepository.deleteUser(employee.userId),
    employeeRepository.deleteEmployee(id),
  ]);

  const remaining = await employeeRepository.findEmployeesByDepartment(
    employee.department
  );

  if (remaining.length === 0) {
    await employeeRepository.deleteDepartment(employee.department);
  }

  return {
    message: "Employee and associated user deleted successfully",
  };
};


export {
  addEmployeeService,
  getEmployeeService,
  getEmployeeByIdService,
  updateEmployeeService,
  getEmployeeByDepartmentIdService,
  deleteEmployeeService

};