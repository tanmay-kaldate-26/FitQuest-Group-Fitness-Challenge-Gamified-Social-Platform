// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Challenges from "./pages/Challenges";
import ChallengeDetails from "./pages/ChallengeDetails";
import CreateChallenge from "./pages/CreateChallenge";
import Leaderboard from "./pages/Leaderboard";
import Chat from "./pages/Chat";
import CreateChat from "./pages/CreateChat";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Badges from "./pages/Badges";
import CheckIn from "./pages/CheckIn";


import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <Challenges />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challenges/:id"
        element={
          <ProtectedRoute>
            <ChallengeDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challenges/create"
        element={
          <ProtectedRoute>
            <CreateChallenge />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/new"
        element={
          <ProtectedRoute>
            <CreateChat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/settings" element={<Settings />} />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/badges"
        element={
          <ProtectedRoute>
            <Badges />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkin"
        element={
          <ProtectedRoute>
            <CheckIn />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
