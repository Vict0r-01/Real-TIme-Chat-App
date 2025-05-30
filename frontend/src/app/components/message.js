import React from 'react';
import { useAuth } from '../context/authContext';

const Message = ({ text, sender, timestamp }) => {
    
    return (
        <div className='m-2 max-w-xs rounded-lg'>
            <label className="font-bold text-lg block text-left -mb-1">{sender}</label>
            <p className="whitespace-pre-wrap break-words">{text}</p>
            <span className="text-xs text-gray-500 block text-right">
                {new Date(timestamp).toLocaleTimeString()}
            </span>
        </div>
    );
};

export default Message;