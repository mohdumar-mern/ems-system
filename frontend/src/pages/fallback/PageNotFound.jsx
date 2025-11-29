// src/pages/PageNotFound.jsx
import { Link, useNavigate } from "react-router-dom";
import "./ErrorPages.scss";
import Button from "../../components/UI/Button/Button";

const PageNotFound = () => {
    const navigate = useNavigate();
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
    
        <Button className="error-link" onClick={() => navigate(-1)} text={"Go Back"} />
           
    </div>
  );
};

export default PageNotFound;
