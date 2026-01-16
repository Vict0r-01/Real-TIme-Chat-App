import React from 'react';
import { useAuth } from '../context/authContext';
import { getImageUrl } from '../config/imageUrl';
import { useEffect, useState } from 'react';

const Message = ({ text, imageUrls, sender, timestamp }) => {
     const [visible, setVisible] = useState(false);
    useEffect(() => { setVisible(true); }, []);
    return (
        <div className={`m-2 max-w-xs rounded-lg transition-all duration-400 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                <div className="flex items-start gap-3">
                    <div>
                        <label className="font-semibold block">{sender}</label>
                        <p className="whitespace-pre-wrap break-words mt-1">{text}</p>
                    </div>
                </div>
                {imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
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
                <div className="mt-2">
                    <span className="text-xs block text-right">{new Date(timestamp).toLocaleTimeString()}</span>
                </div>
        </div>
    );
};

export default Message;