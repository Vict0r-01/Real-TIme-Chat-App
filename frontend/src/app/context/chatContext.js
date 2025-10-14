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

  const removeParticipant = (chatId, participantName) => {
    const chatBox = chatBoxes.get(chatId);
    if (chatBox) {
      const updatedParticipants = chatBox.participants.filter(p => p.name !== participantName);
      const updatedChatBox = { ...chatBox, participants: updatedParticipants };
      const newChatBoxes = new Map(chatBoxes);
      newChatBoxes.set(chatId, updatedChatBox);
      setAndPersistChatBoxes(newChatBoxes);
    }
  };

  const addParticipant = (chatId, participant) => {
    const chatBox = chatBoxes.get(chatId);
    if (chatBox) {
      const updatedParticipants = [...chatBox.participants, participant];
      const updatedChatBox = { ...chatBox, participants: updatedParticipants };
      const newChatBoxes = new Map(chatBoxes);
      newChatBoxes.set(chatId, updatedChatBox);
      setAndPersistChatBoxes(newChatBoxes);
    }
  };

  return (
    <ChatContext.Provider value={{ chatBoxes, setAndPersistChatBoxes, removeParticipant, addParticipant }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);