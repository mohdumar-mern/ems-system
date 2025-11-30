import expressAsyncHandler from "express-async-handler";

import { getEmpSummary, getSummary } from "../services/summaryServices.js";

// 📊 Admin Dashboard: Full Summary
export const getSummaryController = expressAsyncHandler(async (req, res) => {
  try {
    const { totalEmployees, totalDepartments, totalSalary, leaveSummary } = await getSummary();
    res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalary,
      leaveSummary,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// 📊 Employee Dashboard: Personal Summary
export const getEmpSummaryController = expressAsyncHandler(async (req, res) => {
  try {
    const {leaveSummary} = await getEmpSummary(req.params.id);
    res.status(200).json({
      success: true,
      leaveSummary,
    });
  } catch (error) {
    console.error("Employee summary error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
