import "./StatCard.css";

function StatCard({ icon, title, value, badge }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-info">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
      </div>

      {badge && <span className="stat-badge">{badge}</span>}
    </div>
  );
}

export default StatCard;
