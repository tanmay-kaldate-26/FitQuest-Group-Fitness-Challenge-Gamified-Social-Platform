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

  const handleJoin = async () => {
    try {
      await api.post(`/challenges/${id}/join`);
      window.location.reload(); 
      alert("Success! You have joined the challenge.");
    } catch (error) {
      alert("Could not join. You might already be in.");
    }
  };

  if (loading) return <div className="loading">Loading Details...</div>;
  if (!challenge) return <div className="error">Challenge not found</div>;

  const bgImage = getChallengeImage(challenge);

  // ✅ NEW: Calculate Completion Percentage Correctly
  let completionPercent = 0;
  if (userStatus && challenge) {
      // 1. Calculate Duration in Days
      const start = new Date(challenge.startDate);
      const end = new Date(challenge.endDate);
      const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      
      // 2. Define "100% Complete" as earning ~50 points per day
      // (This balances base points + activity points)
      const targetPoints = durationDays * 50; 

      // 3. Calculate % based on Points Earned vs Target Points
      completionPercent = Math.min(100, Math.floor((userStatus.totalPoints / targetPoints) * 100));
  }

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
                  
                  {/* ✅ UPDATED: Use the calculated percentage */}
                  <div className="stat-row">
                    <span>Completion</span>
                    <span>{completionPercent}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="fill" style={{width: `${completionPercent}%`}}></div>
                  </div>
                  
                  <div className="mini-stat">🔥 Current Streak <strong>{userStatus?.currentStreak || 0} Days</strong></div>
                  <div className="mini-stat">🏆 Points Earned <strong>{userStatus?.totalPoints || 0}</strong></div>
                  
                  {userStatus && (
                    <button 
                        className="log-btn" 
                        onClick={() => navigate("/checkin", { 
                            state: { 
                                challengeId: id, 
                                challengeName: challenge.name,
                                goalType: challenge.goalType
                            } 
                        })}
                    >
                        Go Log Activity
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}