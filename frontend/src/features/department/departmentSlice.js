import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dept: [],
  department: "",
  totalDocs: 0,
  totalPages: 1,
  currentPage: 1,
  limit:6,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setDepartments: (state, action) => {
      const {
        data,
        message,
        success,
        totalDocs,
        totalPages,
        currentPage,
        limit,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = action.payload;

      state.dept = data;
      state.message = message || "";
      state.success = success || false;

      state.totalDocs = totalDocs;
      state.totalPages = totalPages;
      state.currentPage = currentPage;
      state.limit = limit ?? 5;
      state.hasPrevPage = hasPrevPage;
      state.hasNextPage = hasNextPage;
      state.prevPage = prevPage;
      state.nextPage = nextPage;
    },
    setDepartment: (state, action) => {
      state.department = action.payload;
    },
   
   
  },
});

export const {
  setDepartments,
  setDepartment,
 
} = departmentSlice.actions;

export default departmentSlice.reducer;
