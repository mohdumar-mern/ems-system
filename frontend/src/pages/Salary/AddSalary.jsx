import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

import {
  useGetEmployeeByDepartmentQuery,
  useAddSalaryMutation,
  useGetDepartmentsNameQuery,
} from "../../services/api";

import SelectField from "../../components/UI/SelectField/SelectField";
import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";

import "./AddSalary.scss";

const AddSalary = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    department: "",
    empId: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    payDate: "",
  });

  // Fetch departments
  const {
    data: departmentsData,
    isLoading: isDepsLoading,
    error: depsError,
  } = useGetDepartmentsNameQuery();

  // Fetch employees based on selected department
  const {
    data: employeesData,
    isFetching: isEmpFetching,
    refetch,
  } = useGetEmployeeByDepartmentQuery(formData.department, {
    skip: !formData.department,
    refetchOnMountOrArgChange: true,
  });

  // Add salary mutation
  const [addSalary, { isLoading: isAddingSalary }] = useAddSalaryMutation();

  // Create select options
  const departmentOptions =
    departmentsData?.departments?.map((d) => ({
      value: d._id,
      label: d.dep_name,
    })) || [];

  const employeeOptions =
    employeesData?.employees?.map((emp) => ({
      value: emp.empId,
      label: `${emp.emp_name} (${emp.empId})`,
    })) || [];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" ? { empId: "" } : {}),
    }));
  };

  // Refetch employees when department changes
  useEffect(() => {
    if (formData.department) refetch();
  }, [formData.department, refetch]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSalary(formData).unwrap();
      toast.success("Salary added successfully!");
      navigate(`/admin-dashboard/salary/${formData.empId}/history`);

      // Reset form
      setFormData({
        department: "",
        empId: "",
        basicSalary: "",
        allowances: "",
        deductions: "",
        payDate: "",
      });
    } catch (err) {
      console.error("Salary submission failed:", err);
      toast.error(err?.data?.message || "Failed to add salary.");
    }
  };

  if (isDepsLoading) return <p>Loading departments…</p>;
  if (depsError) return <p>Failed to load departments.</p>;

  return (
    <main className="addSalaryPage">
      <Helmet>
        <title>Add Salary | Admin Panel</title>
        <meta name="description" content="Form to add salary to employee." />
      </Helmet>

      <section className="card">
        <h2 className="cardTitle">Add Salary</h2>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="formGrid">
            <SelectField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Select Department"
              required
              options={departmentOptions}
            />

            <SelectField
              label="Employee"
              name="empId"
              value={formData.empId}
              onChange={handleChange}
              placeholder={isEmpFetching ? "Loading Employees…" : "Select Employee"}
              required
              options={employeeOptions}
              disabled={!formData.department || isEmpFetching}
            />
          </div>

          <InputField
            label="Basic Salary"
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            required
          />

          <InputField
            label="Allowances"
            type="number"
            name="allowances"
            value={formData.allowances}
            onChange={handleChange}
            required
          />

          <InputField
            label="Deductions"
            type="number"
            name="deductions"
            value={formData.deductions}
            onChange={handleChange}
            required
          />

          <InputField
            label="Pay Date"
            type="date"
            name="payDate"
            value={formData.payDate}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            className="btn--block"
            text={isAddingSalary ? "Adding Salary..." : "Add Salary"}
            disabled={isAddingSalary}
          />
        </form>
      </section>
    </main>
  );
};

export default AddSalary;
