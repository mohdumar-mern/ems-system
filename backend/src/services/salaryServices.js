import Employee from "../models/employeeModel.js";
import Salary from "../models/salaryModel.js";

const addSalary = async ({
    employeeId,
    basicSalary,
    allowances,
    deductions,
    payDate, }) => {

    const employee = await Employee.findById(employeeId);
    if (!employee) {
        return res.status(404).json({
            success: false,
            message: "Employee not found",
        });
    }
    const parsedBasic = Number(basicSalary) || 0;
    const parsedAllowances = Number(allowances) || 0;
    const parsedDeductions = Number(deductions) || 0;

    const totalSalary = parsedBasic + parsedAllowances - parsedDeductions;

    const salary = new Salary({
        employeeId,
        basicSalary: parsedBasic,
        allowances: parsedAllowances,
        deductions: parsedDeductions,
        netSalary: totalSalary,
        payDate: payDate || new Date(),
    });

    const savedSalary = await salary.save();
    return savedSalary;
}

const getSalary = async (page, limit, search) => {
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true,
        populate: {
            path: "employeeId",
            select: "emp_name empId designation department",
            populate: { path: "department", select: "dep_name" },
        },
        sort: { payDate: -1 },
    };

    let query = {};

    if (search) {
        const employees = await Employee.find({
            emp_name: { $regex: search, $options: "i" },
        }).select("_id");

        const empIds = employees.map(emp => emp._id);
        query = { employeeId: { $in: empIds } };
    }

    const salaries = await Salary.paginate(query, options);

    if (!salaries || salaries.data.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No salaries found",
        });
    }

    return salaries;

}

const getSalaryByEmpId = async (empId) => {

     let employee = await Employee.findById(empId);
    
      // If not found by Employee ID, try userId
      if (!employee && empId.match(/^[0-9a-fA-F]{24}$/)) {
        employee = await Employee.findOne({ userId: empId });
      }
    
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
  const salaries = await Salary.find({ employeeId: employee._id })
    .sort({ payDate: -1 })
    .populate({
      path: "employeeId",
      select: "emp_name empId designation department",
      populate: { path: "department", select: "dep_name" },
    });

  if (!salaries.length) {
    return res.status(404).json({
      success: false,
      message: "No salaries found for this employee",
    });
  }
    return salaries;
}

export {
    addSalary,
    getSalary,
    getSalaryByEmpId
}