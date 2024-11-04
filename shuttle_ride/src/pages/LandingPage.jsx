import React from "react";
import { verify_jwt } from "../apicalls/user.js";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('JWT');
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await verify_jwt(token); 
          console.log(response);
          if (response === "-1" || response === "-2") {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error verifying JWT:", error);
          navigate("/login");
        }
      };
      verifyToken();
    } else {
      navigate("/login");
    }
  }, [navigate]);
   
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
