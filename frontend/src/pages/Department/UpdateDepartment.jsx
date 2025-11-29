import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import "./UpdateDepartment.scss";
import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import {
  useUpdateDepartmentByIdMutation,
  useGetDepartmentByIdQuery,
} from "../../services/api";

const UpdateDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dep_name: "",
    description: "",
  });

  const {
    data: departmentData,
    isLoading: isFetching,
    error: fetchError,
  } = useGetDepartmentByIdQuery(id);

  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentByIdMutation();

  useEffect(() => {
    if (departmentData?.department) {
      const { dep_name, description } = departmentData.department;
      setFormData({ dep_name: dep_name || "", description: description || "" });
    }
  }, [departmentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { dep_name, description } = formData;

    if (!dep_name.trim() || !description.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await updateDepartment({ id, payload: formData }).unwrap();
      toast.success("Department updated successfully!");
      navigate("/admin-dashboard/departments", { state: { updated: true } });
    } catch (err) {
      console.error("Failed to update department:", err);
      toast.error(err?.data?.message || "Failed to update department");
    }
  };

  return (
    <main className="update-department-page">
      <Helmet>
        <title>Update Department | Admin Panel</title>
        <meta
          name="description"
          content="Update department details through the admin dashboard."
        />
      </Helmet>

      <section className="update-department-card">
        <h2 className="update-department-subtitle">Edit Department</h2>

        {isFetching ? (
          <p className="status">Loading department details...</p>
        ) : fetchError ? (
          <p className="status error">Error loading department data</p>
        ) : (
          <form className="update-department-form" onSubmit={handleSubmit}>
            <InputField
              label="Department Name"
              type="text"
              name="dep_name"
              placeholder="e.g. HR"
              value={formData.dep_name}
              onChange={handleChange}
              required
            />

            <InputField
              label="Description"
              type="textarea"
              name="description"
              placeholder="e.g. Handles employee relations"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <div className="form-actions">
              <Button
                type="submit"
                text={isUpdating ? "Updating..." : "Update Department"}
                disabled={isUpdating}
              />
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default UpdateDepartment;
