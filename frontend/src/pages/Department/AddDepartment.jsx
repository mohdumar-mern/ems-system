import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "./AddDepartment.scss";
import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import { useAddDepartmentMutation } from "../../services/api";

const AddDepartment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dep_name: "",
    description: "",
  });

  const [addDepartment, { isLoading }] = useAddDepartmentMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { dep_name, description } = formData;

    if (!dep_name.trim() || !description.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      await addDepartment({ dep_name, description }).unwrap();
      toast.success("Department added successfully!");
      navigate("/admin-dashboard/departments");
    } catch (err) {
      console.error("Add department failed:", err);
      toast.error(err?.data?.message || "Failed to add department");
    }
  };

  return (
    <main className="add-department-page">
      <Helmet>
        <title>Add Department | Admin Panel</title>
        <meta
          name="description"
          content="Add a new department to your company using the admin dashboard."
        />
      </Helmet>

      <section className="add-department-card">
        <h2 className="add-department-title">Add Department</h2>

        <form className="add-department-form" onSubmit={handleSubmit}>
          <InputField
            label="Department Name"
            type="text"
            name="dep_name"
            placeholder="e.g. Human Resources"
            value={formData.dep_name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Description"
            type="textarea"
            name="description"
            placeholder="Brief description of the department"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <Button
              type="submit"
              text={isLoading ? "Submitting..." : "Add Department"}
              disabled={isLoading}
            />
          </div>
        </form>
      </section>
    </main>
  );
};

export default AddDepartment;
