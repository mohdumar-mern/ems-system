import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";

import "./index.scss";
import App from "./App.jsx";
import { store } from "./app/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
      </Provider>

   
  </StrictMode>
);
