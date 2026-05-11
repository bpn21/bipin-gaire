import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useCandidate } from "../hooks/candidate";

const CandidateSearch = ({
  onSelect,
  label = "Select Candidate",
  placeholder = "Search Candidate",
  style = {},
}) => {
  const [candidates, setCandidates] = useState({ items: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const dropdownRef = useRef(null);
  const { getCandidates } = useCandidate();

  const fetchCandidates = async (search = "") => {
    try {
      const res = await getCandidates(0, 5, search);
      setCandidates(res.data);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    }
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

  const handleSelect = (candidate) => {
    setSelectedCandidate(candidate);
    setSearchTerm(candidate.name);
    setIsOpen(false);
    if (onSelect) {
      onSelect(candidate);
    }
  };

  return (
    <div
      className="form-group"
      style={{ position: "relative", ...style }}
      ref={dropdownRef}
    >
      <label
        style={{
          color: "#94a3b8",
          marginBottom: "8px",
          display: "block",
          fontSize: "14px",
        }}
      >
        {label}
      </label>
      <div
        style={{ position: "relative", cursor: "pointer" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          className="form-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && onSelect) {
              setSelectedCandidate(null);
              onSelect(null);
            }
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
                onClick={() => handleSelect(c)}
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
                  (e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    selectedCandidate?.id === c.id
                      ? "rgba(99, 102, 241, 0.1)"
                      : "transparent")
                }
              >
                <div style={{ fontWeight: "600", color: "#f8fafc" }}>
                  {c.name}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {c.email} • {c.role_applied?.replace("_", " ")}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{ padding: "16px", textAlign: "center", color: "#94a3b8" }}
            >
              No candidates found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;
