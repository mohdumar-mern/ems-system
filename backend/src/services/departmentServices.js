import Department from "../models/departmentModel.js";
import Leave from "../models/leaveModel.js";
import Salary from "../models/salaryModel.js";
import { departmentRepository } from "../repositories/departmentRepo.js";
import { employeeRepository } from "../repositories/employeeRepo.js";

import ApiError from "../utils/ApiError.js";

// ➕ Add Department
export const addDepartmentService = async ({ dep_name, description, created_by }) => {
  const existing = await departmentRepository.findByName(dep_name);
  if (existing) throw new ApiError(400, "Department name already exists");

  return departmentRepository.create({ dep_name, description, created_by });
};

// 📄 Get All (Search + Paginate)
export const getDepartmentsService = async (query, options) => {
  const result = await departmentRepository.getDepartments(query, options);

  if (!result.docs.length) throw new ApiError(404, "No departments found");

  return result;
};

// 🔍 Get by ID
export const getDepartmentByIdService = async (id) => {
  const dept = await departmentRepository.findByIdWithCreator(id);
  if (!dept) throw new ApiError(404, "Department not found");
  return dept;
};

// ✏ Update
export const updateDepartmentService = async (id, { dep_name, description }) => {
  const department = await departmentRepository.findById(id);
  if (!department) throw new ApiError(404, "Department not found");

  // Name update
  if (dep_name && dep_name !== department.dep_name) {
    const exists = await departmentRepository.findByName(dep_name);
    if (exists && exists._id.toString() !== id)
      throw new ApiError(400, "Department name already exists");

    department.dep_name = dep_name;
  }

  if (description) department.description = description;

  return await department.save();
};

// 📌 Names list
export const getDepartmentsNameService = async () => {
  const list = await departmentRepository.getNames();
  if (!list.length) throw new ApiError(404, "No departments found");
  return list;
};

// 🗑 Soft Delete + Cascade
export const deleteDepartmentService = async (id, { userId }) => {
  const department = await departmentRepository.findById(id);
  if (!department) throw new ApiError(404, "Department not found");

  const employees = await employeeRepository.findEmployeesByDepartment(id);

  const empObjIds = employees.map((e) => e._id);
  const empIds = employees.map((e) => e.empId);

  await Promise.all([
    employeeRepository.deleteManyByDepartment(id),
    Leave.deleteMany({ employeeId: { $in: empObjIds } }),
    Salary.deleteMany({ employeeId: { $in: empIds } })
  ]);

  await departmentRepository.softDelete(id, userId);
};
