// features/admin/adminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminInfo: JSON.parse(localStorage.getItem("adminInfo")) || null,
  token: localStorage.getItem("adminToken") || null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.adminInfo = action.payload.user;
      state.token = action.payload.token;
    },
    clearAdmin: (state) => {
      state.adminInfo = null;
      state.token = null;
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
