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
    <div className="flex-1 overflow-y-auto border-2 border-yellow-300 rounded-lg h-[calc(100vh-100px)] w-full mb-2">
      {messages.map((message, index) => (
        <div key={`${message.id}-${index}`} 
             className={`flex items-start m-2 ${message?.sender === username ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Profile Image - Show for all messages */}
          <img 
            src={getImageUrl(message.profilePicture)}
            className={`w-8 h-8 rounded-full ${
              message?.sender === username ? 'ml-2' : 'mr-2'
            }`}
            alt={`${message.sender}'s avatar`}
          />
          
          {/* Message Content */}
          <div className={`rounded-lg transition duration-300 ease-in-out max-w-3/4 w-fit ${
            message?.sender === username 
              ? 'bg-yellow-200 text-black' 
              : 'bg-gray-200 text-black'
          }`}>
            {message?.content && (
              <Message 
                sender={message.sender === username ? 'You' : message.sender || 'Unknown'} 
                text={message.content} 
                timestamp={message.timestamp} 
              />
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