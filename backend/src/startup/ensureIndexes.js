import Department from "../models/departmentModel.js";
import Employee from "../models/employeeModel.js";

export const ensureIndexes = async () => {
  try {
    console.log("⏳ Ensuring Department indexes...");
    await Department.createIndexes(); 
    await Employee.createIndexes(); 
    console.log("✅ Department indexes ensured");
  } catch (err) {
    console.error("❌ Index creation failed:", err);
  }
};
