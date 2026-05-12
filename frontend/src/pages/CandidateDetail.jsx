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
import CandidateSearch from "../components/CandidateSearch";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidateById, getCandidates } = useCandidate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = React.useRef(null);
  const user = JSON.parse(localStorage.getItem("whoami"));

  useEffect(() => {
    if (id) {
      const fetchCandidate = async () => {
        setLoading(true);
        try {
          const res = await getCandidateById(id);
          setCandidate(res.data);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };
      fetchCandidate();
    } else {
      setCandidate(null);
    }
  }, [id]);

  const handleSelectCandidate = (cand) => {
    if (cand) {
      navigate(`/candidates/${cand.id}`);
    } else {
      navigate(`/candidates`);
    }
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

        <div style={{ width: "400px" }}>
          <CandidateSearch
            onSelect={handleSelectCandidate}
            placeholder="Search Candidate..."
          />
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
            <div style={{ marginTop: "40px" }}>
              <p
                style={{
                  fontSize: "14px",
                  marginBottom: "12px",
                  color: "#94a3b8",
                }}
              >
                Notes (option)
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
                {candidate.scores?.[0]?.note || "No internal notes available."}
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
