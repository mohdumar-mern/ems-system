import Department from "../models/departmentModel.js";
import Employee from "../models/employeeModel.js";
import Leave from "../models/leaveModel.js";

const getSummary = async () => {
     const [totalEmployees, totalDepartments] = await Promise.all([
      Employee.countDocuments(),
      Department.countDocuments(),
    ]);

    const totalSalaryResult = await Employee.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$salary" } },
        },
      },
    ]);
    const totalSalary = totalSalaryResult[0]?.total || 0;

    const [employeeAppliedForLeave, leaveStatus] = await Promise.all([
      Leave.distinct("employeeId"),
      Leave.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

      const leaveSummary = {
      appliedFor: employeeAppliedForLeave.length,
      approved: leaveStatus.find(item => item._id === "approved")?.count || 0,
      rejected: leaveStatus.find(item => item._id === "rejected")?.count || 0,
      pending: leaveStatus.find(item => item._id === "pending")?.count || 0,
    };
    return {
      totalEmployees,
      totalDepartments,
      totalSalary,
      leaveSummary,
    };
}

const getEmpSummary = async (employeeId) => {
      const employee = await Employee.findOne({ userId: id });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const [employeeLeaves, leaveStatus] = await Promise.all([
      Leave.find({ employeeId: employee._id }),
      Leave.aggregate([
        { $match: { employeeId: employee._id } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const leaveSummary = {
      appliedFor: employeeLeaves.length,
      approved: leaveStatus.find(item => item._id === "approved")?.count || 0,
      rejected: leaveStatus.find(item => item._id === "rejected")?.count || 0,
      pending: leaveStatus.find(item => item._id === "pending")?.count || 0,
    };
    return { leaveSummary };
}
export { 
    getSummary,
    getEmpSummary
};