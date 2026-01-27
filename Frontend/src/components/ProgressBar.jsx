// src/components/ProgressBar.jsx
function ProgressBar({ value }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

export default ProgressBar;
