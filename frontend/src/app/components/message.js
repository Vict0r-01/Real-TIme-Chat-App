import React from 'react';
import { useAuth } from '../context/authContext';
import { getImageUrl } from '../config/imageUrl';
import { useEffect, useState } from 'react';

const Message = ({ text, imageUrls, sender, timestamp }) => {
     const [visible, setVisible] = useState(false);
    useEffect(() => {
    // Trigger the transition after mount
    setVisible(true);
  }, []);
    return (
        <div className={`m-2 max-w-xs rounder-lg transition-all duration-500 transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
            <label className="font-bold text-lg block text-left -mb-1">{sender}</label>
            <p className="whitespace-pre-wrap break-words">{text}</p>
            {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {imageUrls.map((url, index) => (
                        <img
                            key={index}
                            src={getImageUrl(url)}
                            alt={`Message attachment ${index + 1}`}
                            className="max-w-full h-auto rounded-lg"
                        />
                    ))}
                </div>
            )}
            <span className="text-xs text-gray-500 block text-right">
                {new Date(timestamp).toLocaleTimeString()}
            </span>
        </div>
    );
};

export default Message;