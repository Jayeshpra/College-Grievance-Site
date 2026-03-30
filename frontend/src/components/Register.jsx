import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("STUDENT");
  const [department, setDepartment] = useState("Not selected");

  const [formData, setFormData] = useState({
    full_name: "",
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

    const payload = {
      ...formData,
      role: role,
      department: department,
      // Only send enrollment_no if student
      ...(role !== "STUDENT" && { enrollment_no: null })
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        alert("Error: " + JSON.stringify(data));
      }

    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} style={{ width: "400px" }}>
        <h2>Grievance System Register</h2>

        {/* ROLE */}
        <div className="input-group">
          <label>Register as {role}</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>

        {/* FULL NAME */}
        <div className="input-group">
          <input type="text" name="full_name" placeholder=" " onChange={handleChange} required />
          <label>Full Name</label>
        </div>

        {/* EMAIL */}
        <div className="input-group">
          <input type="email" name="email" placeholder=" " onChange={handleChange} required />
          <label>Email</label>
        </div>

        {/* PHONE */}
        <div className="input-group">
          <input type="tel" name="phone_number" placeholder=" " onChange={handleChange} required />
          <label>Phone Number</label>
        </div>

        {/* ENROLLMENT (ONLY STUDENT) */}
        {role === "STUDENT" && (
          <div className="input-group">
            <input type="text" name="enrollment_no" placeholder=" " onChange={handleChange} required />
            <label>Enrollment No</label>
          </div>
        )}

        <div className="input-group">
          <label>Department: {department}</label>
          <select name="department" value={department} onChange={(e) => setDepartment(e.target.value)} required>
            <option value="">Select Department</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
          </select>
        </div>

        {/* PASSWORD */}
        <div className="input-group">
          <input type="password" name="password" placeholder=" " onChange={handleChange} required />
          <label>Password</label>
        </div>

        <button type="submit" className="register-btn">Register</button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;