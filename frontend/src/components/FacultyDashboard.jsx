import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FacultyDashboard.css";
import logo from "../assets/logo.png";

function FacultyDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("assigned");

    // 1. Move mock data into a proper useState hook so it can be updated
    const [assignedGrievances, setAssignedGrievances] = useState([
        { id: "GR-2024-001", subject: "Broken Lab Stools", student: "Rahul Verma", date: "2026-03-07", status: "New" },
        { id: "GR-2024-002", subject: "Software License Expired", student: "Priya Shah", date: "2026-03-05", status: "In Progress" },
        { id: "GR-2024-003", subject: "Server Connectivity Issue", student: "Priya Shah", date: "2026-03-05", status: "Resolved" },
    ]);

    // 2. Logic to update the status in the state
    const handleStatusChange = (id, newStatus) => {
        const updatedGrievances = assignedGrievances.map((g) => {
            if (g.id === id) {
                return { ...g, status: newStatus }; // Return new object with updated status
            }
            return g;
        });
        setAssignedGrievances(updatedGrievances);

        // Optional: console.log to confirm the change
        console.log(`Updated ${id} to ${newStatus}`);
    };

    return (
        <div className="fac-dash-container">
            <nav className="fac-nav">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={logo} alt="img" style={{ width: '50px' }} />
                    <div className="fac-logo">Grievance Portal | Faculty</div>
                </div>
                <div className="fac-nav-right">
                    <button className="fac-nav-link" onClick={() => navigate("/add-complaint")}>File My Own Complaint</button>
                    <button className="fac-logout-btn" onClick={() => navigate("/login")}>Logout</button>
                </div>
            </nav>

            <div className="fac-main">
                <header className="fac-header">
                    <h2>Welcome, Prof. Sharma</h2>
                    <p>Manage your responsibilities and your own queries here.</p>
                </header>

                <div className="fac-tab-bar">
                    <button
                        className={`fac-tab ${activeTab === "assigned" ? "fac-tab-active" : ""}`}
                        onClick={() => setActiveTab("assigned")}
                    >
                        Assigned to Me (Solving)
                    </button>
                    <button
                        className={`fac-tab ${activeTab === "my-queries" ? "fac-tab-active" : ""}`}
                        onClick={() => setActiveTab("my-queries")}
                    >
                        My Submitted Queries
                    </button>
                </div>

                <div className="fac-card">
                    {activeTab === "assigned" ? (
                        <>
                            <div className="adm-stats">
                                <div className="adm-stat-card"><h4>{assignedGrievances.length}</h4><p>Total</p></div>
                                <div className="adm-stat-card sky"><h4>{assignedGrievances.filter(g => g.status === "New").length}</h4><p>New</p></div>
                                <div className="adm-stat-card orange"><h4>{assignedGrievances.filter(g => g.status === "In Progress").length}</h4><p>In Progress</p></div>
                                <div className="adm-stat-card green"><h4>{assignedGrievances.filter(g => g.status === "Resolved" || g.status === "Closed").length}</h4><p>Resolved</p></div>
                            </div>

                            <div className="fac-table-wrapper">

                                <h3>Complaints to Resolve</h3>
                                <table className="fac-table">
                                    <thead>
                                        <tr>
                                            <th>Query ID</th>
                                            <th>Subject</th>
                                            <th>Submitted By</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignedGrievances.map(g => (
                                            <tr key={g.id}>
                                                <td>{g.id}</td>
                                                <td>{g.subject}</td>
                                                <td>{g.student}</td>
                                                <td>{g.date}</td>
                                                {/* Status text now updates automatically from state */}
                                                <td>
                                                    <span className={`fac-status-text status-${g.status.replace(/\s+/g, "").toLowerCase()}`}>
                                                        {g.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        value={g.status}
                                                        onChange={(e) => handleStatusChange(g.id, e.target.value)}
                                                        className={`fac-status-dropdown dropdown-${g.status.replace(/\s+/g, "").toLowerCase()}`}
                                                    >
                                                        <option value="New">New</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Resolved">Resolved</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="fac-empty-state">
                            <p>You haven't submitted any personal grievances yet.</p>
                            <button onClick={() => navigate("/add-complaint")} className="fac-primary-btn">File Now</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FacultyDashboard;