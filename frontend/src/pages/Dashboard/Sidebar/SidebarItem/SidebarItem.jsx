import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import "./SidebarItem.scss";

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) => `sidebar-item${isActive ? " active" : ""}`}
    aria-current={({ isActive }) => (isActive ? "page" : undefined)}
  >
    {Icon && <Icon className="sidebar-icon" aria-hidden="true" />}
    <span className="sidebar-label">{label}</span>
  </NavLink>
);

SidebarItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
};

SidebarItem.defaultProps = {
  icon: null,
};

export default SidebarItem;
