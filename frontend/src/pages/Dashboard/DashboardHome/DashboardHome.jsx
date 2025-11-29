// src/pages/Admin/Dashboard/DashboardHome.jsx
import { Helmet } from "react-helmet-async";
import {
  UserCircle,
  CheckCircle,
  Mail,
  Building2,
  Wallet,
  CalendarDays,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useDashboardSummaryQuery } from "../../../services/api";
import Spinner from "../../../components/UI/spinner/Spinner";
import "./DashboardHome.scss";

const DashboardHome = () => {
  const { adminInfo } = useSelector((state) => state.admin);
  const { data, isLoading, error, refetch } = useDashboardSummaryQuery();

  const avatarUrl = adminInfo?.profile?.url;
  const name = adminInfo?.name || "Admin";
  const email = adminInfo?.email || "Not available";

  const {
    totalDepartments = 0,
    totalEmployees = 0,
    totalSalary = 0,
    leaveSummary = {},
  } = data || {};

  const {
    appliedFor = 0,
    approved = 0,
    rejected = 0,
    pending = 0,
  } = leaveSummary;

  if (isLoading) {
    return (
      <div className="loader-wrapper" role="status" aria-busy="true">
        <Spinner />
        <span className="visually-hidden">Loading dashboard summary...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error" role="alert" aria-live="assertive">
        <p>Oops! Unable to load dashboard data.</p>
        <button onClick={refetch} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Dashboard • Welcome ${name}`}</title>
        <meta name="description" content={`Dashboard overview for ${name}`} />
        <meta name="robots" content="index,follow" />
        <meta name="author" content="Admin Dashboard Team" />
        <meta property="og:title" content="Admin Dashboard" />
        <meta property="og:description" content={`Admin summary for ${name}`} />
        <meta property="og:image" content={avatarUrl} />
      </Helmet>

      <section className="dashboard-home" aria-labelledby="dashboard-heading">
        <header className="dashboard-heading" id="dashboard-heading">
          <figure className="avatar" aria-hidden="true">
            <img
              src={avatarUrl}
              alt={`${name}'s profile photo`}
              className="avatar-img"
              loading="lazy"
             
            />
          </figure>
          <div className="avatar-text">
            <h1 className="welcome-text">Welcome back, {name}!</h1>
            <p className="email-text">
              <Mail className="mail-icon" aria-hidden="true" />
              <span className="visually-hidden">Email:</span>
              {email}
            </p>
          </div>
        </header>

        <p className="dashboard-subtext">
          Here's a quick snapshot of your dashboard. Manage your portfolio,
          track your activity, and stay up to date — all in one place.
        </p>

        <div className="dashboard-cards" role="region" aria-label="Dashboard statistics">
          <StatCard icon={<UserCircle />} title="Total Employees" value={totalEmployees} color="blue" />
          <StatCard icon={<Building2 />} title="Total Departments" value={totalDepartments} color="green" />
          <StatCard icon={<Wallet />} title="Total Salary" value={`₹${totalSalary.toLocaleString("en-IN")}`} color="orange" />
        </div>

        <div className="dashboard-cards" role="region" aria-label="Leave Summary">
          <StatCard icon={<CalendarDays />} title="Leave Applied" value={appliedFor} color="purple" />
          <StatCard icon={<CheckCircle />} title="Approved" value={approved} color="green" />
          <StatCard icon={<CalendarDays />} title="Rejected" value={rejected} color="red" />
          <StatCard icon={<CalendarDays />} title="Pending" value={pending} color="yellow" />
        </div>
      </section>
    </>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`card ${color}`} tabIndex={0} role="group" aria-label={`${title}: ${value}`}> 
    {icon && <div className="icon">{icon}</div>}
    <div className="card-body">
      <h3>{title}</h3>
      <span>{value}</span>
    </div>
  </div>
);

export default DashboardHome;
