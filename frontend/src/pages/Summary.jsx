import React, { useState, useEffect } from "react";
import { useCandidate } from "../hooks/candidate";
import { FileText, Sparkles, ChevronDown, Search } from "lucide-react";
import CandidateSearch from "../components/CandidateSearch";

const Summary = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getCandidatesSummary, getCandidateById, generateCandidateSummary } =
    useCandidate();
  const dropdownRef = React.useRef(null);

  const fetchGlobalSummary = async () => {
    setLoading(true);
    try {
      const res = await getCandidatesSummary();
      setSummaryData(res.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCandidate) {
      fetchGlobalSummary();
    }
  }, [selectedCandidate]);

  const handleSelectCandidate = async (candidate) => {
    setSelectedCandidate(candidate);
    setSearchTerm(candidate.name);
    setIsOpen(false);

    setLoading(true);
    try {
      const res = await getCandidateById(candidate.id);
      setSummaryData({
        summary: res.data.ai_summary,
        internalNotes: res.data.internal_notes,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async (style = "concise") => {
    if (!selectedCandidate) return;
    setLoading(true);
    try {
      const res = await generateCandidateSummary(selectedCandidate.id, style);
      setSummaryData({
        summary: res.data.ai_summary,
        internalNotes: res.data.internal_notes,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summary-page">
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: "700",
          marginBottom: "2rem",
        }}
      >
        Candidate Insights
      </h1>

      <div
        className="card"
        style={{
          padding: "2rem",
          marginBottom: "2rem",
          background: "#1e293b",
          border: "1px solid #334155",
        }}
      >
        <CandidateSearch
          onSelect={handleSelectCandidate}
          label="Select Candidate for Individual Insight"
        />
      </div>

      <div
        className="card"
        style={{
          padding: "2.5rem",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          lineHeight: "1.8",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          <Sparkles color="var(--primary)" />
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700" }}>
            AI-Generated Insights
          </h2>
        </div>

        {summaryData ? (
          <div>
            <div
              style={{
                fontSize: "1.125rem",
                color: "var(--text-main)",
                whiteSpace: "pre-wrap",
                marginBottom: "2rem",
              }}
            >
              {summaryData.summary ||
                summaryData.internalNotes ||
                "No specific insights available for this candidate."}
            </div>

            {selectedCandidate && (
              <button
                onClick={() => handleGenerateSummary()}
                disabled={loading}
                className="btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                <Sparkles size={18} />
                {summaryData.summary
                  ? "Regenerate AI Summary"
                  : "Generate AI Summary"}
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--text-muted)",
            }}
          >
            <FileText
              size={48}
              style={{ marginBottom: "1rem", opacity: 0.2 }}
            />
            <p>No summary data available at this time.</p>
            {selectedCandidate && (
              <button
                onClick={() => handleGenerateSummary()}
                disabled={loading}
                className="btn-primary"
                style={{
                  marginTop: "1.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                <Sparkles size={18} />
                Generate AI Summary
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
