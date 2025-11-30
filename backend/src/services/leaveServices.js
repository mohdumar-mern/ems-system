import mongoose from "mongoose";
import Employee from "../models/employeeModel.js";
import Leave from "../models/leaveModel.js";

// Add new leave request
const addLeave = async ({ leaveType, startDate, endDate, description, userId }) => {
    // Validate input fields
    if (!leaveType || !startDate || !endDate || !description) {
        return res.status(400).json({ success: false, error: "All fields are required" });
    }
    // Find employee for leaving
    const employee = await Employee.findOne({ userId });
    if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found" });
    }
    // check date validity
    if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ success: false, error: "Invalid date range" });
    }
    const overlappingLeave = await Leave.findOne({
        employeeId: employee._id,
        is_deleted: false,
        $or: [
            { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
        ],
    });

    if (overlappingLeave) {
        return res.status(409).json({ success: false, error: "Overlapping leave already exists" });
    }

    const newLeave = new Leave({
        employeeId: employee._id,
        leaveType,
        startDate,
        endDate,
        description,
    });

    await newLeave.save();
    return newLeave;


}

// Get all leaves for a specific userId
const getEmployeeLeaves = async (userId) => {

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Invalid user ID" });
    }
    // Find employee for leaving
    const employee = await Employee.findOne({ userId: id });
    if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const leaves = await Leave.find({
        employeeId: employee._id,
        is_deleted: false,
    }).populate({
        path: "employeeId",
        select: "emp_name empId designation department",
        populate: { path: "department", select: "dep_name" },
    });
    return leaves;
}

const getSingleLeaveById = async (id) => {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid leave ID" });
    }
    const leave = await Leave.findById(id).populate({
        path: "employeeId",
        select: "emp_name userId empId designation department",
        populate: [
            { path: "userId", select: "profile email" },
            { path: "department", select: "dep_name" },
        ],
    });

    if (!leave || leave.is_deleted) {
        return res.status(404).json({ success: false, message: "Leave not found" });
    }
    return leave;
}

const getEmployeeLeavesByEmpId = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid employee ID" });
    }
    const leaves = await Leave.find({
        employeeId: id,
        is_deleted: false,
    }).populate({
        path: "employeeId",
        select: "emp_name empId designation department",
        populate: { path: "department", select: "dep_name" },
    });

    if (!leaves.length) {
        return res.status(404).json({ success: false, message: "No leaves found" });
    }
    return leaves;

}

const updateLeaveStatus = async (id, status, approvedBy) => {
 if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid leave ID" });
  }
  
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }
   const updatedLeave = await Leave.findByIdAndUpdate(
    id,
    { status, approved_by: approvedBy },
    { new: true }
  );

  if (!updatedLeave || updatedLeave.is_deleted) {
    return res.status(404).json({ success: false, message: "Leave not found" });
  }
}

const getEmployeesLeavesAdmin = async (page, limit, search) => {

     const query = { is_deleted: false };
      if (search) {
        query.$or = [
          { leaveType: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        lean: true,
        populate: {
          path: "employeeId",
          select: "emp_name empId designation department",
          populate: { path: "department", select: "dep_name" },
        },
      };
    
      const leaves = await Leave.paginate(query, options);
      if (!leaves) {
        return res.status(404).json({ success: false, message: "No leaves found" });
      }
      return leaves;
}

export {
    addLeave,
    getEmployeeLeaves,
    getSingleLeaveById,
    getEmployeeLeavesByEmpId,
    updateLeaveStatus,
    getEmployeesLeavesAdmin
}