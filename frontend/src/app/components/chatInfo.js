import React, { memo } from 'react';
import { getImageUrl } from '../config/imageUrl';
    const ChatInfo = memo(({chat}) => {
        return (
            <div className='flex justify-start items-center'>
                <img src={getImageUrl(chat.image)} alt={`${chat.image}'s pfp`} className=" w-6 h-6 md:w-12 md:h-12 rounded-full object-cover m-1" />
                <div className="ml-5">
                    <p className={`text-auto font-bold group-hover:text-black`}>{chat.name}</p>
                        {chat.type === 'GROUP' && <p className='text-sm text-gray-500'>
                            {chat.participants.length} members: {chat.participants.map((participant, index) => (index > 0 ? ', ' : '') + participant.name
                        )}</p>
                    }
                </div>
                
            </div>
        );
    });
export default ChatInfo;