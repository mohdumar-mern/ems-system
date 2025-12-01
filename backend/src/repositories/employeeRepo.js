import Department from "../models/departmentModel.js";
import Employee from "../models/employeeModel.js";
import User from "../models/userModel.js";

export const employeeRepository = {
  /* ----------------------------------------------------
   * 🔍 USER METHODS
   * ---------------------------------------------------- */
  async findUserByEmail(email) {
    return User.findOne({ email }).lean();
  },

  async findUser(userId) {
    return User.findById(userId).lean();
  },

  async createUser(data) {
    return User.create(data); // create + save in one step
  },

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  },

  /* ----------------------------------------------------
   * 🔍 DEPARTMENT METHODS
   * ---------------------------------------------------- */
  async findDepartmentByName(name) {
    return Department.findOne({ dep_name: name.trim(), is_deleted: false }).lean();
  },

  async findDepartmentById(id) {
    return Department.findById(id).lean();
  },

  async departmentExists(id) {
    return Department.exists({ _id: id, is_deleted: false });
  },

  async deleteDepartment(id) {
    return Department.findByIdAndDelete(id);
  },

  async findEmployeesByDepartment(id) {
    return Employee.find({ department: id, is_deleted: false })
      .select("emp_name empId")
      .lean();
  },

  async deleteManyByDepartment(deptId) {
    return Employee.deleteMany({ department: deptId });
  },

  /* ----------------------------------------------------
   * 👤 EMPLOYEE METHODS
   * ---------------------------------------------------- */
  async getEmployees(query = {}, options = {}) {
    query.is_deleted = false; // only active employees
    return Employee.paginate(query, {
      ...options,
      lean: true,
      sort: options.sort || { createdAt: -1 },
      populate: [
        { path: "userId", select: "_id name email profile role" },
        { path: "department", select: "_id dep_name" },
      { path: "created_by", select: "_id name email" },

      ],
    });
  },

  async createEmployee(data) {
    return Employee.create(data); // automatically trims via pre-save
  },

  async findById(id) {
    return Employee.findActiveById(id); // uses static helper
  },

  async findByUserId(userId) {
    return Employee.findOne({ userId, is_deleted: false }).lean();
  },

  async updateEmployee(id, updateData) {
    return Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  },

  async deleteEmployee(id) {
    return Employee.findByIdAndDelete(id);
  },

  /* ----------------------------------------------------
   * 👀 POPULATED EMPLOYEE (Relations)
   * ---------------------------------------------------- */
  async findByIdWithRelations(id) {
    return Employee.findActiveById(id); // already populates user & department
  },

  async findByUserIdWithRelations(userId) {
    return Employee.findOne({ userId, is_deleted: false })
      .populate("userId", "_id name email profile role")
      .populate("department", "_id dep_name")
      .lean();
  },
};
