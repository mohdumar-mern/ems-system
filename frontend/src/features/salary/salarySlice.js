import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  salary: [],
  salaries:[],
  success: false,
  message: "",
  totalDocs: 0,
  limit: 0,
  totalPages: 0,
  currentPage: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
};

const salarySlice = createSlice({
  name: "salary",
  initialState,
  reducers: {
    setSalary: (state, action) => {
      const payload = action.payload;

      state.salary = payload.data || [];
      state.success = payload.success || false;
      state.message = payload.message || "";

      state.totalDocs = payload.totalDocs || 0;
      state.limit = payload.limit || 0;
      state.totalPages = payload.totalPages || 0;
      state.currentPage = payload.currentPage || 1;
      state.pagingCounter = payload.pagingCounter || 1;
      state.hasPrevPage = payload.hasPrevPage || false;
      state.hasNextPage = payload.hasNextPage || false;
      state.prevPage = payload.prevPage || null;
      state.nextPage = payload.nextPage || null;
    },

    setSalaryHistory: (state, action) =>{
      const payload = action.payload

      state.salaries = payload || []
   

    },

    resetSalaryState: () => ({
      ...initialState,
    }),
  },
});

export const { setSalary, resetSalaryState,setSalaryHistory } = salarySlice.actions;
export default salarySlice.reducer;
