import "./Profile.css";
import Navbar from "../components/Navbar";
import ActivityCalendar from "../components/ActivityCalendar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

// ✅ CURATED LIST: Short, Fitness-Focused Quotes
const FITNESS_QUOTES = [
  { text: "Sweat is just fat crying.", author: "Unknown" },
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Action is the foundational key to all success.", author: "Picasso" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins" },
  { text: "Your body can stand almost anything. It’s your mind you have to convince.", author: "Unknown" },
  { text: "Fitness is not about being better than someone else. It’s about being better than you were yesterday.", author: "Khloe Kardashian" },
  { text: "Discipline is doing what needs to be done, even if you don't want to do it.", author: "Unknown" },
  { text: "No pain, no gain.", author: "Ben Franklin" },
  { text: "Train insane or remain the same.", author: "Unknown" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" }
];

export default function Profile() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ STATE: Pick a random quote on load
  const [quote, setQuote] = useState(FITNESS_QUOTES[0]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);

        const calRes = await api.get("/daily-checkins/calendar?days=365");
        setCalendarData(calRes.data);

      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    // Pick random quote
    const randomQuote = FITNESS_QUOTES[Math.floor(Math.random() * FITNESS_QUOTES.length)];
    setQuote(randomQuote);

    fetchProfile();
  }, []);

  if (loading) return <div className="loading-screen">Loading Profile...</div>;
  if (!user) return <div className="error-screen">Failed to load profile.</div>;

  const level = Math.max(1, Math.floor((user.totalPoints || 0) / 1000) + 1);
  const joinedDate = user.joinedAt ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: 'long', year: 'numeric' }) : "Recently";
  const activeDaysCount = calendarData.filter(d => d.checkedIn).length;
  const last7Days = calendarData.slice(-7);
  const pointsThisWeek = last7Days.reduce((acc, day) => acc + (day.totalPoints || 0), 0);
  
  const challengesCount = user.totalChallenges || 0; 

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
                {/* ✅ FIX: Only show if > 0 */}
                {challengesCount > 0 && (
                    <span>🏆 {challengesCount} Challenges Joined</span>
                )}
                <span>🔥 {user.currentStreak || 0} Day Streak</span>
              </div>

            </div>
          </div>
          <button className="edit-profile-btn" onClick={() => navigate("/settings")}>✏️ Edit Profile</button>
        </div>

        {/* STATS GRID */}
        <div className="profile-stats-grid">
          
          {/* ✅ MOTIVATIONAL QUOTE CARD (Fixed Size) */}
          <div className="stat-card-p icon-purple quote-card">
            <div className="icon-circle">💡</div> 
            <div className="quote-content">
              <p>Daily Motivation</p>
              <h4 className="quote-text">"{quote.text}"</h4>
              <span className="quote-author">— {quote.author}</span>
            </div>
          </div>

          <div className="stat-card-p icon-orange">
            <div className="icon-circle">⭐</div>
            <div><p>Total Points</p><h3>{(user.totalPoints || 0).toLocaleString()}</h3></div>
          </div>
          <div className="stat-card-p icon-red">
            <div className="icon-circle">🔥</div>
            <div><p>Best Streak</p><h3>{user.currentStreak || 0} Days</h3></div>
          </div>
          <div className="stat-card-p icon-green">
            <div className="icon-circle">📅</div>
            <div><p>Joined</p><h3>{joinedDate}</h3></div>
          </div>
        </div>

        {/* CALENDAR ROW */}
        <div className="profile-bottom-row">
          <div className="activity-card" style={{ flex: 2 }}>
            <div className="card-header-p"><h3>Yearly Activity</h3></div>
            <ActivityCalendar data={calendarData} />
          </div>
          <div className="weekly-summary" style={{ flex: 1 }}>
            <h3>🌀 Quick Stats</h3>
            <div className="summary-item"><p>Points This Week</p><h2>+{pointsThisWeek}</h2></div>
            <div className="summary-item"><p>Total Active Days</p><h2>{activeDaysCount} Days</h2></div>
            <div className="summary-item"><p>Status</p><h2>Active 🟢</h2></div>
          </div>
        </div>
      </div>
    </div>
  );
}