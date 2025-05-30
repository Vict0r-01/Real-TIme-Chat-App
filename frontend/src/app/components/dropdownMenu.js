'use client';
import { useState } from 'react';
import { styles } from '../styles/style';

export default function DropdownMenu({ onProfile, onAddChat, onAddFriend, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.button} flex items-center transition-transform duration-200 ${
          isOpen ? 'rotate-90' : ''
        }`}
      >
        ☰
      </button>
      
      <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-800 ring-1 ring-black ring-opacity-5
        transform transition-all duration-200 origin-top-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <div className="py-1" role="menu">
          <button
            className="w-full text-left px-4 py-2 text-sm text-yellow-300 hover:bg-zinc-700 transition-colors duration-150"
            onClick={() => {
              onProfile();
              setIsOpen(false);
            }}
          >
            Profile
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-yellow-300 hover:bg-zinc-700 transition-colors duration-150"
            onClick={() => {
              onAddChat();
              setIsOpen(false);
            }}
          >
            Add Chat
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-yellow-300 hover:bg-zinc-700 transition-colors duration-150"
            onClick={() => {
              onAddFriend();
              setIsOpen(false);
            }}>
              Add Friend
            </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-yellow-300 hover:bg-zinc-700 transition-colors duration-150"
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}