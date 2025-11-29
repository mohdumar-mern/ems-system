// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

// Public Pages
import LoginPage from "./pages/Login/LoginPage";
import Unauthorized from "./pages/fallback/Unauthorized";
import PageNotFound from "./pages/fallback/PageNotFound";

// Admin Pages
import DashboardLayout from "./pages/Dashboard/DashboardLayout/DashboardLayout";
import DashboardHome from "./pages/Dashboard/DashboardHome/DashboardHome";
import EmployeeList from "./pages/Employee/EmployeeList";
import AddEmployee from "./pages/Employee/AddEmployee";
import EmployeeDetail from "./pages/Employee/EmployeeDetail";
import UpdateEmployee from "./pages/Employee/UpdateEmployee";
import EmployeeLeave from "./pages/Employee/EmployeeLeave";
import DepartmentList from "./pages/Department/DepartmentList";
import AddDepartment from "./pages/Department/AddDepartment";
import DepartmentDetail from "./pages/Department/DepartmentDetail";
import UpdateDepartment from "./pages/Department/UpdateDepartment";
import AdminLeaveList from "./pages/Leaves/AdminLeaveList";
import LeaveDetail from "./pages/Leaves/LeaveDetail";
import SalaryList from "./pages/Salary/SalaryList";
import AddSalary from "./pages/Salary/AddSalary";
import SalaryHistory from "./pages/Salary/SalaryHistory";
import AdminForgotPassword from "./pages/Setting/ForgotPassword";

// Employee Pages
import EmployeeDashboardLayout from "./pages/Emp Dashboard/Emp DashboardLayout/EmpDashLayout";
import EmpDashboardHome from "./pages/Emp Dashboard/EmpDashboardHome/EmpDashboardHome";
import Profile from "./pages/Emp Dashboard/Profile/Profile";
import AddLeave from "./pages/Emp Dashboard/Leave/AddLeave";
import EmployeeLeaveList from "./pages/Emp Dashboard/Leave/EmployeeLeaveList";
import EmpSalaryHistory from "./pages/Emp Dashboard/Emp Salary/EmpSalaryHistory";
import ForgotPassword from "./pages/Emp Dashboard/Setting/ForgotPassword";

// Route Protection
import ProtectedRoutes from "./routes/ProtectedRoutes";

const App = () => {
  const { adminInfo } = useSelector((state) => state.admin);
  const role = adminInfo?.role;
  const id = adminInfo?.id;

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to={role === "admin" ? "/admin-dashboard" : role === "employee" ? `/employee-dashboard/${id}` : "/login"} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />

            {/* Employees */}
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/:id/view" element={<EmployeeDetail />} />
            <Route path="employees/:id/edit" element={<UpdateEmployee />} />
            <Route path="employees/:id/leaves" element={<EmployeeLeave />} />

            {/* Departments */}
            <Route path="departments" element={<DepartmentList />} />
            <Route path="departments/add" element={<AddDepartment />} />
            <Route path="departments/:id/view" element={<DepartmentDetail />} />
            <Route path="departments/:id/edit" element={<UpdateDepartment />} />

            {/* Leaves */}
            <Route path="leaves" element={<AdminLeaveList />} />
            <Route path="leave/:id/view" element={<LeaveDetail />} />

            {/* Salary */}
            <Route path="salary" element={<SalaryList />} />
            <Route path="salary/add" element={<AddSalary />} />
            <Route path="salary/:empId/history" element={<SalaryHistory />} />

            {/* Settings */}
            <Route path=":id/settings" element={<AdminForgotPassword />} />

            {/* Fallback */}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>

        {/* Employee Protected Routes */}
        <Route element={<ProtectedRoutes allowedRoles={["employee"]} />}>
          <Route path="/employee-dashboard" element={<EmployeeDashboardLayout />}>
            <Route path=":id" element={<EmpDashboardHome />} />
            <Route path=":id/profile" element={<Profile />} />
            <Route path=":id/leave" element={<EmployeeLeaveList />} />
            <Route path="leave/add" element={<AddLeave />} />
            <Route path=":id/salary" element={<EmpSalaryHistory />} />
            <Route path=":id/setting" element={<ForgotPassword />} />

            {/* Fallback */}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>

        {/* Global 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
