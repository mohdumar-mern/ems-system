// src/pages/AddEmployee/AddEmployee.jsx

import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import {
  useAddEmployeeMutation,
  useGetDepartmentsNameQuery
} from "../../services/api";

import "./AddEmployee.scss";
import SelectField from "../../components/UI/SelectField/SelectField";

const AddEmployee = () => {
  const navigate = useNavigate();

  // Fetch departments list
  const {
    data: departmentsData,
    isLoading: isDepsLoading,
    error: depsError,
  } =   useGetDepartmentsNameQuery();

  // Mutation hook
  const [addEmployee, { isLoading: isSubmitting }] = useAddEmployeeMutation();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    designation: "",
    department: "",
    salary: "",
    role: "",
    profile: null,
  });

  const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
  ];
  const designationOptions = [
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "tester", label: "Tester" },
    { value: "manager", label: "Manager" },
    { value: "hr", label: "HR" },
    { value: "other", label: "Other" },
  ];
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];
  const roleOptions = [
    { value: "admin", label: "Admin" },
    // { value: "manager", label: "Manager" },
    { value: "employee", label: "Employee" },
  ];
  const departmentOptions = departmentsData
    ? departmentsData.departments.map((d) => ({
        value: d.dep_name,
        label: d.dep_name,
      }))
    : [];

  // Handle inputs (text/select/date) and file separately
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile") {
      setFormData((prev) => ({ ...prev, profile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // build FormData
    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null && val !== "") {
        payload.append(key, val);
      }
    });

    try {
      console.log(formData)
      await addEmployee(payload).unwrap();
      toast.success("Employee added successfully!");
      navigate(-1); // go back to list
    } catch (err) {
      console.error(err.data.error);
      toast.error(err.data.error);
    }
  };

  if (isDepsLoading) return <p>Loading departments…</p>;
  if (depsError) return <p>Failed to load departments.</p>;

  return (
    <main className="add-employee-page">
      <Helmet>
        <title>Add Employee | Admin Panel</title>
        <meta
          name="description"
          content="Form to add a new employee via the admin panel."
        />
      </Helmet>

      <section className="card">
        <h2 className="card__title">Add Employee</h2>

        <form className="form" onSubmit={handleSubmit}>
          <InputField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <InputField
            label="Date of Birth"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />

          <div className="form__grid">
            <SelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Select Gender"
              required
              options={genderOptions}
            />

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
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
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

          <InputField
            label="Upload Profile"
            required={false}
            id="profile"
            name="profile"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
       

          <Button
            type="submit"
            className="btn--block"
            text={isSubmitting ? "Submitting…" : "Add Employee"}
            disabled={isSubmitting}
          />
        </form>
      </section>
    </main>
  );
};

export default AddEmployee;
