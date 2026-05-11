import React, { useState, useEffect } from 'react';
import { useCandidate } from '../hooks/candidate';
import { FileText, Sparkles, ChevronDown, Search } from 'lucide-react';

const Summary = () => {
  const [candidates, setCandidates] = useState({ items: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getCandidatesSummary, getCandidates, getCandidateById } = useCandidate();
  const dropdownRef = React.useRef(null);

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
    if (!selectedCandidate && searchTerm === "") {
      fetchGlobalSummary();
    }
  }, [selectedCandidate, searchTerm]);

  const handleSelectCandidate = async (candidate) => {
    setSelectedCandidate(candidate);
    setSearchTerm(candidate.name);
    setIsOpen(false);
    
    setLoading(true);
    try {
      const res = await getCandidateById(candidate.id);
      setSummaryData({ summary: res.data.internal_notes || "No specific insights available for this candidate." });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summary-page">
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '2rem' }}>Candidate Insights</h1>

      <div
        className="card"
        style={{
          padding: "2rem",
          marginBottom: "2rem",
          background: "#1e293b",
          border: "1px solid #334155",
        }}
      >
        <div
          className="form-group"
          style={{ marginBottom: 0, position: "relative" }}
          ref={dropdownRef}
        >
          <label style={{ color: "#94a3b8", marginBottom: "8px", display: "block", fontSize: "14px" }}>
            Select Candidate for Individual Insight
          </label>
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <input
              type="text"
              className="form-input"
              placeholder="Search Candidate (leave empty for global summary)"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isOpen) setIsOpen(true);
                if (e.target.value === "") setSelectedCandidate(null);
              }}
              autoComplete="off"
              style={{
                width: "100%",
                padding: "12px 16px",
                paddingRight: "40px",
                background: "#0f172a",
                border: "1px solid #334155",
                color: "#f8fafc",
                borderRadius: "6px",
                outline: "none",
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
      </div>

      <div className="card" style={{ padding: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', lineHeight: '1.8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Sparkles color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>AI-Generated Insights</h2>
        </div>

        {summaryData ? (
          <div style={{ fontSize: '1.125rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
            {summaryData.summary}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>No summary data available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
