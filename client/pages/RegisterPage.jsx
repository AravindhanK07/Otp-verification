import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/auth/send-otp", {
        email: formData.email,
      });
      setOtpSent(true);
      alert("OTP sent to your email");
    } catch (error) {
      alert("Error sending OTP");
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/register", formData);
      alert("User registered successfully");
      setFormData({
        username: "",
        email: "",
        mobile: "",
        password: "",
        otp: "",
      });
      setOtpSent(false);
    } catch (error) {
      alert(error.response.data.error || "Error registering user");
    }
  };
  return (
    <div className="container mt-5">
      <h2>User Registration</h2>
      <form onSubmit={registerUser}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile</label>
          <input
            type="text"
            className="form-control"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {otpSent && (
          <div className="mb-3">
            <label className="form-label">OTP</label>
            <input
              type="text"
              className="form-control"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          </div>
        )}
        {!otpSent ? (
          <button type="button" className="btn btn-primary" onClick={sendOtp}>
            Send OTP
          </button>
        ) : (
          <button type="submit" className="btn btn-success">
            Register
          </button>
        )}
      </form>
      <div className="mt-3">
        <span>Already have an account? </span>
        <a href="/login">Log in</a>
      </div>
    </div>
  );
};

export default RegisterPage;
