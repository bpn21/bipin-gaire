import React, { useState, useEffect, useRef } from "react";
import { useCandidate } from "../hooks/candidate";
import { Star, Send, Search, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import CandidateSearch from "../components/CandidateSearch";

const SetScore = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [formData, setFormData] = useState({
    candidate_id: "",
    category: "software_engineer",
    score: 3,
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const { addCandidateScore } = useCandidate();
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "score" ? parseInt(value) : value,
    }));
  };

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setFormData((prev) => ({
      ...prev,
      candidate_id: candidate ? candidate.id : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.candidate_id) return;

    setLoading(true);
    try {
      const { candidate_id, ...scoreData } = formData;
      await addCandidateScore(candidate_id, scoreData);
      setFormData({
        candidate_id: "",
        category: "software_engineer",
        score: 3,
        note: "",
      });
      setSearchTerm("");
      setSelectedCandidate(null);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="set-score-page">
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: "700",
          marginBottom: "2rem",
          color: "#f8fafc",
        }}
      >
        Set Candidate Score
      </h1>

      <div
        className="card"
        style={{
          padding: "2.5rem",
          background: "#1e293b",
          border: "1px solid #334155",
        }}
      >
        <form onSubmit={handleSubmit}>
          <CandidateSearch onSelect={handleSelectCandidate} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-input"
                disabled
                value={formData.category}
                onChange={handleChange}
                required
                style={{ background: "#0f172a", cursor: "not-allowed" }}
              >
                <option value="software_engineer">Software Engineer</option>
                <option value="front_end">Front End</option>
                <option value="back_end">Back End</option>
                <option value="project_manager">Project Manager</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="score">Score (1-5)</label>
              <select
                id="score"
                name="score"
                className="form-input"
                value={formData.score}
                onChange={handleChange}
                required
                style={{ background: "#0f172a" }}
              >
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note">Assessment Notes</label>
            <textarea
              id="note"
              name="note"
              className="form-input"
              placeholder="Provide detailed feedback on the candidate's performance..."
              value={formData.note}
              onChange={handleChange}
              rows="5"
              style={{ resize: "vertical", background: "#0f172a" }}
            ></textarea>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formData.candidate_id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                width: "100%",
                padding: "1rem",
                background: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: !formData.candidate_id ? "not-allowed" : "pointer",
                opacity: !formData.candidate_id ? 0.5 : 1,
              }}
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <Send size={18} /> Submit Score
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetScore;
