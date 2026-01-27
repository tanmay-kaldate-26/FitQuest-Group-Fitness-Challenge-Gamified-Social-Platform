import "./CreateChallenge.css";
import Navbar from "../components/Navbar";
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateChallenge() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "GROUP", 
    visibility: "PUBLIC",
    goalType: "STEPS",
    targetValue: "",
    startDate: "",
    endDate: "",
    maxParticipants: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        visibility: formData.visibility,
        goalType: formData.goalType,
        targetValue: parseFloat(formData.targetValue),
        startDate: formData.startDate,
        endDate: formData.endDate,
        ...(formData.maxParticipants ? { participantCount: parseInt(formData.maxParticipants) } : {}) 
      };

      await api.post("/challenges/group", payload);
      alert("Challenge created successfully! 🎉");
      navigate("/challenges");
    } catch (error) {
      console.error("Creation failed", error);
      alert("Failed to create challenge. " + (error.response?.data?.message || "Check inputs."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-challenge-page">
      <Navbar />
      <main className="create-container">
        
        {/* ✅ BACK BUTTON */}
        <div className="back-link" onClick={() => navigate("/challenges")}>
          ← Back to Challenges
        </div>

        {/* LEFT: FORM */}
        <section className="form-section">
          <h2>Create New Challenge</h2>
          <p>Design a fitness challenge to inspire your tribe!</p>

          <form onSubmit={handleSubmit} className="create-form">
            <label>Challenge Name *</label>
            <input name="name" placeholder="e.g., 30-Day Running Challenge" onChange={handleChange} required />

            <label>Description *</label>
            <textarea name="description" placeholder="Describe goals and rules..." onChange={handleChange} required />

            <label>Activity Type *</label>
            <select name="goalType" onChange={handleChange}>
              <option value="STEPS">Steps</option>
              <option value="DURATION">Duration (Minutes)</option>
              <option value="SESSIONS">Sessions</option>
            </select>

            <div className="row">
              <div>
                <label>Daily Target *</label>
                <input name="targetValue" type="number" placeholder="e.g. 10000" onChange={handleChange} required />
              </div>
              <div>
                <label>Visibility</label>
                <select name="visibility" onChange={handleChange}>
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div>
                <label>Start Date *</label>
                <input name="startDate" type="date" onChange={handleChange} required />
              </div>
              <div>
                <label>End Date *</label>
                <input name="endDate" type="date" onChange={handleChange} required />
              </div>
            </div>

            {/* ✅ ACTIONS ROW WITH STYLIZED CANCEL BUTTON */}
            <div className="actions">
              <button className="primary-btn" disabled={loading}>
                {loading ? "Creating..." : "Create Challenge"}
              </button>
              
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => navigate("/challenges")}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>

        {/* RIGHT: PREVIEW */}
        <section className="preview-section">
          <div className="preview-header">🏆 Preview</div>
          <div className="preview-card">
            <div className="preview-icon">🏆</div>
            <h3>{formData.name || "Challenge Name"}</h3>
            <p>{formData.description || "Challenge description will appear here..."}</p>
            
            <div className="preview-meta">
              <span>📅 {formData.startDate || "--"} to {formData.endDate || "--"}</span>
              <span>👥 0 Participants</span>
            </div>
          </div>

          <div className="tips-card">
            <h4>Tips for Success</h4>
            <ul>
              <li>Set clear, achievable goals</li>
              <li>Make rules simple to follow</li>
              <li>Encourage daily check-ins</li>
            </ul>
          </div>
        </section>

      </main>
    </div>
  );
}