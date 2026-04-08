import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import logo from "../assets/logo.png";

function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toUpperCase().trim();

  const handleProtectedRoute = (type) => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (role === "FACULTY") {
      if (type === "submit") {
        navigate("/add-complaint");  
      } else {
        navigate("/fac-dashboard");   
      }
      return;
    }

    if (role === "ADMIN") {
      if (type === "submit") {
        navigate("/add-complaint")
      } else {
        navigate("/admin-dashboard")
      }
      return;
    }

    if (type === "submit") {
      navigate("/add-complaint");
    } else if (type === "status") {
      navigate("/dashboard");
    } else if (type === "profile") {
      navigate("/profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
    window.location.reload();
  };

  return (
    <div className="home-container">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="img" style={{ width: "70px" }} />
          <div className="logo">L. D. College of Engineering</div>
        </div>

        <div className="nav-right">

          {!token ? (
            <>
              <Link to="/login">
                <button className="nav-btn home-login-btn">Login</button>
              </Link>

              <Link to="/register">
                <button className="nav-btn home-register-btn">Register</button>
              </Link>
            </>
          ) : (
            <>
              <button
                className="nav-btn home-login-btn"
                onClick={() => handleProtectedRoute("profile")}
              >
                Profile
              </button>

              <button
                className="nav-btn home-register-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          <Link to="/about">
            <button className="nav-btn home-about-btn">About</button>
          </Link>

        </div>
      </nav>


      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <h1>Your Voice Matters. We Are Listening.</h1>
        <p>
          A transparent and fair grievance redressal system designed to support students and faculty.
        </p>

        <div className="hero-buttons">

          <button
            className="primary-btn"
            onClick={() => handleProtectedRoute("submit")}
          >
            Submit Grievance
          </button>

          <button
            className="secondary-btn"
            onClick={() => handleProtectedRoute("status")}
          >
            Check Status
          </button>

        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="how-it-works">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <h3>1. Submit</h3>
            <p>Fill out the grievance form and attach relevant photo.</p>
          </div>

          <div className="step">
            <h3>2. Forward</h3>
            <p>The system forwards it to the appropriate department.</p>
          </div>

          <div className="step">
            <h3>3. Investigate</h3>
            <p>The admin reviews and takes necessary action.</p>
          </div>

          <div className="step">
            <h3>4. Resolve</h3>
            <p>You are notified once your grievance is resolved.</p>
          </div>
        </div>
      </section>


      {/* ================= FAQ ================= */}
      <section className="faq">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-item">
          <h4>Is my complaint anonymous?</h4>
          <p>Your complaint is confidential and visible only to the designated committee.</p>
        </div>

        <div className="faq-item">
          <h4>Who will see my complaint?</h4>
          <p>Only the assigned department admin and grievance committee can view it.</p>
        </div>

        <div className="faq-item">
          <h4>How long does it take to resolve?</h4>
          <p>Most grievances are resolved within 48–72 hours.</p>
        </div>
      </section>

    </div>
  );
}

export default Home;