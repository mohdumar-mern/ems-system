import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { employeeRepository } from "../repositories/employeeRepo.js";
import ApiError from "../utils/ApiError.js";

/* ===========================================================
    🟢 ADD EMPLOYEE
=========================================================== */
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

  // Check if email exists
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

  // Create User
  const user = await employeeRepository.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // Generate Employee ID
  const empId = `${user.name.replace(/\s+/g, "")}-${uuidv4().split("-")[0]}`;

  // Convert DOB
  const dobDate = dob ? new Date(dob) : null;

  // Create Employee
  const employee = await employeeRepository.createEmployee({
    userId: user._id,
    emp_name: name,
    empId,
    dob: dobDate,
    gender,
    maritalStatus,
    designation,
    department: departmentDoc._id,
    salary,
    created_by
  });

  return employee;
};

/* ===========================================================
    🟢 GET ALL EMPLOYEES (Pagination, Filtering)
=========================================================== */
const getEmployeeService = async ({ query, options }) => {
  const employees = await employeeRepository.getEmployees(query, options);

  if (!employees?.docs?.length) {
    throw new ApiError(404, "No employees found");
  }

  return employees;
};

/* ===========================================================
    🟢 GET EMPLOYEE BY ID OR userId
=========================================================== */
const getEmployeeByIdService = async (id) => {
  // Try employee _id
  let employee = await employeeRepository.findByIdWithRelations(id);

  // Try userId relation
  if (!employee) {
    employee = await employeeRepository.findByUserIdWithRelations(id);
  }

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  return employee;
};

/* ===========================================================
    🟢 UPDATE EMPLOYEE
=========================================================== */
const updateEmployeeService = async (id, data) => {
  const { name, maritalStatus, designation, department, salary, role } = data;

  const employee = await employeeRepository.findById(id);
  if (!employee) throw new ApiError(404, "Employee not found");

  // Get associated user
  const user = await employeeRepository.findUser(employee.userId);
  if (!user) throw new ApiError(404, "Associated user not found");

  // Update User
  if (name) user.name = name;
  if (role) user.role = role;
  await user.save();

  // Regenerate empId
  const empId = `${user.name.replace(/\s+/g, "")}-${uuidv4().slice(0, 4)}`;

  // Department update
  let departmentId = employee.department;

  if (department) {
    const deptDoc = await employeeRepository.findDepartmentByName(department);
    if (!deptDoc) {
      throw new ApiError(400, `Department '${department}' not found`);
    }
    departmentId = deptDoc._id;
  }

  // Update employee
  const updatedEmployee = await employeeRepository.updateEmployee(id, {
    emp_name: user.name,
    empId,
    maritalStatus: maritalStatus ?? employee.maritalStatus,
    designation: designation ?? employee.designation,
    department: departmentId,
    salary: salary ?? employee.salary,
  });

  return updatedEmployee;
};

/* ===========================================================
    🟢 GET EMPLOYEES BY DEPARTMENT ID
=========================================================== */
const getEmployeeByDepartmentIdService = async (departmentId) => {
  const exists = await employeeRepository.departmentExists(departmentId);
  if (!exists) {
    throw new ApiError(404, "Department not found");
  }

  const employees = await employeeRepository.findEmployeesByDepartment(departmentId);
  if (!employees.length) {
    throw new ApiError(404, "No employees found in this department");
  }

  return employees;
};

/* ===========================================================
    🟢 DELETE EMPLOYEE + USER + AUTO-DELETE EMPTY DEPARTMENT
=========================================================== */
const deleteEmployeeService = async (id) => {
  const employee = await employeeRepository.findById(id);
  if (!employee) throw new ApiError(404, "Employee not found");

  // Delete both records
  await Promise.all([
    employeeRepository.deleteUser(employee.userId),
    employeeRepository.deleteEmployee(id),
  ]);

  // Auto-delete department if empty
  const remaining = await employeeRepository.findEmployeesByDepartment(employee.department);
  if (remaining.length === 0) {
    await employeeRepository.deleteDepartment(employee.department);
  }

  return { message: "Employee & user removed successfully" };
};

/* ===========================================================
    Export
=========================================================== */
export {
  addEmployeeService,
  getEmployeeService,
  getEmployeeByIdService,
  updateEmployeeService,
  getEmployeeByDepartmentIdService,
  deleteEmployeeService
};
