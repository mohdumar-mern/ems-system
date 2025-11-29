// src/pages/Admin/Department/DepartmentList.jsx
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Edit, Eye, Trash } from "lucide-react";

import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import Pagination from "../../components/UI/pagination/Pagination";
import Spinner from "../../components/UI/spinner/Spinner";

import {
  useGetDepartmentsQuery,
  useDeleteDepartmentByIdMutation,
} from "../../services/api";

import { setDepartments } from "../../features/department/departmentSlice";

import "./DepartmentList.scss";

const DepartmentList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: departmentData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDepartmentsQuery({
    page: currentPage,
    search: debouncedSearch,
    limit: 5,
  });

  const [deleteDepartment] = useDeleteDepartmentByIdMutation();

  useEffect(() => {
    dispatch(setDepartments(departmentData || { data: [] }));
  }, [departmentData, dispatch]);

  const {
    dept = [],
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    totalPages = 1,
    limit = 5,
  } = useSelector((state) => state.departments);

  const handleChange = (e) => setSearchTerm(e.target.value);
  const handlePageChange = (page) => setCurrentPage(page);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id).unwrap();
        toast.success("Department deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Failed to delete department");
        console.error(err);
      }
    }
  };

  const handleAdd = () => navigate("/admin-dashboard/departments/add");

  return (
    <>
      <Helmet>
        <title>Manage Departments • Admin Panel</title>
        <meta
          name="description"
          content="Easily manage, search, add, and delete departments from the admin dashboard."
        />
      </Helmet>

      <section className="department-list">
        <header className="department-header">
          <div className="department-actions">
            <h1 className="department-title">Manage Departments</h1>
            <Button onClick={handleAdd} text="+ Add Department" />
          </div>

          <div className="search-box">
            <InputField
              type="text"
              label="Search Departments"
              name="search"
              placeholder="Search by department name"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </header>

        <div className="department-content">
          {isLoading ? (
            <div className="loader-wrapper" role="status">
              <Spinner />
              <span className="visually-hidden">Loading Departments...</span>
            </div>
          ) : isError ? (
            <p className="error-message">
              Error loading departments: {error?.data?.message || "Unknown error"}
            </p>
          ) : dept.length === 0 ? (
            <p className="no-department-message">No departments found.</p>
          ) : (
            <div className="table-container">
              <table className="department-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Department Name</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.map((dep, index) => (
                    <tr key={dep._id}>
                      <td data-label="#">{(currentPage - 1) * limit + index + 1}</td>
                      <td data-label="Department Name">{dep.dep_name}</td>
                      <td data-label="Created By">{dep.created_by?.name || "-"}</td>
                      <td data-label="Actions">
                        <div className="actions-cell">
                          <Button
                            title="Edit"
                            onClick={() => navigate(`/admin-dashboard/departments/${dep._id}/edit`)}
                            Icon={Edit}
                          />
                          <Button
                            title="View"
                            onClick={() => navigate(`/admin-dashboard/departments/${dep._id}/view`)}
                            Icon={Eye}
                          />
                          <Button
                            title="Delete"
                            onClick={() => handleDelete(dep._id)}
                            Icon={Trash}
                          />
                        </div>
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
          )}
        </div>
      </section>
    </>
  );
};

export default DepartmentList;
