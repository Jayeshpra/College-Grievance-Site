import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Note: Make sure your backend is running on this port
            const response = await fetch("http://127.0.0.1:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);

                alert("Login Successful!");
                navigate("/dashboard");
            } else {
                alert("Invalid credentials");
            }

        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>

                {/* --- USERNAME FIELD --- */}
                <div className="input-group">
                    <input
                        type="text"
                        name="username"
                        placeholder=" "
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <label>Username</label>
                </div>

                {/* --- PASSWORD FIELD --- */}
                <div className="input-group">
                    <input
                        type="password"
                        name="password"
                        placeholder=" "
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <label>Password</label>
                </div>

                <button type="submit" className="login-btn">Login</button>
                <p style={{ marginTop: '15px', textAlignLast: 'center' }}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;