import React, { memo } from 'react';
import { getImageUrl } from '../config/imageUrl';
    const ChatInfo = memo(({chat}) => {
        return (
            <div className='flex items-center'>
                <img src={getImageUrl(chat.image)} alt={`${chat.image}'s pfp`} className="avatar-md rounded-full object-cover" />
                <div className="ml-4">
                    <p className={`font-semibold text-accent`}>{chat.name}</p>
                        {chat.type === 'GROUP' && <p className='text-sm muted'>
                            {chat.participants.length} members: {chat.participants.map((participant, index) => (index > 0 ? ', ' : '') + participant.name
                        )}</p>
                    }
                </div>
            </div>
        );
    });
export default ChatInfo;