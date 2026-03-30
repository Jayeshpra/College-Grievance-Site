import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import logo from "../assets/logo.png"

function AdminDashboard() {
    const navigate = useNavigate();

    // 1. Mock Data for Grievances
    const [grievances, setGrievances] = useState([
        { id: "GR-2024-001", title: "Water Leakage in Block A", user: "Jayesh (Student)", dept: "Maintenance", date: "2026-03-10", status: "New", desc: "The main pipe in the corridor is leaking since morning.", image: null, assignedTo: "-" },
        { id: "GR-2024-002", title: "Projector Not Working", user: "Prof. Verma (Faculty)", dept: "IT Support", date: "2026-03-09", status: "In Progress", desc: "HDMI port seems loose in Room 402.", image: "projector.jpg", assignedTo: "Tech Team A" },
        { id: "GR-2024-002", title: "Projector Not Working", user: "Prof. Verma (Faculty)", dept: "IT Support", date: "2026-03-09", status: "Assigned", desc: "HDMI port seems loose in Room 402.", image: "projector.jpg", assignedTo: "Tech Team A" },
        { id: "GR-2024-003", title: "Hostel Food Quality", user: "Amit (Student)", dept: "Hostel", date: "2026-03-08", status: "Resolved", desc: "The dinner quality has degraded significantly.", image: null, assignedTo: "Warden Office" },
    ]);

    // 2. Mock Faculty List for Assignment
    const facultyList = [
        "K M Patel",
        "Hetalben Gevariya",
        "Bhavesh Oza",
        "Hitesh Rajput",
        "Hetal Pandya",
        "Amita Shah",
        "Shraddha Modi",
        "Reshma Dayma",
        "Maitrik Shah",
        "Pragnesh Patel",
        "Zishan Noorani",
        "Parth Dave",
        "Nikunjkumar Domadiya",
        "Payal Prajapati",
        "Archana Gondaliya",
        "Prachi Pancholi",
        "Pinal Salot",
        "Bhoomi Trivedi"
    ]

    // 3. States for UI Logic
    const [selectedGrievance, setSelectedGrievance] = useState(null); // For Modal
    const [showToast, setShowToast] = useState(false);

    // --- HANDLERS ---
    const handleAssign = (id, facultyName) => {
        const updated = grievances.map(g => {
            if (g.id === id) {
                return { ...g, assignedTo: facultyName, status: "Assigned" };
            }
            return g;
        });
        setGrievances(updated);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleFinalResolve = (id) => {
        const updated = grievances.map(g => (g.id === id ? { ...g, status: "Closed" } : g));
        setGrievances(updated);
        setSelectedGrievance(null);
    };

    return (
        <div className="adm-wrapper">
            {/* Toast Notification */}
            {showToast && <div className="adm-toast">Faculty Assigned Successfully!</div>}

            {/* --- NAVBAR --- */}
            <nav className="adm-nav">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={logo} alt="img" style={{ width: '50px' }} />
                    <div className="dash-nav-logo">Grievance Portal | Admin</div>
                </div>
                <div className="dash-nav-links">
                    <button className="adm-logout" onClick={() => navigate("/login")}>Logout</button>
                </div>
            </nav>

            <div className="adm-content">
                {/* --- SUMMARY CARDS --- */}
                <div className="adm-stats">
                    <div className="adm-stat-card"><h4>{grievances.length}</h4><p>Total</p></div>
                    <div className="adm-stat-card sky"><h4>{grievances.filter(g => g.status === "New").length}</h4><p>New</p></div>
                    <div className="adm-stat-card purple"><h4>{grievances.filter(g => g.status === "Assigned").length}</h4><p>Assigned</p></div>
                    <div className="adm-stat-card orange"><h4>{grievances.filter(g => g.status === "In Progress").length}</h4><p>In Progress</p></div>
                    <div className="adm-stat-card green"><h4>{grievances.filter(g => g.status === "Resolved" || g.status === "Closed").length}</h4><p>Resolved</p></div>
                </div>

                {/* --- MAIN TABLE --- */}
                <div className="adm-table-container">
                    <h3>All Submitted Grievances</h3>
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Subject</th>
                                <th>Assigned to</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grievances.map(g => (
                                <tr key={g.id}>
                                    <td><strong>{g.id}</strong></td>
                                    <td>{g.title}</td>
                                    <td>{g.assignedTo}</td>
                                    <td>{g.date}</td>
                                    <td><span className={`adm-badge ${g.status.toLowerCase().replace(" ", "")}`}>{g.status}</span></td>
                                    <td>
                                        <button className="adm-view-btn" onClick={() => setSelectedGrievance(g)}>View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- DETAIL MODAL --- */}
            {selectedGrievance && (
                <div className="adm-modal-overlay">
                    <div className="adm-modal">
                        <div className="adm-modal-header">
                            <h2>Grievance Details: {selectedGrievance.id}</h2>
                            <button className="adm-close-modal" onClick={() => setSelectedGrievance(null)}>&times;</button>
                        </div>
                        <div className="adm-modal-body">
                            <div className="adm-detail-row"><strong>Title:</strong> {selectedGrievance.title}</div>
                            <div className="adm-detail-row"><strong>From:</strong> {selectedGrievance.user}</div>
                            <div className="adm-detail-row"><strong>Description:</strong> <p>{selectedGrievance.desc}</p></div>
                            <div className="adm-detail-row"><strong>Image:</strong> <p>{selectedGrievance.image}</p></div>

                            <div className="adm-assign-section">
                                <label>Assign to Faculty:</label>
                                <select
                                    value={selectedGrievance.assignedTo}
                                    onChange={(e) => handleAssign(selectedGrievance.id, e.target.value)}
                                >
                                    <option value="">-- Choose Faculty --</option>
                                    {facultyList.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>

                            {selectedGrievance.status === "Resolved" && (
                                <button className="adm-resolve-btn" onClick={() => handleFinalResolve(selectedGrievance.id)}>
                                    Approve & Close Grievance
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;