import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

/**
 * Employee Schema
 * Represents individual employees with links to Department & User
 */
const employeeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // frequently queried for user-employees
    },
    emp_name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    empId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
      index: true, // often queried
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ["married", "single", "divorced", "widowed"],
      required: true,
    },
    designation: {
      type: String,
      enum: ["manager", "developer", "designer", "tester", "hr", "other"],
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true, // often used in filters and joins
    },
    salary: {
      type: Number,
      required: true,
      min: [0, "Salary must be positive"],
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      index: true, // for soft deletes
    },
  },
  {
    timestamps: true, // auto-manage createdAt and updatedAt
    versionKey: false,
  }
);

/* ---------------------------------------------------
 * Plugins
 * --------------------------------------------------- */
employeeSchema.plugin(mongoosePaginate);

/* ---------------------------------------------------
 * Pre-save normalization
 * --------------------------------------------------- */
employeeSchema.pre("save", function (next) {
  if (this.emp_name) this.emp_name = this.emp_name.trim();
  if (this.empId) this.empId = this.empId.trim();
  next();
});

/* ---------------------------------------------------
 * Indexes
 * --------------------------------------------------- */
// Compound index to avoid duplicate empId in same department
employeeSchema.index({ empId: 1, department: 1 }, { unique: true, name: "empId_department_unique" });

// Text index for search
employeeSchema.index({ emp_name: "text", designation: "text" }, { default_language: "english", name: "employee_text_search" });

/* ---------------------------------------------------
 * Statics / Helpers
 * --------------------------------------------------- */
employeeSchema.statics.findActiveById = function (id) {
  return this.findOne({ _id: id, is_deleted: false })
    .populate("userId", "name email")
    .populate("department", "dep_name")
    .lean();
};

employeeSchema.statics.findByEmpId = function (empId) {
  return this.findOne({ empId: empId.trim(), is_deleted: false }).lean();
};

employeeSchema.statics.softDeleteById = function (id, userId) {
  return this.findByIdAndUpdate(
    id,
    { is_deleted: true, updated_by: userId },
    { new: true }
  );
};

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
