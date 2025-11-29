// src/pages/AddLeave/AddLeave.jsx

import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



import SelectField from "../../../components/UI/SelectField/SelectField";
import InputField from "../../../components/UI/Input/InputField";
import Button from "../../../components/UI/Button/Button";

import { useAddLeaveMutation } from "../../../services/api";
import "./AddLeave.scss";

const AddLeave = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [addLeave] = useAddLeaveMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    setIsSubmitting(true);

    try {
      // Simulate API call here or use mutation
      await addLeave(formData).unwrap();
      toast.success("Leave added successfully!");
      navigate(-1); // Go back to previous page
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Failed to add leave.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="add-leave-page">
      <Helmet>
        <title>Add Leave | Admin Panel</title>
        <meta
          name="description"
          content="Form to add a new leave request via the admin panel."
        />
      </Helmet>

      <section className="card">
        <h2 className="card__title">Request for  Leave</h2>

        <form className="form" onSubmit={handleSubmit}>
          <SelectField
            label="Leave Type"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            placeholder="Select Leave Type"
            required
            options={[
              { value: "casual", label: "Casual" },
              { value: "sick", label: "Sick" },
              { value: "maternity", label: "Maternity" },
            ]}
          />

          <div className="form__grid">
            <InputField
              label="From Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <InputField
              label="To Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <InputField
            label="Description"
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            className="btn--block"
            text={isSubmitting ? "Submitting…" : "Add Leave"}
            disabled={isSubmitting}
          />
        </form>
      </section>
    </main>
  );
};

export default AddLeave;
