
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import SelectField from "../../components/UI/SelectField/SelectField";
import Spinner from "../../components/UI/spinner/Spinner";

import {
  useGetDepartmentsQuery,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeByIdMutation,
} from "../../services/api";

import "./AddEmployee.scss";

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: departmentsData } = useGetDepartmentsQuery();
  const {
    data: employeeData,
    isLoading: isEmployeeLoading,
    error: employeeError,
  } = useGetEmployeeByIdQuery(id);

  const [updateEmployee, { isLoading: isSubmitting }] =
    useUpdateEmployeeByIdMutation();

  const [formData, setFormData] = useState({
    name: "",
    maritalStatus: "",
    designation: "",
    department: "",
    salary: "",
    role: "",
  });

  useEffect(() => {
    if (employeeData?.employee) {
      const {
        emp_name,
        maritalStatus,
        designation,
        department,
        salary,
        userId,
      } = employeeData.employee;

      setFormData({
        name: emp_name || "",
        maritalStatus: maritalStatus || "",
        designation: designation || "",
        department: department?.dep_name || "",
        salary: salary || "",
        role: userId?.role || "",
      });
    }
  }, [employeeData]);

  // Memoized Options to prevent re-renders
  const maritalStatusOptions = useMemo(
    () => [
      { value: "single", label: "Single" },
      { value: "married", label: "Married" },
      { value: "divorced", label: "Divorced" },
      { value: "widowed", label: "Widowed" },
    ],
    []
  );

  const designationOptions = useMemo(
    () => [
      { value: "developer", label: "Developer" },
      { value: "designer", label: "Designer" },
      { value: "tester", label: "Tester" },
      { value: "manager", label: "Manager" },
      { value: "hr", label: "HR" },
      { value: "other", label: "Other" },
    ],
    []
  );

  const roleOptions = useMemo(
    () => [
      { value: "admin", label: "Admin" },
      { value: "manager", label: "Manager" },
      { value: "employee", label: "Employee" },
    ],
    []
  );

  const departmentOptions = useMemo(() => {
    return departmentsData?.departments?.map((d) => ({
      value: d.dep_name,
      label: d.dep_name,
    })) || [];
  }, [departmentsData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee({ id, payload: formData }).unwrap();
      toast.success("Employee updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.error || "Update failed");
    }
  };

  if (isEmployeeLoading) {
    return (
      <div className="loader-wrapper" role="status" aria-busy="true">
        <Spinner />
        <span className="visually-hidden">Loading Employee...</span>
      </div>
    );
  }

  if (employeeError) return <p role="alert">Failed to load employee data.</p>;

  return (
    <main className="add-employee-page">
      <Helmet>
        <title>Update Employee | Admin Panel</title>
        <meta
          name="description"
          content="Admin Panel: Update existing employee details such as department, role, and designation."
        />
      </Helmet>

      <section className="card">
        <h2 className="card__title">Update Employee</h2>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <InputField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="form__grid">
            <SelectField
              label="Marital Status"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              placeholder="Select Marital Status"
              required
              options={maritalStatusOptions}
            />

            <SelectField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Select Designation"
              required
              options={designationOptions}
            />

            <SelectField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Select Department"
              required
              options={departmentOptions}
            />
          </div>

          <InputField
            label="Salary"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            required
          />

          <SelectField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Select Role"
            required
            options={roleOptions}
          />

          <Button
            type="submit"
            className="btn--block"
            text={isSubmitting ? "Updating…" : "Update Employee"}
            disabled={isSubmitting}
          />
        </form>
      </section>
    </main>
  );
};

export default UpdateEmployee;
