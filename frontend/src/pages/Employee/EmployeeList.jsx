import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Eye, HandCoins, LogOut } from "lucide-react";

import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/spinner/Spinner";
import Pagination from "../../components/UI/pagination/Pagination";

import { useGetEmployeesQuery } from "../../services/api";
import { setEmployees } from "../../features/employee/employeeSlice";

import "./EmployeeList.scss";

const EmployeeList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: employeesDataFromApi = {},
    isLoading,
    isError,
    error,
  } = useGetEmployeesQuery({
    page: currentPage,
    search: debouncedSearch,
    limit: 5,
  });


  useEffect(() => {
    if (employeesDataFromApi?.data?.length) {
      dispatch(setEmployees(employeesDataFromApi));
    }
  }, [employeesDataFromApi, dispatch]);

  const {
    employees,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    totalPages,
    limit,
  } = useSelector((state) => state.employees);

  const handleChange = (e) => setSearchTerm(e.target.value);
  const handlePageChange = (newPage) => setCurrentPage(newPage);
  const addEmployee = () => navigate("/admin-dashboard/employees/add");

  return (
    <>
      <Helmet>
        <title>Employees • Admin Panel</title>
        <meta
          name="description"
          content="Manage employee details, departments, and access in the admin dashboard."
        />
      </Helmet>

      <section className="employee-list">
        <header className="employee-header">
          <div className="employee-actions">
            <h1 className="employee-title">Manage Employees</h1>
            <Button onClick={addEmployee} text="+ Add Employee" />
          </div>
          <div className="search-box">
            <InputField
              type="text"
              label="Search Employees"
              name="employee"
              placeholder="Search by name, ID, designation, MaritalStatus and gender"
              value={searchTerm}
              onChange={handleChange}
              required={false}
            />
          </div>
        </header>

        <div className="employee-content">
          {isLoading ? (
            <div className="loader-wrapper" role="status">
              <Spinner />
              <span className="visually-hidden">Loading Employees...</span>
            </div>
          ) : isError ? (
            <p className="error-message">
              Error loading employees: {error?.data?.message || "Unknown error"}
            </p>
          ) : employees.length > 0 ? (
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, index) => (
                    <tr key={emp._id}>
                      <td data-label="#">
                        {(currentPage - 1) * limit + index + 1}
                      </td>
                      <td data-label="Profile">
                        <img
                          src={emp?.userId?.profile?.url }
                          alt={`${emp.emp_name || "Employee"} Profile`}
                          className="profile-image"
                        />
                      </td>
                      <td data-label="Name">{emp.emp_name || "-"}</td>
                      <td data-label="Department">{emp.department?.dep_name || "-"}</td>
                      <td data-label="Created By">{emp.created_by?.name || "-"}</td>
                      <td data-label="Actions">
                        <div className="actions-cell">
                          <Button
                            title="Edit"
                            Icon={Edit}
                            onClick={() =>
                              navigate(`/admin-dashboard/employees/${emp._id}/edit`)
                            }
                          />
                          <Button
                            title="View"
                            Icon={Eye}
                            onClick={() =>
                              navigate(`/admin-dashboard/employees/${emp._id}/view`)
                            }
                          />
                          <Button
                            title="Salary History"
                            Icon={HandCoins}
                            onClick={() =>
                              navigate(`/admin-dashboard/salary/${emp.empId}/history`)
                            }
                          />
                          <Button
                            title="Leave Records"
                            Icon={LogOut}
                            onClick={() =>
                              navigate(`/admin-dashboard/employees/${emp._id}/leaves`)
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages || 1}
                onPageChange={handlePageChange}
                hasNextPage={hasNextPage}
                prevPage={prevPage}
                hasPrevPage={hasPrevPage}
                nextPage={nextPage}
              />
            </div>
          ) : (
            <p className="no-employee-message">No employees found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default EmployeeList;
