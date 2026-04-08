import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import logo from '../assets/logo.png';

function UserDashboard() {
    const navigate = useNavigate();

    const [grievances, setGrievances] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/student/dashboard/", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setGrievances(data.data);
                    setStats({
                        total: data.total,
                        pending: data.pending,
                        in_progress: data.in_progress,
                        resolved: data.resolved
                    });
                } else {
                    console.error(data);
                }

            } catch (error) {
                console.error("Error fetching dashboard:", error);
            }
        };

        fetchDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="dashboard-wrapper">

            {/* NAVBAR */}
            <nav className="dash-navbar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={logo} alt="img" style={{ width: '50px' }} />
                    <div className="dash-nav-logo">Grievance Portal</div>
                </div>

                <div className="dash-nav-links">
                    <button className="dash-nav-btn" onClick={() => navigate("/profile")}>
                        My Profile
                    </button>

                    <button className="dash-nav-btn primary" onClick={() => navigate("/add-complaint")}>
                        + New Complaint
                    </button>

                    <button className="dash-nav-btn logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <div className="dashboard-content">

                {/* 🔥 USER INFO */}
                <header className="welcome-section">
                    <h1>
                        Welcome back, {localStorage.getItem("full_name") || "User"}!
                    </h1>
                    <p>
                        Department: {localStorage.getItem("department")}
                    </p>
                </header>

                {/* STATS */}
                <div className="stats-container">
                    <div className="stat-card">
                        <h3>Total Filed</h3>
                        <p className="stat-number">{stats.total}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Pending</h3>
                        <p className="stat-number yellow">{stats.pending}</p>
                    </div>

                    <div className="stat-card">
                        <h3>In Progress</h3>
                        <p className="stat-number purple">{stats.in_progress}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Resolved</h3>
                        <p className="stat-number green">{stats.resolved}</p>
                    </div>
                </div>

                {/* TABLE */}
                <section className="table-section">
                    <h2>Your Submitted Queries</h2>

                    <div className="table-responsive">
                        <table className="grievance-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Subject</th>
                                    <th>Department</th>
                                    <th>Date Filed</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {grievances.map((item) => (
                                    <tr key={item.id}>
                                        <td><strong>{item.grievance_id}</strong></td>
                                        <td>{item.subject}</td>
                                        <td>{item.department}</td>
                                        <td>{item.date_filed}</td>
                                        <td>
                                            <span className={`status-badge ${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default UserDashboard;