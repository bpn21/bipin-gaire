import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCandidate } from "../hooks/candidate";
import {
  ArrowLeft,
  Mail,
  Briefcase,
  Calendar,
  Info,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ChevronDown,
} from "lucide-react";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidateById, getCandidates } = useCandidate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState({ items: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  const user = JSON.parse(localStorage.getItem("whoami"));

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

  useEffect(() => {
    if (id) {
      const fetchCandidate = async () => {
        setLoading(true);
        try {
          const res = await getCandidateById(id);
          setCandidate(res.data);
          setSearchTerm(res.data.name);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };
      fetchCandidate();
    } else {
      setCandidate(null);
      setSearchTerm("");
    }
  }, [id]);

  const handleSelectCandidate = (cand) => {
    setIsOpen(false);
    navigate(`/candidates/${cand.id}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "hired":
        return <CheckCircle size={16} color="#10b981" />;
      case "rejected":
        return <XCircle size={16} color="#ef4444" />;
      default:
        return <Clock size={16} color="#6366f1" />;
    }
  };

  return (
    <div className="candidate-detail-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <button
          onClick={() => navigate("/candidates")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "#f8fafc",
            cursor: "pointer",
            padding: "0",
          }}
        >
          <ArrowLeft size={20} />
          <span>Back to Candidates</span>
        </button>

        <div style={{ width: "400px", position: "relative" }} ref={dropdownRef}>
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <input
              type="text"
              className="form-input"
              placeholder="Search Candidate..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              autoComplete="off"
              style={{
                width: "100%",
                padding: "10px 16px",
                paddingRight: "40px",
                background: "#1e293b",
                border: "1px solid #b4bfceff",
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
                        candidate?.id === c.id
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
                        candidate?.id === c.id
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

      {loading && (
        <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
          Loading candidate details...
        </div>
      )}

      {candidate && !loading ? (
        <div className="animate-fade-in">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "40px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "36px",
                  fontWeight: "800",
                  marginBottom: "8px",
                }}
              >
                {candidate.name}
              </h1>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Mail size={16} /> {candidate.email}
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Briefcase size={16} />{" "}
                  {candidate.role_applied.replace("_", " ")}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "3px 10px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid #334155",
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {getStatusIcon(candidate.status)} {candidate.status}
                </span>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: "32px",
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "24px",
                fontSize: "18px",
                color: "#94a3b8",
              }}
            >
              <Info size={20} /> Candidate Information
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "32px",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "4px",
                    color: "#94a3b8",
                  }}
                >
                  Full Name
                </p>
                <p style={{ fontWeight: "600" }}>{candidate.name}</p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "4px",
                    color: "#94a3b8",
                  }}
                >
                  Email Address
                </p>
                <p style={{ fontWeight: "600" }}>{candidate.email}</p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "4px",
                    color: "#94a3b8",
                  }}
                >
                  Role Applied
                </p>
                <p style={{ fontWeight: "600", textTransform: "capitalize" }}>
                  {candidate.role_applied.replace("_", " ")}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "4px",
                    color: "#94a3b8",
                  }}
                >
                  Status
                </p>
                <p style={{ fontWeight: "600", textTransform: "capitalize" }}>
                  {candidate.status}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "4px",
                    color: "#94a3b8",
                  }}
                >
                  Applied On
                </p>
                <p style={{ fontWeight: "600" }}>
                  {new Date(candidate.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "4px",
                    color: "#94a3b8",
                  }}
                >
                  Score
                </p>
                <p style={{ fontWeight: "600" }}>
                  {candidate.scores[0]?.score || "N/A"}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "4px",
                    color: "#94a3b8",
                  }}
                >
                  Technical Skills
                </p>
                <p style={{ fontWeight: "600" }}>{candidate.skills || "N/A"}</p>
              </div>
            </div>

            <div style={{ marginTop: "40px" }}>
              <p
                style={{
                  fontSize: "14px",
                  marginBottom: "12px",
                  color: "#94a3b8",
                }}
              >
                Internal Notes
              </p>
              <div
                style={{
                  padding: "20px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "12px",
                  border: "1px solid #334155",
                  lineHeight: "1.6",
                  minHeight: "100px",
                }}
              >
                {candidate.internal_notes || "No internal notes available."}
              </div>
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div
            style={{ textAlign: "center", padding: "80px", color: "#475569" }}
          >
            <Search size={48} style={{ marginBottom: "16px", opacity: 0.2 }} />
            <p>Search for a candidate above to view their details.</p>
          </div>
        )
      )}
    </div>
  );
};

export default CandidateDetail;
