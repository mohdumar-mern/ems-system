// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";
import "./ErrorPages.scss";

const Unauthorized = () => {
  return (
    <div className="error-page">
      <h1>Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/login" className="error-link">
        Go to Login
      </Link>
    </div>
  );
};

export default Unauthorized;
