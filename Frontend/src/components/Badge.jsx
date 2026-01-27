import "./Badge.css";

export default function Badge({ icon, title, subtitle }) {
  return (
    <div className="badge-item">
      <div className="badge-icon">{icon}</div>
      <div className="badge-text">
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
