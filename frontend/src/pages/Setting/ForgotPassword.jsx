import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/spinner/Spinner";

import { useAdminForgotPasswordMutation } from "../../services/api";

import "../Login/LoginPage.scss";

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [forgotPassword, { isLoading }] = useAdminForgotPasswordMutation();

  useEffect(() => {
    if (!id) {
      toast.error("Invalid user. Redirecting...");
      navigate("/not-found");
    }
  }, [id, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = formData;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await forgotPassword({ id, oldPassword, newPassword }).unwrap();

      if (response?.success) {
        toast.success("Password changed successfully!");
        navigate("/admin-dashboard");
      } else {
        toast.error(response?.message || "Password change failed.");
      }
    } catch (err) {
      const errorMsg = err?.data?.error || "An unexpected error occurred.";
      toast.error(errorMsg);
    }
  };

  return (
    <main className="forgot-password-page">
      <Helmet>
        <title>Change Password • Admin Panel</title>
        <meta name="description" content="Change your password securely." />
      </Helmet>

      <section className="forgot-password-card">
        <h1 className="forgot-password-title">Employee Management</h1>
        <h2 className="forgot-password-subtitle">Change Password</h2>

        <form className="forgot-password-form" onSubmit={handleSubmit} autoComplete="off">
          <InputField
            label="Old Password"
            type="password"
            name="oldPassword"
            placeholder="Enter your current password"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />

          <InputField
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="Enter a new password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <InputField
            label="Confirm New Password"
            type="password"
            name="confirmNewPassword"
            placeholder="Re-enter new password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <Button
              type="submit"
              text={isLoading ? "Changing..." : "Change Password"}
              disabled={isLoading}
            />
          </div>
        </form>

        {isLoading && (
          <div className="spinner-overlay">
            <Spinner />
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminForgotPassword;
