import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem("token", data.tokens.access);
        localStorage.setItem("refresh", data.tokens.refresh);
        localStorage.setItem("role", data.role);
        localStorage.setItem("full_name", data.full_name);
        localStorage.setItem("email", data.email);
        localStorage.setItem("department", data.department);

        navigate("/");

      } else {
        alert("Invalid credentials. Please try again. or Please register if you are new user.");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Server error. Make sure backend is running.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {/* --- EMAIL --- */}
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder=" "
            value={loginData.email}
            onChange={handleChange}
            required
          />
          <label>Email</label>
        </div>

        {/* --- PASSWORD --- */}
        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder=" "
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;