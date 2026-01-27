import "./Badges.css";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import api from "../services/api";
import { getBadgeStyle } from "../utils/badgeMapper";

export default function Badges() {
  const [allBadges, setAllBadges] = useState([]);
  const [userBadges, setUserBadges] = useState(new Set()); // Store IDs of unlocked badges
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch All System Badges (Definitions)
        const allRes = await api.get("/badges/all");
        setAllBadges(allRes.data);

        // 2. Fetch User's Earned Badges
        const myRes = await api.get("/badges/my");
        // Create a Set of unlocked Badge IDs for fast lookup
        const unlockedSet = new Set(myRes.data.map(ub => ub.badgeId));
        setUserBadges(unlockedSet);
        
      } catch (error) {
        console.error("Failed to load badges", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-screen">Loading Badges...</div>;

  return (
    <div className="badges-page">
      <Navbar />
      <div className="badges-container">
        
        <div className="badges-header">
          <h1>Badge Collection</h1>
          <div className="badge-counter">
            <span className="count-num">{userBadges.size}</span>
            <span className="count-label">/ {allBadges.length} Unlocked</span>
          </div>
        </div>

        <div className="badges-grid">
          {allBadges.map((badge) => {
            const isUnlocked = userBadges.has(badge.id);
            const style = getBadgeStyle(badge.code);

            return (
              <div 
                key={badge.id} 
                className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'} ${style.color}`}
              >
                <div className="badge-icon-circle">
                  {style.icon}
                </div>
                
                <div className="badge-content">
                  <h3>{badge.name}</h3>
                  <p>{badge.description}</p>
                </div>

                <div className="badge-footer">
                  {isUnlocked ? (
                    <span className="status-pill success">Unlocked ✓</span>
                  ) : (
                    <span className="status-pill locked-pill">Locked 🔒</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}