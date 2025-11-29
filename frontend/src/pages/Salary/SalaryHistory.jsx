import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";

import { useGetSalaryByEmpIdQuery } from "../../services/api";
import { setSalaryHistory } from "../../features/salary/salarySlice";

import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/spinner/Spinner";

import "./SalaryHistory.scss";

const SalaryHistory = () => {
  const { empId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch salary data for given empId
  const {
    data: salaryData,
    isLoading,
    isError,
    error,
  } = useGetSalaryByEmpIdQuery(empId, {
    refetchOnMountOrArgChange: true,
  });

  // Update Redux state
  useEffect(() => {
    if (salaryData?.salaries?.length) {
      dispatch(setSalaryHistory(salaryData.salaries));
    }
  }, [salaryData, dispatch]);

  const { salaries = [] } = useSelector((state) => state.salary);

  const handleAddSalary = () => navigate("/admin-dashboard/salary/add");

  return (
    <>
      <Helmet>
        <title>Salary History • Admin Panel</title>
        <meta
          name="description"
          content="View and manage employee salary records."
        />
      </Helmet>

      <section className="salary-list">
        <header className="salary-headers">
          <div className="salary-actions">
            <h1 className="salary-title">Salary History</h1>
            <Button onClick={handleAddSalary} text="+ Add Salary" />
          </div>
        </header>

        <div className="salary-content">
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <p className="error-message">
              ❌ Error loading salary records:{" "}
              {error?.data?.message || "Something went wrong."}
            </p>
          ) : salaries.length > 0 ? (
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Emp ID</th>
                    <th>Basic Salary</th>
                    <th>Allowances</th>
                    <th>Deductions</th>
                    <th>Net Salary</th>
                    <th>Pay Date</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((record, index) => (
                    <tr key={record._id}>
                      <td data-label="#">{index + 1}</td>
                      <td data-label="Emp ID">{record.empId || "-"}</td>
                      <td data-label="Basic Salary">₹{record.basicSalary || 0}</td>
                      <td data-label="Allowances">₹{record.allowances || 0}</td>
                      <td data-label="Deductions">₹{record.deductions || 0}</td>
                      <td data-label="Net Salary">₹{record.netSalary || 0}</td>
                      <td data-label="Pay Date">
                        {record.payDate
                          ? new Date(record.payDate).toLocaleDateString("en-IN")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-salary-message">No salary records found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default SalaryHistory;
