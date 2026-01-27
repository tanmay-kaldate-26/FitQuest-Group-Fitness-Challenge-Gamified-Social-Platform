import "./Chat.css";
import Navbar from "../components/Navbar";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const scrollRef = useRef();

  // 1. Fetch User & Chats
  useEffect(() => {
    api.get("/users/profile").then(res => setCurrentUser(res.data)).catch(() => { });

    api.get("/challenges/my").then(res => {
      // Backend returns list of ChallengeResponse
      setChallenges(res.data);
    }).catch(err => console.error("Failed to load chats", err));
  }, []);

  // 2. Poll Messages
  useEffect(() => {
    if (!selectedChat) return;

    // We use challengeId because your DTO probably has it named that way, or just 'id'
    // Let's try both to be safe
    const cid = selectedChat.challengeId || selectedChat.id;

    const load = () => api.get(`/challenges/${cid}/chat`).then(res => setMessages(res.data));

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  // 3. Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const cid = selectedChat.challengeId || selectedChat.id;

    try {
      await api.post(`/challenges/${cid}/chat`, { messageText: newMessage });
      setNewMessage("");
      // Immediate refresh
      const res = await api.get(`/challenges/${cid}/chat`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  return (
    <div className="chat-page">
      <Navbar />
      <div className="chat-container">

        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Chats</h2>
            <button className="new-chat-btn" onClick={() => navigate("/chat/new")}>+ New</button>
          </div>
          <div className="chat-list">
            {challenges.map(chat => (
              <div
                key={chat.id || chat.challengeId}
                className={`chat-item ${selectedChat === chat ? "active" : ""}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="avatar-icon">{(chat.name || chat.challengeName || "C").charAt(0)}</div>
                <div className="chat-info">
                  <h4>{chat.name || chat.challengeName}</h4>
                  <p>Tap to chat</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <h3>{selectedChat.name || selectedChat.challengeName}</h3>
              </div>
              <div className="messages-area">
                {messages.map((msg, i) => {
                  const isMe = msg.userId === currentUser?.id;
                  return (
                    <div key={i} className={`message-bubble ${isMe ? "sent" : "received"}`}>
                      {/* ✅ FIX: Use fullName from backend response */}
                      {!isMe && <span className="sender-name">{msg.fullName || "Unknown"}</span>}
                      <div className="bubble-content">
                        <p>{msg.message}</p> {/* Note: backend DTO might call it 'message' or 'messageText', check DTO */}
                      </div>
                      <span className="timestamp">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." />
                <button type="submit">➤</button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected"><h3>Select a chat</h3></div>
          )}
        </div>
      </div>
    </div>
  );
}