import "./Card.css";

function Card({ title, action, children }) {
  return (
    <div className="card">
      {title && (
        <div className="card-header">
          <h4>{title}</h4>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
