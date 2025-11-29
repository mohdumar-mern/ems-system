// Sidebar.jsx
import { useState, useEffect } from "react";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Menu,
  X,
  Calendar,
  HandCoins,
  Landmark,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAdmin } from "../../../features/admin/adminSlice";
import { useLogoutMutation } from "../../../services/api";
import SidebarItem from "./SidebarItem/SidebarItem";
import "./Sidebar.scss";

const Sidebar = () => {
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
    { label: "Dashboard", icon: LayoutDashboard, path: "" },
    { label: "Employees", icon: Users, path: "employees" },
    { label: "Departments", icon: Landmark, path: "departments" },
    { label: "Leaves", icon: Calendar, path: "leaves" },
    { label: "Salary", icon: HandCoins, path: "salary" },
    { label: "Setting", icon: Settings, path: id ? `${id}/settings` : "settings" },
  ];

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  // Close sidebar on window resize if screen is large (to keep sidebar open)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Show toggle button only on small screens */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-label="Sidebar Navigation">
        <div onClick={closeSidebar}>
          <h2 className="sidebar-title">Admin Panel</h2>
          <nav className="sidebar-nav">
            {tabs.map(({ label, icon, path }) => (
              <SidebarItem
                key={label}
                to={path}
                icon={icon}
                label={label}
                onClick={closeSidebar}
              />
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

export default Sidebar;
