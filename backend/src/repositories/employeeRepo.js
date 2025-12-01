import Employee from "../models/employeeModel.js";

const getEmployees = async (query = {}, options = {}) => {
  return Employee.paginate(query, options);
};

export  {
  getEmployees,
};
