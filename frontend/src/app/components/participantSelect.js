'use client';
import { useState, useEffect, useCallback } from 'react';
import { getImageUrl } from '../config/imageUrl';
import { useChat } from '../context/chatContext';
const ParticipantSelect = ({ onSelectionChange, exclude }) => {
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const { chatBoxes } = useChat();

    //Extra participant from private chats
    const participants = Array.from(chatBoxes.values()).filter(chat => chat.type === 'PRIVATE')
    .map(chat => ({
        username: chat.name,
        image: chat.image
    }));

    const handleSelectParticipant = useCallback((participant) => {
        setSelectedParticipants((prev) => {
            const newSelection = prev.includes(participant)
            ? prev.filter(username => username !== participant)
            : [...prev, participant];

            setTimeout(() => onSelectionChange(newSelection), 0);
            return newSelection;
        });
    }, [onSelectionChange]);

    return (
        <div className="max-h-[90vh] overflow-y-auto">
            {participants.map(participant => (
                <div
                    key={participant.username}
                    onClick={() => handleSelectParticipant(participant.username)}
                    className={`flex items-center p-2 rounded-lg cursor-pointer mb-1 transition-colors duration-150 ${selectedParticipants.includes(participant.username) ? 'selected-chat' : 'hover:bg-panel'}`}
                >
                    <img
                    src={getImageUrl(participant.image)}
                    alt={participant.username}
                    className='w-8 h-8 rounded-full mr-2'
                    />
                    <span className='text-sm'>{participant.username}</span>
                </div>
            ))}
        </div>
    );
};

export default ParticipantSelect;