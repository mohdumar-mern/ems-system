import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";

import { useGetEmployeeByIdQuery } from "../../services/api";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/spinner/Spinner";

import "./EmployeeDetail.scss";

const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

const formatDateTime = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetEmployeeByIdQuery(id);
  const employee = useMemo(() => data?.employee, [data]);

  if (isLoading)
    return (
      <div className="loader-wrapper" role="status" aria-live="polite" aria-busy="true">
        <Spinner />
        <span className="visually-hidden">Loading Employee...</span>
      </div>
    );

  if (error) return <p className="error-text">❌ Error loading employee details.</p>;
  if (!employee) return <p className="no-records">No employee record found.</p>;

  return (
    <>
      <Helmet>
        <title>{employee.emp_name} • Employee Details | Admin Panel</title>
        <meta
          name="description"
          content={`Detailed information for employee ${employee.emp_name}, including ID, DOB, salary, department, and more.`}
        />
      </Helmet>

      <div className="employee-detail">
        <div className="employee-header">
          <h1>{employee.emp_name}</h1>
          <h3>{employee.userId?.email || "No email available"}</h3>
        </div>

        <div className="employee-profile">
          <img
            src={employee.userId?.profile?.url }
            alt={employee.emp_name || "Employee profile"}
            className="employee-image"
            loading="lazy"
          />
        </div>
        <div className="employee-info">
          <p><strong>Emp Name:</strong> {employee.emp_name || "Unknown"}</p>
          <p><strong>Emp ID:</strong> {employee.empId || "Unknown"}</p>
          <p><strong>Date of Birth:</strong> {formatDate(employee.dob)}</p>
          <p><strong>Gender:</strong> {employee.gender || "Unknown"}</p>
          <p><strong>Marital Status:</strong> {employee.maritalStatus || "Unknown"}</p>
          <p><strong>Designation:</strong> {employee.designation || "Unknown"}</p>
          <p><strong>Salary:</strong> ₹{employee.salary || "Unknown"}</p>
          <p><strong>Role:</strong> {employee.userId?.role || "Unknown"}</p>
          <p><strong>Department:</strong> {employee.department?.dep_name || "Unknown"}</p>
          <p><strong>Created At:</strong> {formatDateTime(employee.createdAt)}</p>
        </div>

        <div className="employee-actions">
          <Button
            onClick={() => navigate(-1)}
            text="Back to Employees"
            Icon={ChevronLeft}
          />
        </div>
      </div>
    </>
  );
};

export default EmployeeDetail;
