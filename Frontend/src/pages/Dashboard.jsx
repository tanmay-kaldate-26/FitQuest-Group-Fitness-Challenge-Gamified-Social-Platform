import "./Dashboard.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { getBadgeStyle } from "../utils/badgeMapper";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPoints: 0,
    streak: 0,
    activeChallengesCount: 0,
    globalRank: 0,
    badges: [],            
    activeChallenges: [],  
    completedChallenges: [] 
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back! 💪</h1>
          <p>Here is your daily activity overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card dashboard-card">
            <div className="stat-icon fire">🔥</div>
            <div>
              <p>Current Streak</p>
              <h3>{stats.streak} Days</h3>
            </div>
          </div>

          <div className="stat-card dashboard-card">
            <div className="stat-icon star">⭐</div>
            <div>
              <p>Total Points</p>
              <h3>{stats.totalPoints}</h3>
            </div>
          </div>

          <div className="stat-card dashboard-card">
            <div className="stat-icon trophy">🏆</div>
            <div>
              <p>Active Challenges</p>
              <h3>{stats.activeChallengesCount}</h3>
            </div>
          </div>

          <div className="stat-card dashboard-card">
            <div className="stat-icon target">🎯</div>
            <div>
              <p>Global Rank</p>
              <h3>#{stats.globalRank}</h3>
            </div>
          </div>
        </div>

        <div className="row">
          {/* ✅ CHECK-IN CARD (Updated Structure) */}
          <div className="card checkin-card dashboard-card">
            <div className="card-header">
              <div><h4>Daily Check-in</h4><p>Mark your daily progress</p></div>
              <button className="primary-btn" onClick={() => navigate("/checkin")}>Check In</button>
            </div>
            <div className="checkin-options">
              <div className="checkin-option" onClick={() => navigate("/checkin?type=running")}>
                <div className="option-icon run">🏃</div>
                <div className="option-info">
                  <h5>Running</h5>
                  <p>Track your run</p>
                </div>
              </div>
              <div className="checkin-option" onClick={() => navigate("/checkin?type=yoga")}>
                <div className="option-icon yoga">🧘</div>
                <div className="option-info">
                  <h5>Yoga</h5>
                  <p>Log a session</p>
                </div>
              </div>
              <div className="checkin-option" onClick={() => navigate("/checkin?type=steps")}>
                <div className="option-icon steps">🚶</div>
                <div className="option-info">
                  <h5>Steps</h5>
                  <p>Sync daily steps</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Widget */}
          <div className="card dashboard-card">
            <div className="card-header"><h4>My Latest Badges</h4></div>
            
            <div className="badges-list-row">
              {stats.badges && stats.badges.length > 0 ? (
                stats.badges.slice(0, 3).map((badgeCode, index) => {
                  const style = getBadgeStyle(badgeCode);
                  return (
                    <div key={index} className="mini-badge">
                      <span className="mb-icon">{style.icon}</span>
                      <span className="mb-name">{style.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="no-badges">No badges yet.</div>
              )}
            </div>
            
            <button className="outline-btn" style={{marginTop: '15px'}} onClick={() => navigate("/badges")}>
              View All
            </button>
          </div>
        </div>

        <div className="row">
          {/* Active Challenges List */}
          <div className="card dashboard-card">
            <div className="card-header">
              <h4>Active Challenges</h4>
              <span className="link" onClick={() => navigate("/challenges")}>View All</span>
            </div>

            {stats.activeChallenges && stats.activeChallenges.length > 0 ? (
              stats.activeChallenges.map((challenge) => (
                <div className="challenge-item" key={challenge.id}>
                  <div className="chal-info">
                    <strong>{challenge.name}</strong>
                    <span>{challenge.daysLeft} days left · {challenge.participants} participants</span>
                  </div>
                  <div className="chal-progress-bar">
                    <div className="chal-fill" style={{ width: `${challenge.progress}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No active challenges found.</p>
                <button className="text-btn" onClick={() => navigate("/challenges")}>Find a Challenge</button>
              </div>
            )}
          </div>

          {/* Completed Challenges */}
          <div className="right-column">
            <div className="card dashboard-card">
              <h4>Recently Completed</h4>
              {stats.completedChallenges && stats.completedChallenges.length > 0 ? (
                 stats.completedChallenges.map((comp) => (
                  <div key={comp.id} className="completed-item">
                    <span>✔ {comp.name}</span>
                  </div>
                 ))
              ) : (
                 <p className="sub-text">Finish a challenge to see it here!</p>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;