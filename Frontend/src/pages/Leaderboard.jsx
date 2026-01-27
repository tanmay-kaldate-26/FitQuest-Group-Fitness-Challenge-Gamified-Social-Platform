import "./Leaderboard.css";
import Navbar from "../components/Navbar";
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

function Leaderboard() {
  const [originalData, setOriginalData] = useState([]); 
  const [displayData, setDisplayData] = useState([]);   
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("WEEKLY"); 

  // ✅ 1. Wrap processData in useCallback
  // This ensures the function doesn't get redefined on every render
  const processData = useCallback((data) => {
    let sorted = [...data];

    if (filter === "WEEKLY") {
      sorted.sort((a, b) => (b.weeklyGain || 0) - (a.weeklyGain || 0));
    } else {
      sorted.sort((a, b) => b.points - a.points);
    }

    sorted = sorted.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    setDisplayData(sorted);

    const me = sorted.find(u => u.currentUser);
    setCurrentUser(me);
  }, [filter]); // Dependency: Re-create only if 'filter' changes

  // ✅ 2. Wrap fetchLeaderboard in useCallback
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await api.get("/leaderboard");
      const data = res.data || [];
      
      setOriginalData(data); 
      processData(data); 
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
      setLoading(false);
    }
  }, [processData]); // Dependency: Depends on 'processData'

  // ✅ 3. Add dependencies to useEffects
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]); // Safe now

  useEffect(() => {
    if (originalData.length > 0) {
      processData(originalData);
    } else {
      setDisplayData([]);
    }
  }, [filter, originalData, processData]); // Safe now

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  if (loading) return <div className="loading-screen">Loading Rankings...</div>;

  const topThree = displayData.slice(0, 3); 
  const restList = displayData.slice(3); 

  const goldUser = topThree[0];
  const silverUser = topThree[1];
  const bronzeUser = topThree[2];

  return (
    <div className="leaderboard-page">
      <Navbar />

      <main className="leaderboard-container">
        <div className="leaderboard-header">
          <h1>Leaderboard</h1>
          <p>See how you stack up against the tribe!</p>
        </div>

        {/* FILTERS */}
        <div className="leaderboard-filters">
          <button 
            className={`filter-btn ${filter === "WEEKLY" ? "active" : ""}`}
            onClick={() => setFilter("WEEKLY")}
          >
            This Week
          </button>
          <button 
            className={`filter-btn ${filter === "ALL_TIME" ? "active" : ""}`}
            onClick={() => setFilter("ALL_TIME")}
          >
            All Time
          </button>
        </div>

        {/* PODIUM SECTION */}
        <div className="top-three">
          
          {/* SILVER (Left) */}
          <div className="podium-column">
            {silverUser && (
              <div className="top-card silver">
                <div className="medal">🥈</div>
                <div className="avatar">{getInitials(silverUser.name)}</div>
                <h3>{silverUser.name}</h3>
                <p className="rank">Rank #{silverUser.rank}</p>
                <div className="points-box">
                  {filter === "WEEKLY" ? (
                     <>
                       ⭐ +{silverUser.weeklyGain}
                       <span>Weekly Gain</span>
                     </>
                  ) : (
                     <>
                       ⭐ {silverUser.points.toLocaleString()}
                       <span>Total Points</span>
                     </>
                  )}
                </div>
                <div className="stats">
                  🔥 {silverUser.streak}d
                </div>
              </div>
            )}
          </div>

          {/* GOLD (Center) */}
          <div className="podium-column center-column">
            {goldUser && (
              <div className="top-card gold">
                <div className="crown">👑</div>
                <div className="avatar">{getInitials(goldUser.name)}</div>
                <h3>{goldUser.name}</h3>
                <p className="rank">Rank #{goldUser.rank}</p>
                <div className="points-box">
                  {filter === "WEEKLY" ? (
                     <>
                       ⭐ +{goldUser.weeklyGain}
                       <span>Weekly Gain</span>
                     </>
                  ) : (
                     <>
                       ⭐ {goldUser.points.toLocaleString()}
                       <span>Total Points</span>
                     </>
                  )}
                </div>
                <div className="stats">
                  🔥 {goldUser.streak}d
                </div>
              </div>
            )}
          </div>

          {/* BRONZE (Right) */}
          <div className="podium-column">
            {bronzeUser && (
              <div className="top-card bronze">
                <div className="medal">🥉</div>
                <div className="avatar">{getInitials(bronzeUser.name)}</div>
                <h3>{bronzeUser.name}</h3>
                <p className="rank">Rank #{bronzeUser.rank}</p>
                <div className="points-box">
                  {filter === "WEEKLY" ? (
                     <>
                       ⭐ +{bronzeUser.weeklyGain}
                       <span>Weekly Gain</span>
                     </>
                  ) : (
                     <>
                       ⭐ {bronzeUser.points.toLocaleString()}
                       <span>Total Points</span>
                     </>
                  )}
                </div>
                <div className="stats">
                  🔥 {bronzeUser.streak}d
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LIST TABLE */}
        <div className="leaderboard-table">
          <div className="table-header">
            <span>Rank</span>
            <span>User</span>
            <span>{filter === "WEEKLY" ? "Weekly Gain" : "Total Points"}</span>
            <span>Streak</span>
          </div>

          {restList.length > 0 ? (
            restList.map((user) => (
              <div className={`table-row ${user.currentUser ? "you" : ""}`} key={user.id}>
                <span className="rank-num">#{user.rank}</span>
                <span className="user-cell">
                  <div className="mini-avatar">{getInitials(user.name)}</div>
                  {user.name} {user.currentUser && <span className="you-badge">You</span>}
                </span>
                <span>
                  ⭐ {filter === "WEEKLY" ? `+${user.weeklyGain}` : user.points.toLocaleString()}
                </span>
                <span>🔥 {user.streak}</span>
              </div>
            ))
          ) : (
            <div style={{padding: "40px", textAlign: "center", color: "#94a3b8"}}>
              {displayData.length <= 3 
                ? "Join more friends to fill the leaderboard!" 
                : "No users found."}
            </div>
          )}

          {/* Sticky Current User Row */}
          {currentUser && currentUser.rank > 3 && !restList.find(u => u.id === currentUser.id) && (
            <div className="table-row you sticky-bottom">
              <span className="rank-num">#{currentUser.rank}</span>
              <span className="user-cell">
                <div className="mini-avatar">{getInitials(currentUser.name)}</div>
                You
              </span>
              <span>
                 ⭐ {filter === "WEEKLY" ? `+${currentUser.weeklyGain}` : currentUser.points.toLocaleString()}
              </span>
              <span>🔥 {currentUser.streak}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;