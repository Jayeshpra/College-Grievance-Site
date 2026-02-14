import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css"; // We can reuse your Login CSS!

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    department: "",
    enrollment_no: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Prepare the data payload (Adjust keys based on your Django Serializer)
    const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "STUDENT", // Hardcode this since it's a student register page
        profile: {
            phone_number: formData.phone_number,
            department: formData.department,
            enrollment_no: formData.enrollment_no
        }
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Registration Successful! Please Login.");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert("Registration failed: " + JSON.stringify(errorData));
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} style={{ width: '400px' }}>
        <h2>Student Registration</h2>

        {/* --- USERNAME --- */}
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder=" "
            onChange={handleChange}
            required
          />
          <label>Username</label>
        </div>

        {/* --- EMAIL --- */}
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder=" "
            onChange={handleChange}
            required
          />
          <label>Email Address</label>
        </div>

        {/* --- PHONE NUMBER --- */}
        <div className="input-group">
          <input
            type="tel"
            name="phone_number"
            placeholder=" "
            onChange={handleChange}
            required
            pattern="[0-9]{10}" // Simple validation for 10 digits
          />
          <label>Phone Number</label>
        </div>

        {/* --- ENROLLMENT NUMBER --- */}
        <div className="input-group">
          <input
            type="text"
            name="enrollment_no"
            placeholder=" "
            onChange={handleChange}
            required
          />
          <label>Enrollment No.</label>
        </div>

        {/* --- PASSWORD --- */}
        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder=" "
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>

        <button type="submit" className="register-btn">Register</button>
        
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;