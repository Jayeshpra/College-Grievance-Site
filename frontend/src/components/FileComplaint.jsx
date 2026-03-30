import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FileComplaint.css";

function FileComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    department: "",
    description: "",
    image: null
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔥 Use FormData for file upload
      const formPayload = new FormData();
      formPayload.append("subject", formData.subject);
      formPayload.append("department", formData.department);
      formPayload.append("description", formData.description);

      if (formData.image) {
        formPayload.append("image", formData.image);
      }

      const response = await fetch("http://127.0.0.1:8000/api/grievance/create/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formPayload
      });

      const data = await response.json();

      if (response.ok) {
        alert("Grievance submitted successfully");

        // 🔥 Redirect based on role
        if (role === "FACULTY") {
          navigate("/fac-dashboard");
        } else {
          navigate("/dashboard");
        }

      } else {
        alert("Error: " + JSON.stringify(data));
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="comp-page-wrapper">
      <div className="comp-form-container">
        <header className="comp-header">
          <h2>Submit a New Grievance</h2>
          <p>Please fill in the details below to report an issue.</p>
        </header>

        <form className="comp-main-form" onSubmit={handleSubmit}>
          
          {/* SUBJECT */}
          <div className="comp-input-box">
            <label>Title of Complaint</label>
            <input 
              type="text" 
              name="subject" 
              placeholder="e.g. Broken Fan in Room 302" 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* DEPARTMENT */}
          <div className="comp-input-box">
            <label>Target Department</label>
            <select name="department" onChange={handleChange} required>
              <option value="">-- Select Department --</option>
              <option value="Computer Department">Computer Department</option>
              <option value="IT Infrastructure">IT Infrastructure</option>
              <option value="Maintenance">Maintenance / Civil</option>
              <option value="Academic">Academic Affairs</option>
              <option value="Hostel">Hostel & Mess</option>
              <option value="Library">Library</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="comp-input-box">
            <label>Description</label>
            <textarea 
              name="description" 
              placeholder="Describe the issue in detail..." 
              onChange={handleChange} 
              required
            ></textarea>
          </div>

          {/* IMAGE */}
          <div className="comp-input-box">
            <label>Upload Evidence (Optional)</label>
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              onChange={handleChange} 
            />
          </div>

          {/* BUTTONS */}
          <div className="comp-button-group">
            <button type="submit" className="comp-submit-btn">
              Submit Complaint
            </button>

            <button 
              type="button" 
              className="comp-cancel-btn" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default FileComplaint;