import React, { useState, useCallback } from "react";
import { useScoreStream } from "../hooks/candidate";
import { Activity, User, Award, Clock } from "lucide-react";

const StreamScores = () => {
  const [updates, setUpdates] = useState([]);

  const handleUpdate = useCallback((data) => {
    setUpdates((prev) => [data, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  useScoreStream(handleUpdate);

  return (
    <div className="stream-scores-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <h1 style={{ fontSize: "30px", fontWeight: "800" }}>Live Score Stream</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "rgba(16, 185, 129, 0.1)",
            color: "#10b981",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "#10b981",
              borderRadius: "50%",
              animation: "pulse 2s infinite",
            }}
          ></div>
          Live Connection
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {updates.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "48px",
              textAlign: "center",
              color: "#94a3b8",
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
          >
            <Activity size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
            <p>Waiting for live updates... Try updating a candidate's score.</p>
          </div>
        ) : (
          updates.map((update, index) => (
            <div
              key={index}
              className="card"
              style={{
                padding: "20px",
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Award size={24} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                  <span style={{ color: "#6366f1" }}>{update.reviewer_name}</span> updated score for{" "}
                  <span style={{ color: "#f8fafc" }}>{update.candidate_name}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    fontSize: "13px",
                    color: "#94a3b8",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    Category: <span style={{ color: "#f8fafc", textTransform: "capitalize" }}>{update.category.replace("_", " ")}</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={14} /> Just now
                  </span>
                </div>
              </div>

              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: update.score >= 4 ? "#10b981" : update.score <= 2 ? "#ef4444" : "#6366f1",
                  padding: "8px 16px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                }}
              >
                {update.score}/5
              </div>
            </div>
          ))
        )}
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.5; }
          }
          @keyframes slideIn {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default StreamScores;
