import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidate } from "../hooks/candidate";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Candidates = () => {
  const [candidatesData, setCandidatesData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const limit = 20;
  const { getCandidates, deleteCandidate } = useCandidate();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const computedCandidate = useMemo(() => {
    return candidatesData.items?.filter(
      (e) =>
        e.name.toLowerCase().includes(search?.toLowerCase()) ||
        e.email.toLowerCase().includes(search?.toLowerCase()) ||
        e.role_applied.toLowerCase().includes(search?.toLowerCase()) ||
        e.skills?.toLowerCase().includes(search?.toLowerCase()) ||
        e.status.toLowerCase().includes(search?.toLowerCase()),
    );
  }, [candidatesData, search]);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const res = await getCandidates(skip, limit);
        setCandidatesData(res.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [skip]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await deleteCandidate(id);
        // Refresh the list
        const res = await getCandidates(skip, limit);
        setCandidatesData(res.data);
      } catch (error) {
        console.error("Failed to delete candidate:", error);
      }
    }
  };

  const handleNext = () => {
    if (skip + limit < candidatesData.total) {
      setSkip(skip + limit);
    }
  };

  const handlePrev = () => {
    if (skip - limit >= 0) {
      setSkip(skip - limit);
    }
  };

  if (loading && candidatesData.items.length === 0) {
    return (
      <div className="loading" style={{ color: "#f8fafc", padding: "24px" }}>
        Loading candidates...
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "hired":
        return { background: "rgba(16, 185, 129, 0.1)", color: "#10b981" };
      case "rejected":
        return { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" };
      case "reviewed":
        return { background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" };
      default:
        return { background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" };
    }
  };

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(candidatesData.total / limit) || 1;

  return (
    <div className="candidates-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc" }}>
          List Of Candidates
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <input
            className="form-input"
            onChange={handleSearch}
            style={{
              padding: "10px 16px",
              width: "300px",
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#f8fafc",
              borderRadius: "6px",
              outline: "none",
            }}
            placeholder="Search candidates..."
          />
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: "0px",
          overflow: "hidden",
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderBottom: "1px solid #334155",
              }}
            >
              <th
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#94a3b8",
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#94a3b8",
                }}
              >
                Email
              </th>
              <th
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#94a3b8",
                }}
              >
                Role Applied
              </th>
              <th
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#94a3b8",
                }}
              >
                Skills
              </th>
              {/* <th
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#94a3b8",
                }}
              >
                Score
              </th> */}
              <th
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#94a3b8",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#94a3b8",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            style={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.2s" }}
          >
            {computedCandidate.map((candidate) => (
              <tr
                key={candidate.id}
                style={{
                  borderBottom: "1px solid #334155",
                  transition: "background 0.2s",
                }}
                className="table-row"
              >
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ fontWeight: "600", color: "#f8fafc" }}>
                    {candidate.name}
                  </div>
                </td>
                <td style={{ padding: "16px 24px", color: "#94a3b8" }}>
                  {candidate.email}
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    textTransform: "capitalize",
                    color: "#f8fafc",
                  }}
                >
                  {candidate.role_applied.replace("_", " ")}
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    color: "#94a3b8",
                    fontSize: "13px",
                  }}
                >
                  {candidate.skills || "N/A"}
                </td>
                {/* <td style={{ padding: "16px 24px", color: "#f8fafc" }}>
                  {candidate.scores?.[0]?.score || "N/A"}
                </td> */}
                <td style={{ padding: "16px 24px" }}>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "capitalize",
                      ...getStatusStyle(candidate.status),
                    }}
                  >
                    {candidate.status || "New"}
                  </span>
                </td>
                <td
                  style={{ padding: "16px 24px", display: "flex", gap: "16px" }}
                >
                  <button
                    onClick={() => navigate(`/candidates/${candidate.id}`)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6366f1",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    View Detail
                  </button>
                  <button
                    onClick={() => navigate(`/add-candidate/${candidate.id}`)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(candidate.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {computedCandidate.length === 0 && !loading && (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "48px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 8px",
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "12px",
            flex: 1,
          }}
        >
          <button
            onClick={handlePrev}
            disabled={skip === 0 || loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px 16px",
              background: skip === 0 ? "transparent" : "#1e293b",
              border: "1px solid #334155",
              color: skip === 0 ? "#475569" : "#f8fafc",
              borderRadius: "6px",
              cursor: skip === 0 ? "not-allowed" : "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <div style={{ minWidth: "80px", textAlign: "center" }}>
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={handleNext}
            disabled={skip + limit >= candidatesData.total || loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px 16px",
              background:
                skip + limit >= candidatesData.total
                  ? "transparent"
                  : "#1e293b",
              border: "1px solid #334155",
              color:
                skip + limit >= candidatesData.total ? "#475569" : "#f8fafc",
              borderRadius: "6px",
              cursor:
                skip + limit >= candidatesData.total
                  ? "not-allowed"
                  : "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
