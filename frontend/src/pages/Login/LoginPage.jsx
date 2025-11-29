import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";

import "./LoginPage.scss";
import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";

import { useLoginMutation } from "../../services/api";
import { setAdmin } from "../../features/admin/adminSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await login(formData).unwrap();

      if (res.success && res.user && res.token) {
        dispatch(setAdmin({ user: res.user, token: res.token }));
        setMessage({ type: "success", text: res.message });

        const roleRedirects = {
          admin: "/admin-dashboard",
          employee: `/employee-dashboard/${res.user.id}`,
        
        };

        navigate(roleRedirects[res.user.role] || "/unauthorized");
      } else {
        throw new Error(res.message || "Login failed");
      }
    } catch (error) {
      const errMsg =
        error?.data?.error ||
        error?.error ||
        error.message ||
        "An unexpected error occurred";
      setMessage({ type: "error", text: errMsg });
    }
  };

  return (
    <main className="login-page">
      <Helmet>
        <title>Login | Employee Management System</title>
        <meta
          name="description"
          content="Login securely to your employee or admin dashboard."
        />
        <link rel="canonical" href="https://yourdomain.com/login" />
      </Helmet>

      <section className="login-card" aria-labelledby="login-heading">
        <h1 id="login-heading" className="login-title">
          Employee Management
        </h1>
        <h2 className="login-subtitle">Welcome back, please log in</h2>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {message && (
            <p
              role="alert"
              className={`login-message ${message.type}`}
              aria-live="assertive"
            >
              {message.text}
            </p>
          )}

          <InputField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <Button
              type="submit"
              className="btn--block"
              disabled={isLoading}
              text={isLoading ? "Logging in..." : "Login"}
            />
          </div>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
