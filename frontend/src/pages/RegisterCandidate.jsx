import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCandidate } from "../hooks/candidate";

const RegisterCandidate = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role_applied: "software_engineer",
    status: "new",
    skills: "",
    internal_notes: "",
    initial_score: null,
  });
  const navigate = useNavigate();
  const { createCandidate, getCandidateById, updateCandidate } = useCandidate();
  const user = JSON.parse(localStorage.getItem("whoami"));

  useEffect(() => {
    if (isEditMode) {
      const fetchCandidate = async () => {
        try {
          const res = await getCandidateById(id);
          const { name, email, role_applied, status, internal_notes } =
            res.data;
          setFormData({
            name,
            email,
            role_applied,
            status,
            skills: skills || "",
            internal_notes: internal_notes || "",
            initial_score: 1,
          });
        } catch (error) {}
      };
      fetchCandidate();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "initial_score" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        const { initial_score, ...updateData } = formData;
        await updateCandidate(id, updateData);
      } else {
        await createCandidate(formData);
      }
      navigate("/candidates");
    } catch (error) {}
  };

  return (
    <div className="register-candidate-page">
      <h1
        style={{
          fontSize: "30px",
          fontWeight: "700",
          marginBottom: "32px",
        }}
      >
        {isEditMode ? "Edit Candidate" : "Register New Candidate"}
      </h1>

      <div className="card" style={{ padding: "32px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label
              htmlFor="name"
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Candidate Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#1e293b",
                border: "1px solid #334155",
                color: "#f8fafc",
                outline: "none",
              }}
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="email"
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="candidate@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#1e293b",
                border: "1px solid #334155",
                color: "#f8fafc",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            <div className="form-group">
              <label
                htmlFor="role_applied"
                style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Role Applied For
              </label>
              <select
                id="role_applied"
                name="role_applied"
                className="form-input"
                value={formData.role_applied}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#f8fafc",
                  outline: "none",
                }}
              >
                <option value="software_engineer">Software Engineer</option>
                <option value="front_end">Front End</option>
                <option value="back_end">Back End</option>
                <option value="project_manager">Project Manager</option>
              </select>
            </div>

            <div className="form-group">
              <label
                htmlFor="status"
                style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#f8fafc",
                  outline: "none",
                }}
              >
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {!isEditMode && (
            <div className="form-group">
              <label
                htmlFor="initial_score"
                style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Initial Overall Score
              </label>
              <select
                id="initial_score"
                name="initial_score"
                className="form-input"
                value={formData.initial_score || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#f8fafc",
                  outline: "none",
                }}
              >
                <option value="">Give Score</option>
                <option value="1">1</option>
                <option value="2">2 </option>
                <option value="3">3 </option>
                <option value="4">4 </option>
                <option value="5">5 </option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label
              htmlFor="skills"
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Technical Skills
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              className="form-input"
              placeholder="e.g. React, Python, AWS"
              required
              value={formData.skills}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#1e293b",
                border: "1px solid #334155",
                color: "#f8fafc",
                outline: "none",
              }}
            />
          </div>

          {user.role == "admin" && (
            <div className="form-group">
              <label
                htmlFor="internal_notes"
                style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Internal Notes
              </label>
              <textarea
                id="internal_notes"
                name="internal_notes"
                className="form-input"
                placeholder="Any initial thoughts or notes..."
                value={formData.internal_notes}
                onChange={handleChange}
                rows="4"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#f8fafc",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              ></textarea>
            </div>
          )}

          <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: "12px 24px",
                background: "#6366f1",
                color: "white",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              {isEditMode ? "Update Candidate" : "Add Candidate"}
            </button>
            {isEditMode && (
              <button
                type="button"
                className="btn"
                onClick={() => navigate("/candidates")}
                style={{
                  background: "transparent",
                  border: "1px solid #334155",
                  color: "#f8fafc",
                  padding: "12px 24px",
                  fontWeight: "600",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCandidate;
