import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useTheme } from "../context/ThemeContext"; // ✅ Import Context
import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { theme, toggleTheme } = useTheme(); // ✅ Use Hook

  const isActive = (path) => location.pathname.startsWith(path) ? "active" : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar" style={{backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)'}}>
      <div className="navbar-container">
       <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
          <img src={logo} alt="FitQuest Logo" className="brand-logo" />
          <span className="brand-text">
            <span className="text-fit">Fit</span>
            <span className="text-quest">Quest</span>
          </span>
        </div>

        <div className="navbar-links">
          {['dashboard', 'challenges', 'leaderboard', 'chat', 'profile'].map(item => (
            <Link key={item} to={`/${item}`} className={`nav-item ${isActive(`/${item}`)}`}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {/* ✅ THEME TOGGLE BUTTON */}
          {/* <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button> */}

          <button className="icon-btn" onClick={() => navigate("/challenges/create")}>+</button>
          <button className={`icon-btn ${isActive("/settings")}`} onClick={() => navigate("/settings")}>⚙️</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}