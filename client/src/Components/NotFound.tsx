import React from "react";
import Header from "./Header";

const NotFound = () => {
  return (
    <>
    <Header />
    <div style={{ height: "100vh", backgroundColor: "#fff"}}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 80px)", 
          color: "white",
          fontFamily: "Segoe UI, sans-serif",
          textAlign: "center",
        }}
      >
        <img
          src='NotFoundamico.png'
          alt="404 Not Found"
          style={{
            maxWidth: "400px",
            width: "100%",
            animation: "float 3s ease-in-out infinite",
          }}
        />
        <p style={{ maxWidth: "400px", marginBottom: "20px" ,color:'black' }}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          style={{
            backgroundColor: "#fff",
            color: "#2D1A5B",
            padding: "10px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
        >
          ⬅ Back to Home
        </a>

        <style>
          {`
            @keyframes float {
              0% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
              100% { transform: translateY(0); }
            }

            a:hover {
              background-color: #f2e7ff;
              color: #1a0f3f;
            }
          `}
        </style>
      </div>
    </div>
    </>
  );
};

export default NotFound;
