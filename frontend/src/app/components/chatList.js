import { memo } from 'react';
import ChatBox from './chatBox';
import { useState } from 'react';

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.chatBoxes === nextProps.chatBoxes &&
    prevProps.onChatSelect === nextProps.onChatSelect
  );
};


const ChatList = memo(({ chatBoxes, onChatSelect }) => {
  const[selectedChatId, setSelectedChatId] = useState(null);
  return (
    <div id='chatList' className="flex flex-col border-2 border-yellow-300 rounded-lg m-2 w-1/3">
      {chatBoxes.size > 0 ? (
      <ul>
        {[...chatBoxes].map(([key, value]) =>
        (
          <li
            key={key} 
            className={`m-2 hover:bg-gray-100 group transition duration-300 ease-in-out rounded-lg ${selectedChatId === key ? ' bg-gray-100' : ''}`}
            onClick={() => {
              onChatSelect(key)
              setSelectedChatId(key);
              }
            }
          >
            <ChatBox name={value.name} image={value.image} chatId={value.id ?? key} selectedChatId={selectedChatId} />
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
}, areEqual);

ChatList.displayName = 'ChatList';
export default ChatList;