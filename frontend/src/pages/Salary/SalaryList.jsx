import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";

import { useGetSalaryQuery } from "../../services/api";
import { setSalary } from "../../features/salary/salarySlice";

import Button from "../../components/UI/Button/Button";
import InputField from "../../components/UI/Input/InputField";
import Spinner from "../../components/UI/spinner/Spinner";
import Pagination from "../../components/UI/pagination/Pagination";

import "./SalaryList.scss"

const SalaryList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch salary data from API
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetSalaryQuery({
    page: currentPage,
    limit: 5,
    search: debouncedSearch,
  });

  useEffect(() => {
    if (data) dispatch(setSalary(data));
  }, [data, dispatch]);

  const handleChange = (e) => setSearchTerm(e.target.value);
  const handlePageChange = (page) => setCurrentPage(page);
  const addSalaryHandler = () => navigate("/admin-dashboard/salary/add");

  const {
    salary,
    totalPages = 1,
    hasNextPage = false,
    hasPrevPage = false,
    nextPage = null,
    prevPage = null,
  } = useSelector((state) => state.salary);

  return (
    <>
      <Helmet>
        <title>Salary List • Admin Panel</title>
        <meta name="description" content="View and manage salary history." />
      </Helmet>

      <section className="salary-list">
        <header className="salary-headers">
          <div className="salary-actions">
            <h1 className="salary-title">Salary List</h1>
            <Button onClick={addSalaryHandler} text="+ Add Salary" />
          </div>

          <div className="search-box">
            <InputField
              type="text"
              label="Search Salaries"
              name="salary-search"
              placeholder="Search by Emp ID"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </header>

        <div className="salary-content">
          {isLoading ? (
            <div className="loader-wrapper" role="status" aria-busy="true">
              <Spinner />
              <span className="visually-hidden">Loading salaries...</span>
            </div>
          ) : isError ? (
            <p className="error-message">
              Error loading salary records: {error?.message || "Unknown error"}
            </p>
          ) : salary.length > 0 ? (
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
                  {salary.map((record, index) => (
                    <tr key={record._id}>
                      <td data-label="#">{(currentPage - 1) * 5 + index + 1}</td>
                      <td data-label="Emp ID">{record.empId|| "-"}</td>
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

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                nextPage={nextPage}
                prevPage={prevPage}
              />
            </div>
          ) : (
            <p className="no-salary-message">No salary records found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default SalaryList;
