import Department from "../models/departmentModel.js";
import Employee from "../models/employeeModel.js";
import Leave from "../models/leaveModel.js";
import Salary from "../models/salaryModel.js";

const addDepartment = async ({ dep_name, description, created_by }) => {
    const existing = await Department.findOne({ dep_name: dep_name.trim() });
    if (existing) {
        throw new Error("Department name already exists");
    }
    if(!dep_name || !description){
        throw new Error("All fields are required");
    }
    const department = await Department.create({ dep_name, description, created_by });
    return department;
}

const getDepartments = async ({page, limit, search, regex}) =>{

     const query = {
    is_deleted: false,
    ...(search && {
      $or: [{ dep_name: regex }, { description: regex }],
    }),
  };

  const options = {
    page: +page,
    limit: +limit,
    lean: true,
    sort: { createdAt: -1 },
    populate: {
      path: "created_by",
      select: "name email",
    },
  };
    const result = await Department.paginate(query, options);
    
  if (!result?.data?.length) {
    return res.status(404).json({
      success: false,
      message: "No departments found",
    });
  }
    return result;
    
}

// Get departments by Id
const getDepartmentById = async (id) => {
    const department = await Department.findOne({
        _id: id,
        is_deleted: false,
    })
    .populate("created_by", "name email")
    .lean();
    if (!department) {
        throw new Error("Department not found");
    }
    return department;
}

const updateDepartment = async (id, { dep_name, description }) => {
    const department = await Department.findById(id);

    if (!department || department.is_deleted) {
        throw new Error("Department not found");
    }
    if (dep_name?.trim() && dep_name.trim() !== department.dep_name) {
        const duplicate = await Department.findOne({ dep_name: dep_name.trim() });
        if (duplicate) {
            throw new Error("Department name already exists");
        }
        department.dep_name = dep_name.trim();
    }
    if (description?.trim()) {
        department.description = description.trim();
    }
    const updated = await department.save();
    return updated;
}

const getDepartmentsName = async () =>{
    
  const departments = await Department.find({ is_deleted: false })
    .select("_id dep_name")
    .sort({ dep_name: 1 })
    .lean();

  if (!departments?.length) {
    return res.status(404).json({
      success: false,
      message: "No departments found",
    });
  }
    return departments;
}
// Soft Delete Department and Related Data
const deleteDepartment = async (id,{userId}) => {
    const department = await Department.findById(id);
    if (!department || department.is_deleted) {
        throw new Error("Department not found");
    }

  const employees = await Employee.find({ department: department._id }).lean();
    const empObjectIds = employees.map((emp) => emp._id);
    const empIds = employees.map((emp) => emp.empId);

    await Promise.all([
        Employee.deleteMany({ department: department._id }),
        Leave.deleteMany({ employeeId: { $in: empObjectIds } }),
        Salary.deleteMany({ employeeId: { $in: empIds } }),
    ]);

    department.is_deleted = true;
    department.updated_by = userId;
    await department.save();
    return;
}

export { 
    addDepartment, 
    getDepartments, 
    getDepartmentById, 
    updateDepartment, 
    getDepartmentsName, 
    deleteDepartment 
};