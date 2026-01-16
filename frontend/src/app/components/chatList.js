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
    <div id='chatList' className="card m-2 p-2 w-1/3 shadow-card">
      {chatBoxes.size > 0 ? (
      <ul className="space-y-2">
        {[...chatBoxes].map(([key, value]) =>
        (
          <li
            key={key} 
            className={`cursor-pointer transition duration-200 ease-in-out rounded-lg ${selectedChatId === key ? 'selected-chat' : 'hover:bg-yellow-300/5'}`}
            onClick={() => { onChatSelect(key); setSelectedChatId(key); }}
          >
            <ChatBox name={value.name} image={value.image} chatId={value.id ?? key} selectedChatId={selectedChatId} />
          </li>
        ))}
      </ul>
      ): (
        <div className="flex items-center justify-center h-32 w-full">
          <p className="text-muted">No chats available</p>
        </div>
      )}
    </div>
  );
}, areEqual);

ChatList.displayName = 'ChatList';
export default ChatList;