import React from 'react';
import { getImageUrl } from '../config/imageUrl';
    const ChatBox = ({ name, image, chatId, selectedChatId}) => {
        return (
            <div className='flex'>
                <img src={getImageUrl(image)} alt={`${name}'s avatar`} className=" w-6 h-6 md:w-12 md:h-12 rounded-full object-cover m-1" />
                <div className="ml-5">
                    <p className={`text-auto font-bold group-hover:text-black transition-colors duration-300 
                        ${selectedChatId == chatId ? ' text-black' : ''}`}>{name}</p>
                </div>
                
            </div>
        );
    }
export default ChatBox;