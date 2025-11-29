// Profile.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import "./Profile.scss";
import { useGetEmployeeByIdQuery } from "../../../services/api";

const Profile = () => {
  const { id } = useParams();

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useGetEmployeeByIdQuery(id, { refetchOnMountOrArgChange: true });

  // The API returns `result.employee` as a single object

  if (isLoading) return <p className="loading">Loading employee details…</p>;
  if (isError)
    return (
      <p className="error">
        Error loading employee details: {error?.data?.message || error?.error}
      </p>
    );

  const {
    emp_name,
    empId,
    dob,
    gender,
    maritalStatus,
    designation,
    salary,
    createdAt,
    department,
    userId,
  } = result?.employee;

  return (
    <>
      <Helmet>
        <title>{`${emp_name} • Employee Details | Admin Panel`}</title>
        <meta
          name="description"
          content={`Details for ${emp_name}, ${designation} in ${department?.dep_name}.`}
        />
      </Helmet>

      <div className="profile">
        <header className="profile__header">
          <h1 className="profile__name">{emp_name}</h1>
          <p className="profile__email">{userId?.email}</p>
        </header>

        <figure className="profile__avatar">
          <img
            src={userId?.profile?.url}
            alt={emp_name}
            className="profile__image"
          />
        </figure>

        <section className="profile__details">
          <Detail label="Employee ID" value={empId} />
          <Detail
            label="Date of Birth"
            value={dob && new Date(dob).toLocaleDateString()}
          />
          <Detail label="Gender" value={gender} />
          <Detail label="Marital Status" value={maritalStatus} />
          <Detail label="Designation" value={designation} />
          <Detail label="Salary" value={salary} />
          <Detail label="Department" value={department?.dep_name} />
          <Detail
            label="Created At"
            value={new Date(createdAt).toLocaleString()}
          />
        </section>
      </div>
    </>
  );
};

// Small reusable component for label/value pairs
const Detail = ({ label, value }) => (
  <p className="profile__detail">
    <strong>{label}:</strong> {value ?? "Unknown"}
  </p>
);

export default Profile;
