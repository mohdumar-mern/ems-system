// src/services/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL ;

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("adminToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Departments", "Employees", "Leaves", "Salary"],
  endpoints: (builder) => ({
    // 🔐 Auth
    login: builder.mutation({
      query: (formData) => ({ url: "/admin/login", method: "POST", body: formData }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("adminInfo", JSON.stringify(data.user));
          localStorage.setItem("adminToken", data.token);
        } catch (err) {
          console.error("Login error:", err);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({ url: "/admin/logout", method: "GET" }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("adminInfo");
          localStorage.removeItem("adminToken");
        } catch (err) {
          console.error("Logout error:", err);
        }
      },
    }),
    adminForgotPassword: builder.mutation({
      query: ({ id, oldPassword, newPassword }) => ({
        url: `/admin/${id}/forgot-password`,
        method: "PUT",
        body: { oldPassword, newPassword },
      }),
    }),
    forgotPassword: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/user/${id}/forgot-password`,
        method: "PUT",
        body: formData,
      }),
    }),

    // 🏢 Department APIs
    addDepartment: builder.mutation({
      query: (payload) => ({ url: "/departments", method: "POST", body: payload }),
      invalidatesTags: ["Departments"],
    }),
    getDepartments: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/departments",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result?.data?.length
          ? [
              ...result.data.map(({ _id }) => ({ type: "Departments", id: _id })),
              { type: "Departments", id: "LIST" },
            ]
          : [{ type: "Departments", id: "LIST" }],
    }),
    getDepartmentsName: builder.query({
      query: () => ({ url: `/departments/dep-name`, method: "GET" }),
      // providesTags: (result, error,) => [{ type: "Departments", }],
    }),
    getDepartmentById: builder.query({
      query: (id) => ({ url: `/departments/${id}/view`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Departments", id }],
    }),
    deleteDepartmentById: builder.mutation({
      query: (id) => ({ url: `/departments/${id}/delete`, method: "DELETE" }),
      invalidatesTags: ["Departments"],
    }),
    updateDepartmentById: builder.mutation({
      query: ({ id, payload }) => ({ url: `/departments/${id}/edit`, method: "PUT", body: payload }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Departments", id },
        "Departments",
      ],
    }),

    // 👥 Employee APIs
    addEmployee: builder.mutation({
      query: (payload) => ({ url: "/employee", method: "POST", body: payload }),
      invalidatesTags: ["Employees"],
    }),
    getEmployees: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/employee",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result?.employees?.length
          ? [
              ...result.employees.map(({ _id }) => ({ type: "Employees", id: _id })),
              { type: "Employees", id: "LIST" },
            ]
          : [{ type: "Employees", id: "LIST" }],
    }),
    getEmployeeById: builder.query({
      query: (id) => ({ url: `/employee/${id}/view`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Employees", id }],
    }),
    updateEmployeeById: builder.mutation({
      query: ({ id, payload }) => ({ url: `/employee/${id}/edit`, method: "PUT", body: payload }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Employees", id },
        "Employees",
      ],
    }),
    getEmployeeByDepartment: builder.query({
      query: (depId) => ({ url: `/employee/department/${depId}`, method: "GET" }),
      providesTags: (result, error, depId) => [{ type: "Employees", id: depId }],
      keepUnusedDataFor: 0,
    }),

    // 💰 Salary APIs
    getSalary: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/salary",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Salary"],
    }),
    addSalary: builder.mutation({
      query: (payload) => ({ url: "/salary/add", method: "POST", body: payload }),
      invalidatesTags: ["Salary"],
    }),
    getSalaryByEmpId: builder.query({
      query: (empId) => ({ url: `/salary/${empId}/history`, method: "GET" }),
      providesTags: (result, error, empId) => [{ type: "Salary", id: empId }],
    }),

    // 📆 Leave APIs
    addLeave: builder.mutation({
      query: (payload) => ({ url: "/leaves/add", method: "POST", body: payload }),
      invalidatesTags: ["Leaves"],
    }),
    getLeaveHistory: builder.query({
      query: (id) => ({
        url: `/leaves/${id}/employee`,
        method: "GET",
      }),
      providesTags: ["Leaves"],
    }),
    getAdminAllLeaves: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/leaves",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result?.data?.length
          ? [
              ...result.data.map(({ _id }) => ({ type: "Leaves", id: _id })),
              { type: "Leaves", id: "LIST" },
            ]
          : [{ type: "Leaves", id: "LIST" }],
    }),
    getLeaveById: builder.query({
      query: (id) => ({ url: `/leaves/${id}/view`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Leaves", id }],
    }),
    updateLeaveStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/leaves/${id}/update-status`, method: "PUT", body: { status } }),
      invalidatesTags: ["Leaves"],
    }),
    getEmployeeLeavesByEmployeeId: builder.query({
      query: (id) => ({ url: `/leaves/${id}/leaves`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Leaves", id }],
    }),

    // 📊 Dashboard Summary
    dashboardSummary: builder.query({
      query: () => ({ url: "/dashboard/summary", method: "GET" }),
    }),
    dashboardEmpSummary: builder.query({
      query: (id) => ({ url: `/dashboard/${id}/summary`, method: "GET" }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useAdminForgotPasswordMutation,
  useForgotPasswordMutation,

  useAddDepartmentMutation,
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useDeleteDepartmentByIdMutation,
  useUpdateDepartmentByIdMutation,

  useAddEmployeeMutation,
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useDeleteEmployeeByIdMutation,
  useUpdateEmployeeByIdMutation,
  useGetEmployeeByDepartmentQuery,

  useGetSalaryQuery,
  useAddSalaryMutation,
  useGetSalaryByEmpIdQuery,
useGetDepartmentsNameQuery,
  useAddLeaveMutation,
  useGetLeaveHistoryQuery,
  useGetAdminAllLeavesQuery,
  useGetLeaveByIdQuery,
  useUpdateLeaveStatusMutation,
  useGetEmployeeLeavesByEmployeeIdQuery,

  useDashboardSummaryQuery,
  useDashboardEmpSummaryQuery
} = api;
