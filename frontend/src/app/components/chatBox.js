import React from 'react';
import { getImageUrl } from '../config/imageUrl';
    const ChatBox = ({ name, image, chatId, selectedChatId}) => {
        const selected = selectedChatId == chatId;
        return (
            <div className={`flex items-center p-2 rounded-lg transition duration-200 ease-in-out ${selected ? 'selected-chat' : 'hover:shadow-card hover:bg-opacity-5'}`}>
                <img src={getImageUrl(image)} alt={`${name}'s avatar`} className="avatar-md rounded-full object-cover" />
                <div className="ml-4">
                    <p className={`font-semibold ${selected ? 'text-black' : 'text-accent'}`}>{name}</p>
                </div>
            </div>
        );
    }
export default ChatBox;