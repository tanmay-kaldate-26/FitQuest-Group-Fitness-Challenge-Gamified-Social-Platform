import "./ChallengeDetails.css";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { getChallengeImage } from "./Challenges"; 

export default function ChallengeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  
  // const [participants, setParticipants] = useState([]);
  // const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/challenges/${id}`);
        setChallenge(res.data);
        
        const myRes = await api.get("/challenges/my");
        const myChallenge = myRes.data.find(c => c.challengeId === parseInt(id));
        setUserStatus(myChallenge);
      } catch (error) {
        console.error("Failed to load details", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [id]);

  /* // Tab Data Fetching (Commented out for now)
  useEffect(() => {
    if (activeTab === "participants") {
      api.get(`/challenges/${id}/participants`)
         .then(res => setParticipants(res.data))
         .catch(() => setParticipants([]));
    } 
    else if (activeTab === "leaderboard") {
      api.get(`/leaderboard/challenge/${id}`)
         .then(res => setLeaderboard(res.data))
         .catch(() => setLeaderboard([]));
    }
  }, [activeTab, id]);
  */

  const handleJoin = async () => {
    try {
      await api.post(`/challenges/${id}/join`);
      window.location.reload(); // Simple reload to refresh data
      alert("Success! You have joined the challenge.");
    } catch (error) {
      alert("Could not join. You might already be in.");
    }
  };

  if (loading) return <div className="loading">Loading Details...</div>;
  if (!challenge) return <div className="error">Challenge not found</div>;

  const bgImage = getChallengeImage(challenge);

  return (
    <div className="details-page">
      <Navbar />
      
      <div className="details-container">
        
        <button className="back-link" onClick={() => navigate("/challenges")}>
          ← Back to Challenges
        </button>

        <div className="hero-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${bgImage}')` }}>
          <div className="hero-content">
            <h1>{challenge.name}</h1>
            <p>Created by {challenge.creatorName || "Admin"}</p>
            {userStatus ? (
              <button className="hero-btn joined">Joined ✓</button>
            ) : (
              <button className="hero-btn join" onClick={handleJoin}>Join Challenge</button>
            )}
          </div>
        </div>

        <div className="info-cards-row">
          <div className="info-card">
            <span className="icon">📅</span>
            <div><label>DURATION</label><strong>{challenge.startDate} — {challenge.endDate}</strong></div>
          </div>
          <div className="info-card">
            <span className="icon">👥</span>
            <div><label>PARTICIPANTS</label><strong>{challenge.participantCount || 0} / ∞</strong></div>
          </div>
          <div className="info-card">
            <span className="icon">🎯</span>
            <div><label>GOAL</label><strong>{challenge.targetValue} {challenge.goalType}</strong></div>
          </div>
          <div className="info-card">
            <span className="icon">🏆</span>
            <div><label>REWARD</label><strong>Badge + Points</strong></div>
          </div>
        </div>

        <div className="tabs-nav">
          {/* Only showing Overview for now */}
          {["overview"].map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-grid">
              <div className="left-col">
                <div className="content-box">
                  <h3>About this Challenge</h3>
                  <p>{challenge.description || "No description provided."}</p>
                  <div className="tags">
                    <span className="tag">{challenge.goalType}</span>
                    <span className="tag">{challenge.visibility}</span>
                  </div>
                </div>
                <div className="content-box">
                  <h3>Rules</h3>
                  <ul>
                    <li>Log your activity daily via Check-in.</li>
                    <li>Reach the daily target of <strong>{challenge.targetValue} {challenge.goalType}</strong>.</li>
                    <li>Consistency is key! Don't break your streak.</li>
                  </ul>
                </div>
              </div>

              <div className="right-col">
                <div className="stats-box">
                  <h3>Your Stats</h3>
                  <div className="stat-row">
                    <span>Completion</span>
                    <span>{userStatus ? Math.min(100, Math.floor((userStatus.totalPoints / (challenge.targetValue * 30)) * 100)) : 0}%</span>
                  </div>
                  <div className="progress-bar"><div className="fill" style={{width: `${userStatus ? 15 : 0}%`}}></div></div>
                  
                  <div className="mini-stat">🔥 Current Streak <strong>{userStatus?.currentStreak || 0} Days</strong></div>
                  <div className="mini-stat">🏆 Points Earned <strong>{userStatus?.totalPoints || 0}</strong></div>
                  
                  {userStatus && (
                    <button className="log-btn" onClick={() => navigate("/checkin")}>Go Log Activity</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* {activeTab === "participants" && (
            <div className="content-box">
              <h3>Participants ({participants.length})</h3>
              {participants.length > 0 ? (
                <div className="participants-list">
                  {participants.map((p, i) => (
                    <div key={i} className="participant-row">
                      <div className="p-avatar">{p.fullName?.charAt(0) || "U"}</div>
                      <div className="p-info">
                        <strong>{p.fullName}</strong>
                        <span>Joined {new Date(p.joinedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-msg">No participants yet. Be the first!</p>
              )}
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="content-box">
              <h3>Leaderboard</h3>
              {leaderboard.length > 0 ? (
                <table className="leader-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>User</th>
                      <th>Points</th>
                      <th>Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={index}>
                        <td>#{index + 1}</td>
                        <td><strong>{entry.fullName}</strong></td>
                        <td>{entry.score} pts</td>
                        <td>{entry.streak || 0} 🔥</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-msg">Leaderboard will update once activity starts!</p>
              )}
            </div>
          )} 
          */}
        </div>
      </div>
    </div>
  );
}