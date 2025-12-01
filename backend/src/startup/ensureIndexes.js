import Department from "../models/departmentModel.js";

export const ensureIndexes = async () => {
  try {
    console.log("⏳ Ensuring Department indexes...");
    await Department.createIndexes(); 
    console.log("✅ Department indexes ensured");
  } catch (err) {
    console.error("❌ Index creation failed:", err);
  }
};
