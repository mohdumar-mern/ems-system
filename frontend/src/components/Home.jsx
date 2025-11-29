import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Home = () => {
  
  return (
    <HelmetProvider>
      <Helmet>
        <title>Employee Management</title>
        <meta
          name="description"
          content="Login securely to the employee management portal."
        />
      </Helmet>
      <div
        style={{
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "448px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "16px",
          }}
        >
          Welcome to the React App
        </h1>
        <p style={{ color: "#4b5563", marginBottom: "8px" }}>
          This is a simple React application.
        </p>
        <p style={{ color: "#4b5563" }}>
          It is designed to demonstrate the basic structure of a React app.
        </p>
      </div>
    </HelmetProvider>
  );
};

export default Home;
