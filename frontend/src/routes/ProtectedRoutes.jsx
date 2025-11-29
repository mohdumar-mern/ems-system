import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";


const ProtectedRoutes = ({ allowedRoles, children }) => {
  const adminInfo = useSelector((state) => state.admin.adminInfo);

  //  Not logged in? Redirect to login.
  if (!adminInfo) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed? Redirect to unauthorized.
  if (!allowedRoles.includes(adminInfo.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  //  If children passed directly, render them
  if (children) {
    return children;
  }

  //  Otherwise render nested routes via Outlet
  return <Outlet />;
};

export default ProtectedRoutes;
