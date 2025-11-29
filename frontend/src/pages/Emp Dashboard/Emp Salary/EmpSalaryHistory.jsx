import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";

import { useGetSalaryByEmpIdQuery } from "../../../services/api";
import {  setSalaryHistory } from "../../../features/salary/salarySlice";

import "./SalaryHistory.scss";
import Button from "../../../components/UI/Button/Button";

const EmpSalaryHistory = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    data: salaryData,
    isLoading,
    isError,
    error,
  } = useGetSalaryByEmpIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });


  useEffect(() => {
    if (salaryData?.salaries?.length) {
      dispatch(setSalaryHistory(salaryData.salaries));
    }
  }, [salaryData, dispatch]);
  const { salaries = [] } = useSelector((state) => state.salary);



  return (
    <>
      <Helmet>
        <title>Salary History • Admin Panel</title>
        <meta name="description" content="View and manage salary history." />
      </Helmet>

      <section className="salary-list">
        <header className="salary-header">
          <h1 className="salary-title">Salary History</h1>
        </header>

        <div className="salary-content">
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error: {error?.data?.message || "Unknown error"}</p>
          ) : salaries?.length > 0 ? (
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Emp ID</th>
                    <th>Salary</th>
                    <th>Allowances</th>
                    <th>Deductions</th>
                    <th>Total</th>
                    <th>Pay Date</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries?.map((record, index) => (
                    <tr key={record._id}>
                      <td data-label="#"> {index + 1} </td>
                      <td data-label="Emp ID">{record?.empId || "-"}</td>
                      <td data-label="Salary">{record.basicSalary}</td>
                      <td data-label="Allowances">{record.allowances}</td>
                      <td data-label="Deductions">{record.deductions}</td>
                      <td data-label="Total">{record.netSalary}</td>
                      <td data-label="Pay Date">
                        {new Date(record.payDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-salary-message">No Salary Records found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default EmpSalaryHistory;
