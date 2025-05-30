import { memo } from 'react';
import ChatBox from './chatBox';

const ChatList = memo(({ chatBoxes, onChatSelect }) => {
  console.log('Rendering ChatList with chatBoxes:', chatBoxes);
  return (
    <div className="flex flex-col border-2 border-yellow-300 rounded-lg m-2 w-1/3">
      {chatBoxes.length > 0 ? (
      <ul>
        {chatBoxes.map((chat, index) => (
          <li 
            key={chat.id || `chat-${index}`} 
            className="m-2 hover:bg-gray-100 group transition duration-300 ease-in-out rounded-lg"
            onClick={() => onChatSelect(chat.id)}
          >
            <ChatBox name={chat.name} image={chat.image} />
          </li>
        ))}
      </ul>
      ): (
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-gray-500">No chats available</p>
        </div>
      )}
    </div>
  );
});

ChatList.displayName = 'ChatList';
export default ChatList;