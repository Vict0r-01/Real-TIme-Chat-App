'use client';
import { createContext, useEffect, useContext, useState } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [chatBoxes, setChatBoxes] = useState(new Map());

  useEffect(() => {
    sessionStorage.getItem('chatBoxes') && setChatBoxes(new Map(JSON.parse(sessionStorage.getItem('chatBoxes'))))
  }, []);

  const setAndPersistChatBoxes = (newChatBoxes) => {
    setChatBoxes(newChatBoxes);
    sessionStorage.setItem('chatBoxes', JSON.stringify(Array.from(newChatBoxes.entries())));
  };

  return (
    <ChatContext.Provider value={{ chatBoxes, setAndPersistChatBoxes }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);