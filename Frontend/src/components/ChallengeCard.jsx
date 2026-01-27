import { useNavigate } from "react-router-dom";
import "./ChallengeCard.css";

function ChallengeCard({ title, daysLeft, participants, progress, id }) {
  const navigate = useNavigate();

  return (
    <div className="challenge-card">
      <h3>{title}</h3>
      <p>{daysLeft} · {participants}</p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        className="view-btn"
        onClick={() => navigate(`/challenges/${id}`)}
      >
        View Challenge
      </button>
    </div>
  );
}

export default ChallengeCard;
