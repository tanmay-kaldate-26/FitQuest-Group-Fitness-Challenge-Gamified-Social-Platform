import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([
    { id: 1, name: "30-Day Running", members: 124 },
    { id: 2, name: "Morning Yoga", members: 89 },
  ]);

  const addChat = (chat) => {
    setChats((prev) => [...prev, chat]);
  };

  return (
    <ChatContext.Provider value={{ chats, addChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  return useContext(ChatContext);
}
