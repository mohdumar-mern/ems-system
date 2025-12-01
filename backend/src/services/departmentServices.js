import Department from "../models/departmentModel.js";
import Employee from "../models/employeeModel.js";
import Leave from "../models/leaveModel.js";
import Salary from "../models/salaryModel.js";
import { departmentRepository } from "../repositories/departmentRepo.js";
import { employeeRepository } from "../repositories/employeeRepo.js";
import ApiError from "../utils/ApiError.js";

const addDepartmentService = async ({ dep_name, description, created_by }) => {
  if (!dep_name?.trim() || !description?.trim()) {
    throw new ApiError(400, "Department name and description are required");
  }

  // Check duplicate name (only non-deleted departments)
  const existing = await departmentRepository.findByName(dep_name);
  if (existing && !existing.is_deleted) {
    throw new ApiError(400, "Department name already exists");
  }

  const department = await departmentRepository.create({
    dep_name: dep_name.trim(),
    description: description.trim(),
    created_by,
  });

  return department;
};

const getDepartmentsService = async (query, options) => {
  const result = await departmentRepository.getDepartments(query, options);

  // If absolutely no departments exist in DB
  if (!result || !result.data || result.data.length === 0) {
    throw new ApiError(404, "No departments found");
  }

  return result;
};

// Get departments by Id
const getDepartmentByIdService = async (id) => {
  const department = await departmentRepository.findByIdWithCreator(id);

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  return department;
};

const updateDepartmentService = async (id, { dep_name, description }) => {
    const department = await departmentRepository.findById(id);

    if (!department || department.is_deleted) {
        throw new ApiError(404, "Department not found");
    }
    if (dep_name?.trim() && dep_name.trim() !== department.dep_name) {
        const duplicate = await departmentRepository.findByName(dep_name);
        if (duplicate) {
            throw new ApiError(400, "Department name already exists");
        }
        department.dep_name = dep_name.trim();
    }
    if (description?.trim()) {
        department.description = description.trim();
    }
    const updated = await department.save();
    return updated;
}

const getDepartmentsNameService = async () => {
  const departments = await departmentRepository.getNames();

  if (!departments.length) {
    throw new ApiError(404, "No departments found");
  }

  return departments;
};

// Soft Delete Department and Related Data
const deleteDepartmentService = async (id,{userId}) => {
    const department = await departmentRepository.findById(id);
    if (!department || department.is_deleted) {
        throw new ApiError(404, "Department not found");
    }

  const employees = await employeeRepository.findEmployeesByDepartment(department._id);
    const empObjectIds = employees.map((emp) => emp._id);
    const empIds = employees.map((emp) => emp.empId);

    await Promise.all([
        employeeRepository.deleteManyByDepartment(id),
        Leave.deleteMany({ employeeId: { $in: empObjectIds } }),
        Salary.deleteMany({ employeeId: { $in: empIds } }),
    ]);

    await departmentRepository.softDelete(id, userId);
    return;
}

export { 
    addDepartmentService, 
    getDepartmentsService, 
    getDepartmentByIdService, 
    updateDepartmentService, 
    getDepartmentsNameService, 
    deleteDepartmentService 
};