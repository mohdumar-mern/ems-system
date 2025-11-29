import React from "react";
import { Outlet } from "react-router-dom";

import "./EmpDashLayout.scss";

import EmpSidebar from "../Sidebar/EmpSidebar";

const EmployeeDashboardLayout = () => {
  return (
    <div className="employee-dashboard-layout">
      <EmpSidebar />
      <main>
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboardLayout;
