import "./CreateChat.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateChat() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [groupName, setGroupName] = useState("");
  const [isPublic, setIsPublic] = useState(true); // ✅ Public/Private State
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data)).catch(console.error);
  }, []);

  const toggleUser = (userId) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(userId)) newSet.delete(userId);
    else newSet.add(userId);
    setSelectedUsers(newSet);
  };

  const handleCreate = async () => {
    if (!groupName) return alert("Please enter a group name");
    
    setLoading(true);
    try {
      await api.post("/chat/group", {
        name: groupName,
        description: "Chat Group",
        goalType: "STEPS", 
        targetValue: 1000, 
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        
        // ✅ PASS VISIBILITY TO BACKEND
        visibility: isPublic ? "PUBLIC" : "PRIVATE" 
      });
      
      alert("Chat Group Created!");
      navigate("/chat");
    } catch (error) {
      console.error(error);
      alert("Failed to create chat group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-chat-page">
      <Navbar />
      <div className="create-chat-container">
        <div className="form-card">
          <h2>Create New Group Chat</h2>
          <p>Start a conversation with your tribe members</p>

          <div className="input-group">
            <label>Group Name *</label>
            <input 
              placeholder="e.g., Weekend Warriors" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          {/* ✅ VISIBILITY TOGGLE */}
          <div className="visibility-section">
            <label>Privacy Setting</label>
            <div className="visibility-options">
              <button 
                className={`vis-btn ${isPublic ? 'active' : ''}`}
                onClick={() => setIsPublic(true)}
              >
                🌍 Public (Anyone can join)
              </button>
              <button 
                className={`vis-btn ${!isPublic ? 'active' : ''}`}
                onClick={() => setIsPublic(false)}
              >
                🔒 Private (Invite only)
              </button>
            </div>
          </div>

          <div className="user-selection">
            <label>Select Participants</label>
            <div className="user-grid">
              {users.length > 0 ? users.map(user => (
                <div 
                  key={user.id} 
                  className={`user-card ${selectedUsers.has(user.id) ? "selected" : ""}`}
                  onClick={() => toggleUser(user.id)}
                >
                  <div className="avatar-small">{user.fullName?.charAt(0)}</div>
                  <span>{user.fullName}</span>
                </div>
              )) : <p>No other users found.</p>}
            </div>
          </div>

          <div className="actions">
            <button className="primary-btn" onClick={handleCreate} disabled={loading}>
                {loading ? "Creating..." : "Create Group"}
            </button>
            <button className="cancel-btn" onClick={() => navigate("/chat")}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}