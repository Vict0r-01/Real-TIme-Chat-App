import { memo, useEffect, useRef, useMemo } from 'react';
import Message from './message';
import { useAuth } from '../context/authContext';
import { getImageUrl } from '../config/imageUrl';

const MessageList = memo(({ messages}) => {
  const messageEndRef = useRef(null);
  const {username} = useAuth();

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden w-full mb-2 transition-opacity duration-500">
      {messages.map((message, index) => (
        <div key={`${message.id}-${index}`} className={`flex items-start m-2 ${message?.sender === username ? 'flex-row-reverse' : 'flex-row'}`}>
          <img
            src={getImageUrl(message.profilePicture)}
            className={`w-8 h-8 rounded-full ${message?.sender === username ? 'ml-2' : 'mr-2'}`}
            alt={`${message.sender}'s avatar`}
          />

          <div className={`transition duration-300 ease-in-out max-w-3/4 w-fit rounded-xl ${message?.sender === username ? 'bg-accent text-black' : 'bg-panel text-muted'}`}>
            {(message?.content || message?.imageUrls) && (
              <div className="p-1">
                <Message
                  sender={message.sender === username ? 'You' : message.sender || 'Unknown'}
                  text={message.content}
                  imageUrls={message.imageUrls || []}
                  timestamp={message.timestamp}
                />
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
});

MessageList.displayName = 'MessageList';
export default MessageList;