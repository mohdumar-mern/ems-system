import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";

import { useGetDepartmentByIdQuery } from "../../services/api";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/spinner/Spinner";
import "./DepartmentDetail.scss";

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetDepartmentByIdQuery(id);

  const department = useMemo(() => data?.department, [data]);

  // 🌀 Loading state
  if (isLoading) {
    return (
      <div className="loader-wrapper" role="status" aria-live="polite">
        <Spinner />
        <span className="visually-hidden">Loading department details...</span>
      </div>
    );
  }

  // ⚠️ Error state
  if (error) {
    return (
      <div className="error-message" role="alert">
        <p>Error loading department details. Please try again.</p>
        <Button text="Retry" onClick={refetch} />
      </div>
    );
  }

  // ❌ Not found state
  if (!department) {
    return (
      <div className="not-found-message" role="alert">
        <p>No department found.</p>
        <Button text="Back" onClick={() => navigate(-1)} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${department.dep_name} • Department Details | Admin Panel`}</title>
        <meta
          name="description"
          content={`Details of the ${department.dep_name} department including creator and description.`}
        />
      </Helmet>

      <section className="department-detail" aria-labelledby="department-heading">
        <header className="department-header">
          <h1 id="department-heading">{department.dep_name}</h1>
          <h3>{department.created_by?.email || "No email provided"}</h3>
        </header>

        <div className="department-info">
          <InfoItem label="Description" value={department.description || "No description provided."} />
          <InfoItem label="Created By" value={department.created_by?.name || "Unknown"} />
          <InfoItem label="Created At" value={new Date(department.createdAt).toLocaleString()} />
        </div>

        <div className="department-actions">
          <Button
            onClick={() => navigate(-1)}
            text="Back to Departments"
            Icon={ChevronLeft}
          />
        </div>
      </section>
    </>
  );
};

// 🔄 Reusable info item
const InfoItem = ({ label, value }) => (
  <p>
    <strong>{label}:</strong> {value}
  </p>
);

export default DepartmentDetail;
