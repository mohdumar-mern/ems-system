import mongoose from "mongoose";
import Department from "../models/departmentModel.js";

const { isValidObjectId } = mongoose;

export const departmentRepository = {
  // 🔍 Find by ID (with creator)
  async findByIdWithCreator(id) {
    if (!isValidObjectId(id)) return null;

    return Department.findOne({ _id: id, is_deleted: false })
      .populate("created_by", "_id name email")
      .lean();
  },

  // 🔍 Find by ID (editable document)
  async findById(id) {
    if (!isValidObjectId(id)) return null;
    return Department.findOne({ _id: id, is_deleted: false });
  },

  // 📄 Paginated List
  async getDepartments(query, options) {
    return Department.paginate(query, {
      ...options,
      populate: {
        path: "created_by",
        select: "_id name email",
      }
    });
  },

  // 🔎 Find by name (trim done by model)
  async findByName(dep_name) {
    return Department.findOne({
      dep_name,
      is_deleted: false
    }).lean();
  },

  // ➕ Create
  async create(data) {
    return Department.create(data);
  },

  // 📌 Simple Name List
  async getNames() {
    return Department.find({ is_deleted: false })
      .select("_id dep_name")
      .lean();
  },

  // 🗑 Soft Delete
  async softDelete(id, userId) {
    return Department.findByIdAndUpdate(
      id,
      { is_deleted: true, updated_by: userId },
      { new: true }
    );
  }
};
