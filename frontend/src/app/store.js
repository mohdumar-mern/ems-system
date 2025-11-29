// store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createLogger } from "redux-logger";
import { api } from "../services/api";

import adminReducer from "../features/admin/adminSlice"
import departmentReducer from "../features/department/departmentSlice"
import employeeReducer from "../features/employee/employeeSlice"
import salaryReducer from "../features/salary/salarySlice";

const isDev = import.meta.env.VITE_NODE_ENV === "development";
const logger = createLogger({
  collapsed: true,
  diff: true,
});

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    admin: adminReducer,
    departments: departmentReducer,
    employees: employeeReducer,
    salary: salaryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    isDev
      ? getDefaultMiddleware().concat(api.middleware, logger)
      : getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);
