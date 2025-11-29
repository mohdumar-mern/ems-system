// src/pages/Emp Dashboard/EmployeeLeave/EmployeeLeave.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { useGetEmployeeLeavesByEmployeeIdQuery } from "../../services/api";
import InputField from "../../components/UI/Input/InputField";
import "./EmployeeLeave.scss";
import Spinner from "../../components/UI/spinner/Spinner";

const EmployeeLeave = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: leaveHistory,
    isLoading,
    isError,
    error,
  } = useGetEmployeeLeavesByEmployeeIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  // Log error
  useEffect(() => {
    if (isError) console.error("Error fetching leave history:", error);
  }, [isError, error]);

  // Filter leaves
  const filteredLeaves = useMemo(() => {
    if (!leaveHistory?.data) return [];
    const lowerSearch = searchTerm.toLowerCase();

    return leaveHistory.data.filter((leave) => {
      const empName = leave.employeeId?.emp_name?.toLowerCase() || "";
      const empId = leave.employeeId?.empId?.toLowerCase() || "";
      const leaveType = leave.leaveType?.toLowerCase() || "";
      const status = leave.status?.toLowerCase() || "";

      return (
        empName.includes(lowerSearch) ||
        empId.includes(lowerSearch) ||
        leaveType.includes(lowerSearch) ||
        status.includes(lowerSearch)
      );
    });
  }, [leaveHistory, searchTerm]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

  return (
    <>
      <Helmet>
        <title>Leave History | Employee Panel</title>
        <meta
          name="description"
          content="Track your employee leave applications and history with status updates."
        />
        <link rel="canonical" href={`https://yourdomain.com/employee/leave/${id}`} />
      </Helmet>

      <section className="leave-list">
        <header className="leave-header">
          <h1 className="leave-title">Employee Leave History</h1>
          <div className="leave-actions">
            <InputField
              type="text"
              label="Search Leaves"
              name="search"
              placeholder="Search by name, ID, type, or status"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </header>

        <div className="leave-content">
          {isLoading && (
            <div
              className="loader-wrapper"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <Spinner />
              <span className="visually-hidden">Loading leaves...</span>
            </div>
          )}

          {isError && (
            <p className="error-text" role="alert">
              Failed to load leave history:{" "}
              {error?.data?.message || "Unexpected error occurred."}
            </p>
          )}

          {!isLoading && !isError && filteredLeaves.length > 0 && (
            <div className="table-wrapper">
              <table className="leave-table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Emp ID</th>
                    <th scope="col">Leave Type</th>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                    <th scope="col">Description</th>
                    <th scope="col">Applied On</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((leave, index) => (
                    <tr key={leave._id}>
                      <td>{index + 1}</td>
                      <td>{leave.employeeId?.empId || "-"}</td>
                      <td>{leave.leaveType || "-"}</td>
                      <td>{formatDate(leave.startDate)}</td>
                      <td>{formatDate(leave.endDate)}</td>
                      <td>{leave.description || "-"}</td>
                      <td>{formatDate(leave.createdAt)}</td>
                      <td className={`status ${leave.status}`}>
                        {leave.status === "approved" && (
                          <>
                            ✅ <span>Approved</span>
                          </>
                        )}
                        {leave.status === "pending" && (
                          <>
                            🕒 <span>Pending</span>
                          </>
                        )}
                        {leave.status === "rejected" && (
                          <>
                            ❌ <span>Rejected</span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !isError && filteredLeaves.length === 0 && (
            <p className="no-records" role="status">
              No leave records found.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default EmployeeLeave;
