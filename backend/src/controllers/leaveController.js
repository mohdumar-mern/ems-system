import expressAsyncHandler from "express-async-handler";

import { 
  addLeave, 
  getEmployeeLeaves, 
  getEmployeeLeavesByEmpId, 
  getEmployeesLeavesAdmin, 
  getSingleLeaveById, 
  updateLeaveStatus 
} from "../services/leaveServices.js";

// ✅ Add new leave request (Employee)
export const addLeaveController = expressAsyncHandler(async (req, res) => {
  const { leaveType, startDate, endDate, description } = req.body;
  const userId = req.user._id;
  // Call service to add leave
  const newLeave = await addLeave({ leaveType, startDate, endDate, description, userId });
  // Return response
  res.status(201).json({ success: true, data: newLeave });
});

// ✅ Get all leaves for a specific userId (Employee view)
export const getEmployeeLeavesController = expressAsyncHandler(async (req, res) => {
  // call service to get employee leaves 
  const leaves = await getEmployeeLeaves(req.params.id)
  // Return response
  res.status(200).json({ success: true, data: leaves });
});

// ✅ Admin: Get all leave requests with pagination + optional search
export const getEmployeesLeavesAdminController = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 6, search = "" } = req.query;

  const leaves = await getEmployeesLeavesAdmin(page, limit, search);
  res.status(200).json({
    success: true,
    from: "db",
    data: leaves.data,
    totalDocs: leaves.totalDocs,
    limit: leaves.limit,
    totalPages: leaves.totalPages,
    currentPage: leaves.page,
    pagingCounter: leaves.pagingCounter,
    hasPrevPage: leaves.hasPrevPage,
    hasNextPage: leaves.hasNextPage,
    prevPage: leaves.prevPage,
    nextPage: leaves.nextPage,
  });
});

// ✅ Admin: Get single leave by ID
export const getSingleLeaveByIdController = expressAsyncHandler(async (req, res) => {
  const leave = await getSingleLeaveById(req.params.id)
  // Return response
  res.status(200).json({ success: true, data: leave });
});

// ✅ Admin: Approve or Reject Leave
export const updateLeaveStatusController = expressAsyncHandler(async (req, res) => {

  const updatedLeave = await updateLeaveStatus(req.params.id, req.body.status, req.user._id);


  res.status(200).json({
    success: true,
    message: `Leave ${status}`,
    data: updatedLeave,
  });
});

// ✅ Admin/HR: Get leaves by employeeId
export const getEmployeeLeavesByEmpIdController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const leaves = await getEmployeeLeavesByEmpId(id);
  res.status(200).json({ success: true, data: leaves });
});
