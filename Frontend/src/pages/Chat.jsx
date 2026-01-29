import "./Chat.css";
import Navbar from "../components/Navbar";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const scrollRef = useRef();

  // 1. Fetch User & UNIFIED Chat List
  useEffect(() => {
    api.get("/users/profile").then(res => setCurrentUser(res.data)).catch(() => { });

    api.get("/chat/groups").then(res => {
      setChats(res.data);
    }).catch(err => console.error("Failed to load chats", err));
  }, []);

  // 2. Poll Messages
  useEffect(() => {
    if (!selectedChat) return;

    const id = selectedChat.id;
    const type = selectedChat.type; 

    const load = () => {
        if(type === 'CHALLENGE') {
            api.get(`/challenges/${id}/chat`).then(res => setMessages(res.data)).catch(() => {});
        } else {
            // Group messaging placeholder
        }
    };

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

    const id = selectedChat.id;

    try {
      if (selectedChat.type === 'CHALLENGE') {
          await api.post(`/challenges/${id}/chat`, { messageText: newMessage });
          const res = await api.get(`/challenges/${id}/chat`);
          setMessages(res.data);
      } else {
          alert("Messaging for Custom Groups is coming in the next update!");
      }
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  const handleDeleteChat = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      await api.delete(`/chat/group/${groupId}`);
      setChats(prev => prev.filter(c => !(c.id === groupId && c.type === 'GROUP')));
      if (selectedChat?.id === groupId) setSelectedChat(null);
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Could not delete group.");
    }
  };

  return (
    <div className="chat-page">
      <Navbar />
      <div className="chat-container">

        {/* SIDEBAR */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Chats</h2>
            <button className="new-chat-btn" onClick={() => navigate("/chat/new")}>+ New</button>
          </div>
          <div className="chat-list">
            {chats.map(chat => (
              <div
                key={`${chat.type}-${chat.id}`}
                className={`chat-item ${selectedChat?.id === chat.id && selectedChat?.type === chat.type ? "active" : ""}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="avatar-icon">{chat.letter}</div>
                <div className="chat-info" style={{ width: '100%' }}>
                  
                  {/* ✅ UPDATED NAME ROW WITH NEW ICON */}
                  <div className="chat-name-row">
                     <h4>{chat.name}</h4>
                     
                     {chat.type === 'GROUP' && (
                        <button 
                            className="delete-chat-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChat(chat.id);
                            }}
                            title="Delete Group"
                        >
                            {/* SVG TRASH ICON */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                     )}
                  </div>

                  <p className="sub-text">
                    {chat.type === 'CHALLENGE' ? 'Challenge' : 'Group'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className="chat-main">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <h3>{selectedChat.name}</h3>
              </div>
              
              <div className="messages-area">
                {messages.map((msg, i) => {
                  const isMe = msg.userId === currentUser?.id;
                  return (
                    <div key={i} className={`message-bubble ${isMe ? "sent" : "received"}`}>
                      {!isMe && <span className="sender-name">{msg.fullName || "Unknown"}</span>}
                      <div className="bubble-content">
                        <p>{msg.message}</p>
                      </div>
                      <span className="timestamp">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                
                {selectedChat.type === 'GROUP' && (
                    <div className="system-message">
                        <p>👋 You created "{selectedChat.name}"!</p>
                    </div>
                )}
                
                <div ref={scrollRef} />
              </div>

              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)} 
                    placeholder="Type a message..." 
                    disabled={selectedChat.type === 'GROUP'}
                />
                <button type="submit" disabled={selectedChat.type === 'GROUP'}>➤</button>
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