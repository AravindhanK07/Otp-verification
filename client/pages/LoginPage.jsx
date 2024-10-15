import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        formData
      );
      if (response.status === 200) {
        setAlert({ type: "success", message: "Logged in successfully!" });
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error) {
      setAlert({ type: "danger", message: "Invalid username or password" });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Login
        </button>
      </form>
      <div className="mt-3">
        <a href="/forgot-password">Forgot Password?</a>
      </div>
      <div className="mt-2">
        <span>Don't have an account? </span>
        <a href="/register">Create an account</a>
      </div>
    </div>
  );
};

export default LoginPage;
