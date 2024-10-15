import React, { useState } from "react";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        { email }
      );

      setMessage(
        "If an account with that email exists, you will receive a password reset link."
      );
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("No account associated with this email.");
      } else {
        setErrorMessage("Error sending password reset link.");
      }
    }
  };

  return (
    <div className="mt-5">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-3 alert alert-success">{message}</p>}
      {errorMessage && (
        <p className="mt-3 alert alert-danger">{errorMessage}</p>
      )}
    </div>
  );
};

export default ForgetPassword;
