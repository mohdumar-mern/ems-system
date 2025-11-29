import React, { useEffect, useRef, memo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./DashboardLayout.scss";
import ErrorBoundary from "../../../components/Error Boundary/ErrorBoundary";

const MemoizedSidebar = memo(Sidebar);

const DashboardLayout = () => {
  const mainRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Focus main content on route change
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [location.pathname]);

  return (
    <div className="dashboard-layout" role="main">
      <nav className="dash-sidebar" aria-label="Primary Sidebar">
        <MemoizedSidebar />
      </nav>
      <main
        className="dashboard-content"
        tabIndex={-1}
        ref={mainRef}
        aria-live="polite"
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>{" "}
      </main>
    </div>
  );
};

export default DashboardLayout;
