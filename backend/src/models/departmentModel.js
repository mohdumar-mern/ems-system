// src/models/departmentModel.js
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const departmentSchema = new Schema(
  {
    dep_name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      index: true, // useful for soft-delete queries
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * INDEXES
 * - partial unique index on dep_name where is_deleted=false (avoids conflicts with soft-deleted rows)
 * - case-insensitive uniqueness via collation (applies in queries/creation when using same collation)
 * - text index for search on dep_name and description
 */
departmentSchema.index(
  { dep_name: 1 },
  {
    name: "dep_name_unique_active",  // custom index name (no future conflict)
    unique: true,
    partialFilterExpression: { is_deleted: false },
  }
);


// text index for fast search; queries will use $text
departmentSchema.index(
  { dep_name: "text", description: "text" },
  { name: "department_text_search" }
);

// plugin
departmentSchema.plugin(mongoosePaginate);

/**
 * PRE-SAVE normalizations
 */
departmentSchema.pre("save", function (next) {
  if (this.dep_name) {
    this.dep_name = this.dep_name.trim();
  }
  if (this.description) {
    this.description = this.description.trim();
  }
  next();
});

/**
 * STATIC / INSTANCE HELPERS
 */
departmentSchema.statics.findActiveById = function (id) {
  return this.findOne({ _id: id, is_deleted: false }).populate("created_by", "name email").lean();
};

departmentSchema.statics.findByNameActive = function (dep_name) {
  return this.findOne({ dep_name: dep_name.trim(), is_deleted: false });
};

departmentSchema.statics.getNames = function () {
  return this.find({ is_deleted: false }).select("_id dep_name").sort({ dep_name: 1 }).lean();
};

departmentSchema.statics.softDeleteById = function (id, userId) {
  return this.findByIdAndUpdate(id, { is_deleted: true, updated_by: userId }, { new: true });
};

departmentSchema.statics.restoreById = function (id) {
  return this.findByIdAndUpdate(id, { is_deleted: false }, { new: true });
};

const Department = mongoose.model("Department", departmentSchema);

export default Department;
