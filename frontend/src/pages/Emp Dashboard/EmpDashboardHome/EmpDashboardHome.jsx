import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import {
  UserCircle,
  CheckCircle,
  Mail,
  Activity,
  History,
  Calendar,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useDashboardEmpSummaryQuery } from "../../../services/api";

import "./EmpDashboardHome.scss";

const EmpDashboardHome = () => {
  const { adminInfo } = useSelector((state) => state.admin);
  const { id } = useParams();

  const { data, isLoading, error } = useDashboardEmpSummaryQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const leaveSummary = data?.leaveSummary || {
    appliedFor: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  };

  if (isLoading) {
    return <p className="emp-loading-text">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <p className="emp-error-text">
        Failed to load employee dashboard:{" "}
        {error?.data?.message || "Unknown error"}
      </p>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Dashboard • Welcome ${adminInfo?.name || "User"}`}</title>
        <meta
          name="description"
          content={`Dashboard overview for ${adminInfo?.name || "Employee"}`}
        />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section
        className="emp-dashboard-home"
        aria-labelledby="dashboard-heading"
      >
        <header className="emp-dashboard-heading" id="dashboard-heading">
          <figure className="emp-avatar" aria-hidden="true">
            <img
              src={adminInfo?.profile?.url }
              alt={`${adminInfo?.name || "User"}’s profile photo`}
              className="emp-avatar-img"
            />
          </figure>
          <div className="emp-avatar-text">
            <h1 className="emp-welcome-text">
              Welcome back, {adminInfo?.name || "User"}!
            </h1>
            <p className="emp-email-text">
              <Mail className="emp-email-icon" aria-hidden="true" />
              {adminInfo?.email || "No email provided"}
            </p>
          </div>
        </header>

        <p className="emp-dashboard-subtext">
          Here's a quick snapshot of your dashboard. Manage your portfolio,
          track your activity, and stay up to date — all in one place.
        </p>

        <div
          className="emp-dashboard-cards"
          role="region"
          aria-label="Quick stats"
        >
          <div className="emp-card indigo" tabIndex={0}>
            <Activity className="emp-icon" />
            <span>Leaves Applied: {leaveSummary.appliedFor}</span>
          </div>
          <div className="emp-card green" tabIndex={0}>
            <CheckCircle className="emp-icon" />
            <span>Approved: {leaveSummary.approved}</span>
          </div>
          <div className="emp-card yellow" tabIndex={0}>
            <History className="emp-icon" />
            <span>Pending: {leaveSummary.pending}</span>
          </div>
          <div className="emp-card red" tabIndex={0}>
            <Calendar className="emp-icon" />
            <span>Rejected: {leaveSummary.rejected}</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default EmpDashboardHome;
