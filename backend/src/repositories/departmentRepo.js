import Department from "../models/departmentModel.js";

export const departmentRepository = {

    /* ----------------------------------------------------
 * 👤 Department METHODS
 * ---------------------------------------------------- */
    // Find department by ID with user populated
    async findByIdWithCreator(id) {
        return Department.findOne({
            _id: id,
            is_deleted: false,
        })
            .populate("created_by", "name email")
            .lean();
    },


    async findById(id) {
        return Department.findById(id);
    },
    // Pagination + Filtering
    async getDepartments(query = {}, options = {}) {
        return Department.paginate(query, options);
    },
    // fid one department by dep_name
    async findByName(dep_name) {
        return Department.findOne({ dep_name: dep_name.trim() });
    },
    // Create Department
    async create(departmentData) {
        return Department.create(departmentData);
    },
    async getNames() {
        return Department.find({ is_deleted: false })
            .select("_id dep_name")
            .sort({ dep_name: 1 })
            .lean();
    },
    // Soft delete
    async softDelete(id, userId) {
        return Department.findByIdAndUpdate(
            id,
            { is_deleted: true, updated_by: userId },
            { new: true }
        );
    },


}