import React, { useState, useEffect } from "react";
import { useCandidate } from "../hooks/candidate";
import {
  Star,
  TrendingUp,
  User,
  ChevronRight,
  Search,
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";

const Performance = () => {
  const [candidates, setCandidates] = useState({ items: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getCandidates, getCandidateScore } = useCandidate();
  const dropdownRef = React.useRef(null);
  const user = useSelector((state) => state.auth.user);

  const fetchCandidates = async (search = "") => {
    try {
      const res = await getCandidates(0, 5, search);
      setCandidates(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCandidates(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setSearchTerm(candidate.name);
    setIsOpen(false);
  };

  const handleSeeScore = async () => {
    if (!selectedCandidate) return;
    setLoading(true);
    try {
      const res = await getCandidateScore(selectedCandidate.id);
      setScores(res.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="performance-page">
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: "700",
          marginBottom: "2rem",
        }}
      >
        Candidate Performance
      </h1>

      <div
        className="card"
        style={{
          padding: "2rem",
          marginBottom: "2rem",
          display: "flex",
          gap: "1rem",
          alignItems: "flex-end",
        }}
      >
        <div
          className="form-group"
          style={{ marginBottom: 0, flex: 1, position: "relative" }}
          ref={dropdownRef}
        >
          <label>Select Candidate</label>
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <input
              type="text"
              className="form-input"
              placeholder="Search Candidate"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              autoComplete="off"
              style={{
                paddingRight: "40px",
                background: "#0f172a",
                borderColor: isOpen ? "#6366f1" : "#334155",
              }}
            />
            <ChevronDown
              size={18}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: `translateY(-50%) rotate(${isOpen ? "180deg" : "0deg"})`,
                color: "#94a3b8",
                transition: "transform 0.2s",
              }}
            />
          </div>

          {isOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                marginTop: "8px",
                zIndex: 50,
                maxHeight: "250px",
                overflowY: "auto",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
            >
              {candidates.items?.length > 0 ? (
                candidates.items.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCandidate(c)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      background:
                        selectedCandidate?.id === c.id
                          ? "rgba(99, 102, 241, 0.1)"
                          : "transparent",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "rgba(255, 255, 255, 0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background =
                        selectedCandidate?.id === c.id
                          ? "rgba(99, 102, 241, 0.1)"
                          : "transparent")
                    }
                  >
                    <div style={{ fontWeight: "600", color: "#f8fafc" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                      {c.email} • {c.role_applied.replace("_", " ")}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No candidates found
                </div>
              )}
            </div>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSeeScore}
          disabled={!selectedCandidate || loading}
          style={{ width: "auto", padding: "0.75rem 1.5rem" }}
        >
          {loading ? "Loading..." : "See Score"}
        </button>
      </div>

      {scores && (
        <div className="card animate-fade-in" style={{ padding: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <TrendingUp color="var(--primary)" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700" }}>
              Score Details
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              fontSize: "250px",
              textAlign: "center",
              fontWeight: "bold",
              color: "var(--primary)",
            }}
          >
            {scores?.[0]?.score}
          </div>
          {user?.role === "admin" && (
            <p style={{ fontSize: "20px" }}>Note: {scores?.[0]?.note}</p>
          )}
          {((Array.isArray(scores) && scores.length === 0) || !scores) && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
              }}
            >
              No scores recorded for this candidate yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Performance;
