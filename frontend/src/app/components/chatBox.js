import React from 'react';
import { getImageUrl } from '../config/imageUrl';
    const ChatBox = ({ name, image }) => {

        return (
            <div className="flex">
                <img src={getImageUrl(image)} alt={`${name}'s avatar`} className="w-12 h-12 rounded-full object-cover m-1" />
                <div className="ml-5">
                    <p className="text-white font-bold group-hover:text-black transition-colors duration-300">{name}</p>
                </div>
                
            </div>
        );
    }
export default ChatBox;