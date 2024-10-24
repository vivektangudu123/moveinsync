
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'; 
import { Login_OTP, loginUser } from "../apicalls/user";
import { useNavigate } from "react-router-dom";
import { verify_jwt } from "../apicalls/axiosInstance";
import { useEffect } from 'react';
function Registration() {
    useEffect(() => {
        const token = localStorage.getItem('JWT');
    
        if (token) {
          console.log("Found a JWT token");
          const response = verify_jwt(token);
    
          if (response !== "1" && response !== "2") {
            navigate("/Home");
          } else {
              navigate("/LandingPage")
          }
        }
    }, []);
    const [name,setName] = useState('');
    const [gender, setGender] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form submitted:', {
            name,
            gender,
            mobileNumber,
            email,
        });
        const clearForm = () => {
            setName('');
            setGender('');
            setMobileNumber('');
            setEmail('');
        };
        
        try {
            // if (!isphonenumberverified) {
            //     alert("Please verify Phone number!!");
            //     return;
            // }
            // if (!isemailverified) {
            //     alert("Please verify Email address!!");
            //     return;
            // }

            // Send patient details to backend server
            const response = await fetch("http://localhost:5001/users/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    Name: name,
                    gender: gender,
                    phoneNumber: mobileNumber,
                    email: email
                })
            });
            
            const data = await response.text();
            if (data === "Success" && response.ok) {
                alert("Registration Done");
                navigate("/home"); 
                clearForm();  
            } else {
                alert(data);  
            }

        } catch (error) {
            console.error('Error registering patient:', error);
            alert('Error registering patient. Please try again later.');
        }
    };

    const [phonenumberotp, setphonenumberotp] = useState("");
    const [emailotp, setemailotp] = useState("");
    const [phonenumberotpSent, setphonenumberotpSent] = useState(false);
    const [emailotpSent, setemailotpSent] = useState(false);
    const [isphonenumberverified, setisphonenumberverified] = useState(false);
    const [isemailverified, setisemailverified] = useState(true);
    const sendphonenumberotp = () => {
        if (mobileNumber.length !== 10) {
            alert("Enter a Valid Mobile Number");
            return;
        }
        // Logic to send OTP to the provided phone number
        loginUser(mobileNumber,1);
        setphonenumberotpSent(true);
    }
    const verifyphonenumberotp = () => {
        if (phonenumberotp.length < 6) {
            alert("Enter a Valid Otp to verify your Mobile Number");
            return;
        }
        console.log(phonenumberotp)
        const response = Login_OTP(mobileNumber, phonenumberotp);
        if (response === "approved") {
            setisphonenumberverified(true);
            setphonenumberotpSent(false);
            navigate("/Home");
        }

    }
    const sendemailotp = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email address. Please enter a valid email address.");
            return;
        }

        // Logic to send OTP to the provided email
        setemailotpSent(true);
    }

    const verifyemailotp = () => {

        if (emailotp.length < 6) {
            alert("Enter a Valid OTP to verify your Email address");
            return;
        }
        //logic to verify email by otp
        setisemailverified(true);
        setemailotpSent(false);
    }
    return (
        <div>

            <div className="container-fluid d-flex justify-content-center align-items-center">
                <div className="center-container">
                    <div className="card-body mb-3 g-30" style={{ width: '30rem' }}>
                        <h1 className="card-title mb-3 g-10 text-center text-primary">Registration</h1>
                        <form onSubmit={handleSubmit}>

                        <div className="mb-3 g-10">
                                <label htmlFor="PatientName" className="form-label required"><span className="form-label-heading">Full Name <span className="text-danger">*</span></span></label>
                                <input type="text" className="form-control" id="InputPatientName" placeholder="Enter your Full Name" required minLength="2" maxLength="20" onChange={(e) => { setName(e.target.value); }} />
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3 g-10">
                                        <label htmlFor="Gender" className="form-label required"><span className="form-label-heading" >Gender <span className="text-danger">*</span></span></label>
                                        <select className="form-select" data-toggle="dropdown" required id="InputGender" onChange={(e) => { setGender(e.target.value); }}>
                                            <option value="">Select</option>
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                            <option value="prefer_not_to_say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 g-10">
                                <label htmlFor="MobileNumber" className="form-label required"><span className="form-label-heading">Mobile Number <span className="text-danger">*</span></span></label>
                                <div class="row">
                                    <input class="col-md-9" style={{ width: '70%', marginLeft: '2%' }} type="tel" pattern="[0-9]{10}" inputMode="numeric" className="form-control" id="InputMobileNumber" placeholder="Enter your Mobile Number" required minLength="10" maxLength="10" onInput={(e) => { const inputValue = e.target.value; const numericValue = inputValue.replace(/\D/g, ''); e.target.value = numericValue; setMobileNumber(numericValue); }} onChange={(e) => { setMobileNumber(e.target.value); }} />
                                    <button className={`col-md-2 offset-md-1 btn ${isphonenumberverified ? "btn-success" : "btn-primary"}`} onClick={isphonenumberverified ? null : sendphonenumberotp}> {isphonenumberverified ? "Verified" : "Verify"} </button>
                                </div>

                                {phonenumberotpSent &&
                                    <div className="mb-3 g-10">
                                        <div className="form-text mb-3 g-10">We have sent 6 digit code to your mobile number.</div>

                                        <div className="mb-3 g-10">
                                            <label htmlFor="MobileOtpVerification" className="form-label required"><span className="form-label-heading"> Enter the otp for complete verification<span className="text-danger">*</span></span></label>
                                            <div class="row">
                                                <input onInput={(e) => { const inputValue = e.target.value; const numericValue = inputValue.replace(/\D/g, ''); e.target.value = numericValue; setphonenumberotp(numericValue); }} type="text" class="col-md-9" minLength={6} maxLength={6} style={{ width: '70%', marginLeft: '2%' }} className="form-control" id="InputOTP" placeholder="Enter OTP" required onChange={(e) => { setphonenumberotp(e.target.value) }} />
                                                <button className="col-md-2 offset-md-1 btn btn-primary" onClick={verifyphonenumberotp}> Submit </button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className="mb-3 g-10">
                                <label htmlFor="Email" className="form-label required"><span className="form-label-heading">Email <span className="text-danger">*</span></span></label>
                                <div class="row ">
                                    <input type="email" class="col-md-9" className="form-control" style={{ width: '70%', marginLeft: '2%' }} id="InputEmail" placeholder="Enter your Email" required onChange={(e) => { setEmail(e.target.value); }} />
                                    <button className={`col-md-2 offset-md-1 btn ${isemailverified ? "btn-success" : "btn-primary"}`} onClick={isemailverified ? null : sendemailotp}> {isemailverified ? "Verified" : "Verify"} </button>
                                </div>
                                {emailotpSent &&
                                    <div className="mb-3 g-10">
                                        <div className="form-text mb-3 g-10">We have sent 6 digit code to your Email.</div>

                                        <div className="mb-3 g-10">
                                            <label htmlFor="EmailOtpVerification" className="form-label required"><span className="form-label-heading"> Enter the otp for Email verification<span className="text-danger">*</span></span></label>
                                            <div class="row">
                                                <input onInput={(e) => { const inputValue = e.target.value; const numericValue = inputValue.replace(/\D/g, ''); e.target.value = numericValue; setMobileNumber(numericValue); }} onChange={(e) => { setemailotp(e.target.value) }} type="text" class="col-md-9" minLength={6} maxLength={6} style={{ width: '70%', marginLeft: '2%' }} className="form-control" id="InputOTP" placeholder="Enter OTP" required />
                                                <button className="col-md-2 offset-md-1 btn btn-primary" onClick={verifyemailotp}> Submit </button>
                                            </div>
                                        </div>
                                    </div>
                                }

                            </div>


                            <button type="submit" className="mb-3 g-10 btn btn-primary btn-lg d-block mx-auto rounded-pill" style={{ width: '250px' }}> Register </button>

                            <p className="card-text mb-3 g-10 text-center">Already Registered? <Link to="/" className="card-link"> Login </Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registration;