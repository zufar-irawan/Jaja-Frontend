"use client";

import React from "react";
import { isAuthenticated, getAuthToken } from "./clientAuth";

export default function AuthTest() {
  const checkAuth = () => {
    const authenticated = isAuthenticated();
    const token = getAuthToken();

    console.log("Is authenticated:", authenticated);
    console.log("Auth token:", token);

    alert(`Is authenticated: ${authenticated}\nToken: ${token ? "Present" : "Not found"}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Authentication Test</h2>
      <button
        onClick={checkAuth}
        style={{
          padding: "10px 20px",
          backgroundColor: "#55B4E5",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Check Auth Status
      </button>
    </div>
  );
}
