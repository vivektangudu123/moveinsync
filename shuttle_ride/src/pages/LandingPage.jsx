import React from "react";
import { verify_jwt } from "../apicalls/axiosInstance.js";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('JWT');

    if (token) {
      console.log("Found a JWT token");
      const response = verify_jwt(token);

      if (response !== "1" && response !== "2") {
        navigate("/Home");
      }
    }
  }, []);
   
  return (
    <div className="App">
    <div className="admin-login">
      <button onClick={() => navigate("/admin-login")}>Login as Admin</button>
    </div>
    <div className="user-buttons">
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/register")}>Register</button>
    </div>
  </div>

  );
}

export default LandingPage;
