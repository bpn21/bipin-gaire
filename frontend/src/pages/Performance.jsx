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
import CandidateSearch from "../components/CandidateSearch";

const Performance = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getCandidateScore } = useCandidate();
  const dropdownRef = React.useRef(null);
  const user = useSelector((state) => state.auth.user);

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
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
        <div style={{ flex: 1 }}>
          <CandidateSearch
            onSelect={handleSelectCandidate}
            style={{ marginBottom: 0 }}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSeeScore}
          disabled={!selectedCandidate || loading}
          style={{
            width: "auto",
            padding: "12px 24px",
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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
