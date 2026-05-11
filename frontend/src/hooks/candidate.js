import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const useCandidate = () => {
  const getCandidates = async (skip = 0, limit = 20, search = "") => {
    try {
      const response = await api.get(
        `/candidates/?skip=${skip}&limit=${limit}${search ? `&search=${search}` : ""}`,
      );
      return response;
    } catch (error) {
      toast.error("Failed to fetch candidates");
      throw error;
    }
  };

  const getCandidateById = async (id) => {
    try {
      const response = await api.get(`/candidates/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getCandidatesSummary = async () => {
    try {
      const response = await api.get("/candidates/summary");
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getCandidateScore = async (id) => {
    try {
      const response = await api.get(`/candidates/${id}/scores`);
      return response;
    } catch (error) {
      toast.error("Failed to fetch candidate score");
      throw error;
    }
  };

  const addCandidateScore = async (id, data) => {
    try {
      const response = await api.post(`/candidates/${id}/scores`, data);
      toast.success("Score added successfully");
      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to add candidate score",
      );
      throw error;
    }
  };

  const createCandidate = async (data) => {
    try {
      const response = await api.post("/candidates/", data);
      toast.success("Candidate registered successfully");
      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to register candidate",
      );
      throw error;
    }
  };

  const updateCandidate = async (id, data) => {
    try {
      const response = await api.patch(`/candidates/${id}`, data);
      toast.success("Candidate updated successfully");
      return response;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update candidate");
      throw error;
    }
  };

  const generateCandidateSummary = async (id, style = "concise") => {
    try {
      const response = await api.post(`/candidates/${id}/summary`, { style });
      toast.success("Summary generated successfully");
      return response;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to generate summary");
      throw error;
    }
  };

  const deleteCandidate = async (id) => {
    try {
      await api.delete(`/candidates/${id}`);
      toast.success("Candidate archived successfully");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete candidate");
      throw error;
    }
  };

  return {
    getCandidates,
    getCandidateById,
    getCandidatesSummary,
    getCandidateScore,
    addCandidateScore,
    createCandidate,
    updateCandidate,
    generateCandidateSummary,
    deleteCandidate,
  };
};

export const useScoreStream = (onUpdate) => {
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/ws/scores`;

    console.log("Connecting to WebSocket:", wsUrl);
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const data = JSON.parse(event.data);
      if (onUpdate) {
        onUpdate(data);
      }
    };

    socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket Disconnected", event.code, event.reason);
    };

    return () => {
      socket.close();
    };
  }, [onUpdate]);
};
