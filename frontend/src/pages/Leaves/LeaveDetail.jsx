// src/pages/Emp Dashboard/Profile/Profile.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useGetLeaveByIdQuery, useUpdateLeaveStatusMutation } from "../../services/api";
import Button from "../../components/UI/Button/Button";
import { ChevronLeft } from "lucide-react";

import "./LeaveDetail.scss";
const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetLeaveByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [updateLeaveStatus] = useUpdateLeaveStatusMutation();

  const leaveRecord = data?.data;

  const approveLeaveHandler = async (e) => {
    e.preventDefault();

    await updateLeaveStatus({id, status: "approved"});
    navigate(-1);
  };

  const rejectLeaveHandler = async (e) => {
    e.preventDefault();
    await updateLeaveStatus({id, status: "rejected"});
    navigate(-1);
  };

  if (isLoading) {
    return <p className="loading">Loading leave details…</p>;
  }

  if (isError) {
    return (
      <p className="error">
        Error loading leave details:{" "}
        {error?.data?.message || error?.error || "Unknown error"}
      </p>
    );
  }

  if (!leaveRecord) {
    return <p className="empty">No leave record found.</p>;
  }

  const { employeeId, leaveType, description, startDate, endDate, status } =
    leaveRecord;

  return (
    <>
      <Helmet>
        <title>
          {`${employeeId?.emp_name} • Leave Details | Admin Panel`}
        </title>
        <meta
          name="description"
          content={`Leave details for ${employeeId?.emp_name}, ${employeeId?.designation} in ${employeeId?.department?.dep_name}.`}
        />
      </Helmet>

      <div className="profile">
        <Button onClick={() => navigate(-1)} text="Back" Icon={ChevronLeft} />
        <header className="profile__header">
          <h1 className="profile__name">{employeeId?.emp_name}</h1>
          <p className="profile__email">
            {employeeId?.userId?.email || "No email available"}
          </p>
        </header>

        <figure className="profile__avatar">
          <img
            src={employeeId?.userId?.profile?.url }
            alt={employeeId?.emp_name}
            className="profile__image"
          />
        </figure>

        <section className="profile__details">
          <Detail label="Emp ID" value={employeeId?.empId} />
          <Detail label="Leave Type" value={leaveType} />
          <Detail label="Reason" value={description} />
          <Detail
            label="Department"
            value={employeeId?.department?.dep_name}
          />
          <Detail
            label="Start Date"
            value={
              startDate
                ? new Date(startDate).toLocaleDateString()
                : null
            }
          />
          <Detail
            label="End Date"
            value={endDate ? new Date(endDate).toLocaleDateString() : null}
          />

          {status === "pending" ? (
            <div className="profile__actions">
              <Button onClick={approveLeaveHandler} text="Approve Leave" /> 
              <Button onClick={rejectLeaveHandler} text="Reject Leave" />
            </div>
          ) : (
            <Detail label="Status" value={status} />
          )}
        </section>
      </div>
    </>
  );
};

const Detail = ({ label, value }) => (
  <p className="profile__detail">
    <strong>{label}:</strong> {value ?? "Unknown"}
  </p>
);

export default Profile;
