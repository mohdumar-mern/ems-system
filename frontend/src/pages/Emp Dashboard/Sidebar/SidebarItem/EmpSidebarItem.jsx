import { NavLink } from "react-router-dom";

import "./EmpSidebarItem.scss"; 
const EmpSidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `emp-sidebar-item ${isActive ? "active" : ""}`
    }
  >
    {Icon && <Icon className="emp-sidebar-icon" />}
    <span className="emp-sidebar-label">{label}</span>
  </NavLink>
);

export default EmpSidebarItem;
