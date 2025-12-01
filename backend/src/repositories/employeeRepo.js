import Department from "../models/departmentModel.js";
import Employee from "../models/employeeModel.js";
import User from "../models/userModel.js";

export const employeeRepository = {
  //  Pagination + Filtering
  async getEmployees(query = {}, options = {}) {
    return Employee.paginate(query, options);
  },
    async findUserByEmail(email) {
    return User.findOne({ email });
  },

  async findDepartmentByName(name) {
    return Department.findOne({ dep_name: name });
  },

  async createUser(data) {
    const user = new User(data);
    return user.save();
  },

  async createEmployee(data) {
    const employee = new Employee(data);
    return employee.save();
  },

    // Employee by ID
  async findById(id) {
    return Employee.findById(id);
  },

  // Employee as userId
  async findByUserId(id) {
    return Employee.findOne({ userId: id });
  },

  // User by id
  async findUser(userId) {
    return User.findById(userId);
  },

    // Find department by name
  async findDepartmentByName(name) {
    return Department.findOne({ dep_name: name });
  },

  // Update employee data only
  async updateEmployee(id, updateData) {
    return Employee.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  },
  // Delete employee for employee
  async deleteEmployee(id) {
    return Employee.findByIdAndDelete(id);
  },
// Delete user
  async deleteUser(userId) {
    return User.findByIdAndDelete(userId);
  },
// Find employees by department
  async findEmployeesByDepartment(deptId) {
    return Employee.find({ department: deptId });
  },
  // Find department by id
  async findDepartmentById(id) {
    return Department.findById(id);
  },

  
  // Find department exists
  async departmentExists(id) {
    return Department.exists({ _id: id });
  },
  // Find employees of department
  async findEmployeesByDepartment(deptId) {
    return Employee.find({ department: deptId }).select("emp_name empId");
  },
// Delete department
  async deleteDepartment(id) {
    return Department.findByIdAndDelete(id);
  },

  // 🔍 Find by _id with relations
  async findByIdWithRelations(id) {
    return Employee.findById(id)
      .populate("userId", "_id name email email profile role")
      .populate("department", "_id dep_name");
  },

  // 🔍 Find by userId with relations
  async findByUserId(id) {
    return Employee.findOne({ userId: id })
      .populate("userId", "_id name email profile role")
      .populate("department", "_id dep_name");
  }
};
