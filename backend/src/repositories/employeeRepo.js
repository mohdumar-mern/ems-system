import Department from "../models/departmentModel.js";
import Employee from "../models/employeeModel.js";
import User from "../models/userModel.js";

export const employeeRepository = {
  /* ----------------------------------------------------
   * 🔍 USER METHODS
   * ---------------------------------------------------- */
  async findUserByEmail(email) {
    return User.findOne({ email });
  },

  async findUser(userId) {
    return User.findById(userId);
  },

  async createUser(data) {
    const user = new User(data);
    return user.save();
  },

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  },

  /* ----------------------------------------------------
   * 🔍 DEPARTMENT METHODS
   * ---------------------------------------------------- */
  async findDepartmentByName(name) {
    return Department.findOne({ dep_name: name });
  },

  async findDepartmentById(id) {
    return Department.findById(id);
  },

  async departmentExists(id) {
    return Department.exists({ _id: id });
  },

  async deleteDepartment(id) {
    return Department.findByIdAndDelete(id);
  },

  async findEmployeesByDepartment(id) {
    return Employee.find({ department: id }).select("emp_name empId");
  },

  /* ----------------------------------------------------
   * 👤 EMPLOYEE METHODS
   * ---------------------------------------------------- */

  // Pagination + Filtering
  async getEmployees(query = {}, options = {}) {
    return Employee.paginate(query, options);
  },

  async createEmployee(data) {
    const employee = new Employee(data);
    return employee.save();
  },

  async findById(id) {
    return Employee.findById(id);
  },

  async findByUserId(id) {
    return Employee.findOne({ userId: id });
  },

  async updateEmployee(id, updateData) {
    return Employee.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  },

  async deleteEmployee(id) {
    return Employee.findByIdAndDelete(id);
  },

  /* ----------------------------------------------------
   * 👀 POPULATED EMPLOYEE (Relations)
   * ---------------------------------------------------- */

  async findByIdWithRelations(id) {
    return Employee.findById(id)
      .populate("userId", "_id name email profile role")
      .populate("department", "_id dep_name");
  },

  async findByUserIdWithRelations(id) {
    return Employee.findOne({ userId: id })
      .populate("userId", "_id name email profile role")
      .populate("department", "_id dep_name");
  },

};
