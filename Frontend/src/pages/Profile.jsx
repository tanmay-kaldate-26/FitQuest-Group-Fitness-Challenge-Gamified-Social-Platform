import "./Profile.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import api from "../services/api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ GENERATE DYNAMIC GRAPH DATA
  // Since we don't have a history API yet, we simulate a curve based on User ID
  const graphPath = useMemo(() => {
    if (!user) return "";
    // Create pseudo-random bounce based on ID
    const seed = user.id || 1; 
    const p1 = 100 - (seed % 40);
    const p2 = 60 + (seed % 30);
    const p3 = 40; 
    
    // SVG Path Command (C = Curve)
    return `M0,120 C80,${p1} 160,${p2} 240,80 S400,${p3} 500,60`;
  }, [user]);

  if (loading) return <div className="loading-screen">Loading Profile...</div>;
  if (!user) return <div className="error-screen">Failed to load profile.</div>;

  // 1. Calculate Level (1000 points = 1 Level)
  const level = Math.max(1, Math.floor((user.totalPoints || 0) / 1000) + 1);
  
  // 2. Format Date Safely
  const joinedDate = user.joinedAt 
    ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: 'long', year: 'numeric' }) 
    : "Recently";

  // 3. Estimate Weekly Stats (Visual only until backend supports history)
  const estimatedWeeklyPoints = Math.floor((user.totalPoints || 0) * 0.15) + 50; 

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        
        {/* HEADER CARD */}
        <div className="profile-header-card">
          <div className="profile-info-left">
            <div className="big-avatar">{user.fullName?.charAt(0).toUpperCase() || "U"}</div>
            <div>
              <div className="name-row">
                <h1>{user.fullName}</h1>
                <span className="level-badge">Level {level}</span>
              </div>
              <p className="bio">{user.bio || "No bio yet. Click Edit to add one!"}</p>
              <div className="quick-badges">
                <span>🏆 {user.challengesCompleted || 0} Challenges Completed</span>
                <span>🔥 {user.currentStreak || 0} Day Streak</span>
              </div>
            </div>
          </div>
          <button className="edit-profile-btn" onClick={() => navigate("/settings")}>
            ✏️ Edit Profile
          </button>
        </div>

        {/* STATS GRID */}
        <div className="profile-stats-grid">
          <div className="stat-card-p icon-purple">
            <div className="icon-circle">🏆</div>
            <div>
              <p>Total Challenges</p>
              <h3>{user.challengesCompleted || 0}</h3>
            </div>
          </div>
          <div className="stat-card-p icon-orange">
            <div className="icon-circle">⭐</div>
            <div>
              <p>Total Points</p>
              <h3>{(user.totalPoints || 0).toLocaleString()}</h3>
            </div>
          </div>
          <div className="stat-card-p icon-red">
            <div className="icon-circle">🔥</div>
            <div>
              <p>Best Streak</p>
              <h3>{user.currentStreak || 0} Days</h3>
            </div>
          </div>
          <div className="stat-card-p icon-green">
            <div className="icon-circle">📅</div>
            <div>
              <p>Joined</p>
              <h3>{joinedDate}</h3>
            </div>
          </div>
        </div>

        {/* ACTIVITY & WEEKLY SUMMARY ROW */}
        <div className="profile-bottom-row">
          
          {/* ACTIVITY CHART */}
          <div className="activity-card">
            <div className="card-header-p">
              <div>
                <h3>Activity Summary</h3>
                <p className="sub-text">Your daily points this week</p>
              </div>
              <span className="trend-up">↗ +15%</span>
            </div>
            
            <div className="graph-container">
               <svg viewBox="0 0 500 150" className="chart-svg" preserveAspectRatio="none">
                 <defs>
                   <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                     <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                     <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                   </linearGradient>
                 </defs>
                 {/* Filled Area (Dynamic) */}
                 <path 
                   d={`${graphPath} L500,150 L0,150 Z`} 
                   fill="url(#chartGradient)" 
                 />
                 {/* Stroke Line (Dynamic) */}
                 <path 
                   d={graphPath} 
                   fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"
                 />
               </svg>
               <div className="x-axis">
                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
               </div>
            </div>
          </div>

          {/* WEEKLY STATS */}
          <div className="weekly-summary">
            <h3>🌀 This Week</h3>
            <div className="summary-item">
              <p>Points Earned</p>
              <h2>+{estimatedWeeklyPoints}</h2>
            </div>
            <div className="summary-item">
              <p>Check-ins</p>
              <h2>{Math.min(user.currentStreak, 7)} / 7 ✓</h2>
            </div>
            <div className="summary-item">
              <p>Status</p>
              <h2>Active 🟢</h2>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}