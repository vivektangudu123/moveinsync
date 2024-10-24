import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Login_OTP, loginUser } from "../apicalls/user";
import { verify_jwt } from "../apicalls/axiosInstance";

function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [mobileNumberOtpSent, setMobileNumberOtpSent] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("JWT");
    if (token) {
      const response = verify_jwt(token);
      if (response !== "1" && response !== "2") {
        navigate("/Home");
      } else {
        navigate("/LandingPage");
      }
    }
  }, [navigate]);

  const handleMobileNumberSubmit = async (e) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      alert("Enter a valid mobile number to login");
      return;
    }
    try {
      const response = await loginUser(mobileNumber, 1);
      if (response === "pending") {
        setMobileNumberOtpSent(true);
      } else {
        alert("Try again!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      alert("Enter a six-digit OTP to login");
      return;
    }
    try {
      const response = await Login_OTP(mobileNumber, otp);
      if (response === true) {
        setLoginSuccessful(true);
        navigate("/Home");
      } else {
        alert("Please try again!!");
        navigate("/Login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Patient Login</h1>
        {mobileNumberOtpSent ? (
          <form onSubmit={handleOTPSubmit}>
            <div className="input-group">
              <label htmlFor="OTP">Enter OTP</label>
              <input
                type="text"
                id="InputOTP"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                minLength="6"
                maxLength="6"
              />
            </div>
            <button type="submit" className="login-btn">
              Verify OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleMobileNumberSubmit}>
            <div className="input-group">
              <label htmlFor="MobileNumber">Mobile Number</label>
              <input
                type="tel"
                id="InputMobileNumber"
                placeholder="Enter your Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                minLength="10"
                maxLength="10"
                onInput={(e) => {
                  const inputValue = e.target.value.replace(/\D/g, "");
                  e.target.value = inputValue;
                  setMobileNumber(inputValue);
                }}
              />
            </div>
            <button type="submit" className="login-btn">
              Send OTP
            </button>
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create account</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
