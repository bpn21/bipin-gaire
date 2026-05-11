import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import InfoLayout from "./layouts/InfoLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Candidates from "./pages/Candidates";
import RegisterCandidate from "./pages/RegisterCandidate";
import CandidateDetail from "./pages/CandidateDetail";
import Performance from "./pages/Performance";
import Summary from "./pages/Summary";
import SetScore from "./pages/SetScore";
import StreamScores from "./pages/StreamScores";
import { Provider } from "react-redux";
import { store } from "./store";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<InfoLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/search-candidate" element={<CandidateDetail />} />
            <Route path="/candidates/:id?" element={<CandidateDetail />} />
            <Route path="/add-candidate/:id?" element={<RegisterCandidate />} />

            <Route path="/performance" element={<Performance />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/set-score" element={<SetScore />} />
            <Route path="/stream-scores" element={<StreamScores />} />
            <Route
              path="/team"
              element={
                <div className="card">
                  <h1>Team Page</h1>
                  <p>Manage your team here.</p>
                </div>
              }
            />

            <Route
              path="/analytics"
              element={
                <div className="card">
                  <h1>Analytics</h1>
                  <p>View your data insights.</p>
                </div>
              }
            />
            <Route
              path="/messages"
              element={
                <div className="card">
                  <h1>Messages</h1>
                  <p>Inbox and notifications.</p>
                </div>
              }
            />
            <Route
              path="/settings"
              element={
                <div className="card">
                  <h1>Settings</h1>
                  <p>Configure your preferences.</p>
                </div>
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
