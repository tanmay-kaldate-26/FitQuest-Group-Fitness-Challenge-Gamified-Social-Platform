import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        🏋️ <span>FitTribe</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item active">Dashboard</div>
        <div className="nav-item">Challenges</div>
        <div className="nav-item">Leaderboard</div>
        <div className="nav-item">Chat</div>
        <div className="nav-item">Profile</div>
      </nav>

      <div className="sidebar-footer">
        Logout
      </div>
    </aside>
  );
}
