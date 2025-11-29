// EmpSidebar.jsx
import { useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Calendar,
  HandCoins,
  Settings,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAdmin } from "../../../features/admin/adminSlice";
import { useLogoutMutation } from "../../../services/api";
import EmpSidebarItem from "./SidebarItem/EmpSidebarItem";

import "./EmpSidebar.scss";

const EmpSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { adminInfo } = useSelector((state) => state.admin);
  const id = adminInfo?.id;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAdmin());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const tabs = [
    { label: "Dashboard", icon: LayoutDashboard,  path: id ? `${id}/`: ""},
    { label: "My Profile", icon: User, path: id ? `${id}/profile` : "profile" },
    { label: "Leave", icon: Calendar, path: id ?`${id}/leave` : "leave" },
    { label: "Salary", icon: HandCoins, path: id ? `${id}/salary` : "salary" },
    { label: "Setting", icon: Settings, path: id ? `${id}/setting` : "setting" },
  ];

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-label="Sidebar Navigation">
        <div onClick={closeSidebar}>
          <h2 className="sidebar-title">Admin Panel</h2>
          <nav className="sidebar-nav">
            {tabs.map(({ label, icon, path }) => (
              <EmpSidebarItem key={label} to={path} icon={icon} label={label} onClick={closeSidebar} />
            ))}
          </nav>
        </div>

        <div className="sidebar-logout">
          <button
            className="logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-disabled={isLoggingOut}
          >
            <LogOut className="icon" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default EmpSidebar;






