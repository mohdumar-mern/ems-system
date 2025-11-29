import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import "./ForgotPassword.scss";
import InputField from "../../../components/UI/Input/InputField";
import Button from "../../../components/UI/Button/Button";
import { useForgotPasswordMutation } from "../../../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    userId: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();

  useEffect(() => {
    if (!id) {
      toast.error("User ID not found in URL");
      navigate("/not-found");
    } else {
      setFormData((prev) => ({ ...prev, userId: id }));
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userId, oldPassword, newPassword, confirmNewPassword } = formData;

    if (!userId || !oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    try {
      const res = await forgotPassword({ id, formData }).unwrap();

      if (res?.success) {
        toast.success("Password changed successfully!");
        navigate("/employee-dashboard");
      } else {
        toast.error(res?.message || "Password change failed.");
      }
    } catch (err) {
      toast.error(err?.data?.error  || "An error occurred while changing the password");
    }
  };

  return (
    <main className="forgot-password-page">
      <Helmet>
        <title>Change Password | Employee Management</title>
        <meta name="description" content="Change your password securely." />
      </Helmet>

      <section className="forgot-password-card">
        <h1 className="forgot-password-title">Employee Management</h1>
        <h2 className="forgot-password-subtitle">Change Password</h2>

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <InputField
            label="Old Password"
            type="password"
            name="oldPassword"
            placeholder="••••••••"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />

          <InputField
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <InputField
            label="Confirm New Password"
            type="password"
            name="confirmNewPassword"
            placeholder="••••••••"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <Button
              type="submit"
              disabled={isForgotLoading}
              text={isForgotLoading ? "Changing..." : "Change Password"}
            />
          </div>
        </form>
      </section>
    </main>
  );
};

export default ForgotPassword;
