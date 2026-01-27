import "./Challenges.css";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

// ✅ 1. SHARED IMAGE CONFIGURATION (Export this to use in Details page too)
export const CHALLENGE_IMAGES = {
  RUNNING: [
    "https://images.unsplash.com/photo-1552674605-46945596d94f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80"
  ],
  YOGA: [
    "https://images.unsplash.com/photo-1544367563-12123d8966cd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1575052814088-613568d92556?auto=format&fit=crop&w=800&q=80"
  ],
  STRENGTH: [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
  ],
  WALKING: [
    "https://images.unsplash.com/photo-1506197061617-7f5c0b093236?auto=format&fit=crop&w=800&q=80"
  ],
  DEFAULT: [
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80"
  ]
};

// ✅ 2. DETERMINISTIC IMAGE HELPER (Exported)
export const getChallengeImage = (challenge) => {
  if (!challenge) return CHALLENGE_IMAGES.DEFAULT[0];

  const text = (challenge.name || "").toUpperCase();
  let category = "DEFAULT";

  if (text.includes("RUN") || text.includes("MARATHON")) category = "RUNNING";
  else if (text.includes("YOGA") || text.includes("ZEN")) category = "YOGA";
  else if (text.includes("WALK") || text.includes("STEP")) category = "WALKING";
  else if (text.includes("STRENGTH") || text.includes("GYM") || text.includes("LIFT")) category = "STRENGTH";

  const images = CHALLENGE_IMAGES[category];
  // use ID to pick index consistently
  return images[challenge.id % images.length];
};

function Challenges() {
  const navigate = useNavigate();
  const [publicChallenges, setPublicChallenges] = useState([]);
  const [myJoinedIds, setMyJoinedIds] = useState(new Set()); 
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filterOptions = ["All", "Steps", "Duration", "Sessions"];

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const publicRes = await api.get("/challenges/public");
      setPublicChallenges(publicRes.data);

      const myRes = await api.get("/challenges/my");
      const joinedIds = new Set(myRes.data.map(c => c.challengeId));
      setMyJoinedIds(joinedIds);
    } catch (error) {
      console.error("Failed to load challenges", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = publicChallenges.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    let matchesFilter = true;
    if (filter !== "All") {
        const type = c.goalType || "";
        if (filter === "Steps") matchesFilter = type === "STEPS";
        else if (filter === "Duration") matchesFilter = type === "DURATION";
        else if (filter === "Sessions") matchesFilter = type === "SESSIONS";
    }
    return matchesSearch && matchesFilter;
  });

  const getDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return `${diffDays} days`;
  };

  return (
    <div className="challenges-page">
      <Navbar />

      <main className="challenges-container">
        <div className="challenges-header">
          <h1>Fitness Challenges</h1>
          <p>Join a challenge and push your limits with the tribe!</p>
        </div>

        <div className="search-section">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search challenges..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="filter-btn"><span>⚙️ Filters</span></button>
        </div>

        <div className="filter-pills">
          {filterOptions.map((f) => (
            <button 
              key={f} 
              className={`pill ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="challenges-grid">
            {filteredChallenges.length > 0 ? (
              filteredChallenges.map((c) => {
                const isJoined = myJoinedIds.has(c.id);
                const bgImage = getChallengeImage(c); // ✅ Consistently gets same image

                return (
                  <div key={c.id} className="challenge-card" onClick={() => navigate(`/challenges/${c.id}`)}>
                    <div className="card-image" style={{backgroundImage: `url('${bgImage}')`}}>
                      <span className="badge-left">{c.goalType}</span>
                      <span className={`badge-right ${isJoined ? 'status-joined' : 'status-new'}`}>
                        {isJoined ? 'Active' : 'New'}
                      </span>
                    </div>

                    <div className="card-body">
                      <h3>{c.name}</h3>
                      <div className="card-meta">
                        <div className="meta-item"><span>📅</span> {getDuration(c.startDate, c.endDate)}</div>
                        <div className="meta-item"><span>👥</span> {c.participantCount || 0}</div>
                      </div>
                      <button className={`card-action-btn ${isJoined ? 'btn-joined' : 'btn-join'}`}>
                        {isJoined ? "Joined ✓" : "View Challenge"}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state"><p>No challenges found.</p></div>
            )}
          </div>
        )}

        <button className="fab-btn" onClick={() => navigate("/challenges/create")}>+</button>
      </main>
    </div>
  );
}

export default Challenges;