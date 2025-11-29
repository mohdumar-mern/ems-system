import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
  employee: null,
  message: "",
  success: false,

  // Pagination-related state
  currentPage: 1,
  totalPages: 1,
  totalDocs: 0,
  limit:6,
  hasNextPage: false,
  hasPrevPage: false,
  nextPage: null,
  prevPage: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      const {
        data,
        message,
        success,
        currentPage,
        totalPages,
        totalDocs,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        limit,
      } = action.payload;

      state.employees = data;
      state.message = message || "";
      state.success = success || false;

      // Set pagination info
      state.currentPage = currentPage || 1;
      state.totalPages = totalPages || 1;
      state.totalDocs = totalDocs || data?.length || 0;
      state.hasNextPage = hasNextPage || false;
      state.hasPrevPage = hasPrevPage || false;
      state.nextPage = nextPage ?? null;
      state.prevPage = prevPage ?? null;
      state.limit = limit ?? 5;
    },

  
    setSingleEmployee: (state, action) => {
      state.employee = action.payload;
    },

   
  },
});

export const {
  setEmployees,
  setSingleEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;
