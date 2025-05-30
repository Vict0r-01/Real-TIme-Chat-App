'use client';
import { useState, useEffect, useCallback } from 'react';
import { getImageUrl } from '../config/imageUrl';
const ParticipantSelect = ({ chatBoxes, username, onSelectionChange }) => {
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    //Extra participant from private chats
    const participants = chatBoxes.filter(chat => chat.type === 'PRIVATE')
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
                    className={`flex items-center p-2 rounded-lg cursor-pointer mb-1
                    ${selectedParticipants.includes(participant.username)
                        ? 'bg-yellow-300/20 border border-yellow-300'
                        : 'hover:bg-zinc-700'
                    }`}
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