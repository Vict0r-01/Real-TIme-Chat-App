'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import ChatList from './components/chatList';
import MessageList from './components/messageList';
import { useAuth } from './context/authContext';
import { useWebSocket } from './utility/chatService';
import ChatModal from './components/chatModal';
import { checkAuth } from './utility/checkAuth';
import { styles } from './styles/style';
import DropdownMenu from './components/dropdownMenu';
import FriendModal from './components/friendModal';
import Toast from './components/toast';
import ParticipantSelect from './components/participantSelect';
export default function Home() {
  const router = useRouter();
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [isFriendModalOpen, setFriendModalOpen] = useState(false);
  const [chatBoxes, setChatBoxes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAuth, setAuth] = useState(false);
  const {username, setUsername, logout} = useAuth();
  const [messageText, setMessageText] = useState('');
  const [chatName, setChatName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [chatImage, setChatImage] = useState(null);
  const [chatImagePreview, setChatImagePreview] = useState('https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y');
  const [friendName, setFriendName] = useState('');
  const [chatId, setChatId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const memoizedChatBoxes = useMemo(() => chatBoxes, [chatBoxes]);
  //Add ChatBox
  const addChatBox = useCallback((chat) => {
    console.log('------------------Adding chat box--------------------');
    setChatBoxes([...chatBoxes, {
      name: chat.type === 'PRIVATE' 
            ? chat.participants.find(p => p.username !== username).username || chat.name 
            : chat.name,
      type: chat.type,
      image: chat.type === 'PRIVATE' 
            ? chat.participants.find(p => p.username !== username).profileImageUrl || chat.imageUrl 
            : chat.imageUrl
    }]);
  });

  //Add Message
  const addMessage = useCallback((message) => {
    console.log('------------------Adding message--------------------');
    if (!message?.text) return; // Don't add empty messages
    setMessages(prevMessages => [...prevMessages, {
      sender: message.sender,
      content: message.text,
      timestamp: message.timestamp || new Date().toISOString(),
      profilePicture: message.profilePictureUrl
    }]);
  }, []);
  //WebSocket
  const { connected, sendMessage } = useWebSocket(username, addMessage);

  //Check Auth
  useEffect(() => {

    if(checkAuth(router, username, setUsername))
      setAuth(true);
  }, [router]);

  useEffect(() => {
    if (!isAuth) return;
    console.log('Loading chats for user:', username);
    loadChats();
  }, [username, isAuth]);

  const loadChats = async () => {
    console.log('Loading chats...');
    try {
      const response = await fetch('http://localhost:8080/chat', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Add this debug logging
      const rawResponse = await response.text();
      console.log('Raw response:', rawResponse);
      
      // Check if the response is valid JSON
      if (!rawResponse || rawResponse.trim() === '') {
        setToastMessage('Empty response from server');
        setShowToast(true);
        return;
      }
      // Parse the response
      const data = JSON.parse(rawResponse);
      if (response.ok && data) {
        console.log('Parsed chat data:', data);
        const formattedChats = data.map(chat => ({
          id: chat.id,
          name: chat.type === 'PRIVATE' 
            ? chat.participants.find(p => p.username !== username).username || chat.name 
            : chat.name,
          type: chat.type,
          image: chat.type === 'PRIVATE' 
            ? chat.participants.find(p => p.username !== username).profileImageUrl || chat.imageUrl 
            : chat.imageUrl
        }));
        setChatBoxes(formattedChats);
      }
    } catch (error) {
      setToastMessage('Error fetching chat boxes');
      setShowToast(true);
      if (error instanceof SyntaxError) {
        setToastMessage('Invalid JSON response from server');
        setShowToast(true);
      }
    }
  };

  const loadMessages = useCallback(async (chat_Id) => {
    console.log('Setting chat ID:', chatId , 'to:', chat_Id);
    setChatId(chat_Id);
    if(chat_Id === chatId) return;
    console.log('Loading messages for chat:', chat_Id);
    try{
      const response = await fetch(`http://localhost:8080/chat/${chat_Id}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Debug raw response
      const rawData = await response.text();
      console.log('Raw message data:', rawData);
      // Parse the response
      const data = JSON.parse(rawData);
      console.log('Parsed data:', data);
      if (response.ok && data) {
        const formattedMessages = data.map(message => ({
          id: message.id,
          sender: message.sender || 'Unknown',
          content: message.text,
          timestamp: message.timestamp,
          profilePicture: message.profilePictureUrl
        }));
        console.log('Parsed message data:', formattedMessages);
        setMessages(formattedMessages);
      }
    }catch (error) {
      setToastMessage('Error fetching messages');
      setShowToast(true);
    }
  }, [setMessages, setToastMessage, setShowToast]);
  // Save Chat
  const saveChat = async () => {
    try {
      const formData = new FormData();
      participants.push(username);
      const chatData = {
        name: chatName,
        participants: participants,
        type: 'GROUP'
      };

      formData.append('chat', new Blob([JSON.stringify(chatData)], { type: 'application/json' }));
      if(chatImage instanceof File) {
        formData.append('image', chatImage);
      }
      const response = await fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        addChatBox(data);
        setChatModalOpen(false);
        await loadChats();
      } else {
        setToastMessage('Error creating chat');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Error creating chat');
      setShowToast(true);
    }
  }

  const saveFriendChat = async (newParticipants) => {
    try {
      const response = await fetch('http://localhost:8080/chat/private', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: 'Private Chat',
          participants: newParticipants.map(username => ({ username })), // Convert string array to object array,
          type: 'PRIVATE'
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Friend chat data:', data);
        addChatBox(data);
        setFriendModalOpen(false);
        setFriendName('');
        await loadChats();
      } else if (response.status === 409) {
        setToastMessage('Friend Chat already exist');
        setShowToast(true);
      } else {
        setToastMessage('Error creating friend chat');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Error creating chat');
      setShowToast(true);
    }
  }
  // Load messages of selected chat
  const handleChatSelect = useCallback((selectedChatId) => {
    loadMessages(selectedChatId);
  }, []);

  // Handle Message Change
  const handleMessageChange = useCallback((e) => {
    setMessageText(e.target.value);
  }, []);

  //Handle Friend Name Change
  const handleFriendNameChange = useCallback((e) => {
    setFriendName(e.target.value);
  }, []);

  // Handle Toast visibility
  const handleHideToast = useCallback(() => {
    setShowToast(false);
  }, []);
  // Handle message submission
  const handleMessageSubmit = useCallback((e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendMessage(chatId, messageText);
    setMessageText('');
  }, [messageText, chatId, sendMessage]);

  // Handle chat submission
  const handleChatSubmit = useCallback((e) => {
    e.preventDefault();
    if (!chatName.trim()) return;
    if (participants.length === 0) {
      setToastMessage('Please add at least one participant');
      setShowToast(true);
      return;
    }
    saveChat();
  }, [chatName, participants, saveChat, username]);

  // Handle friend submission
  const handleFriendSubmit = useCallback((e) => {
    e.preventDefault();
    if (!friendName.trim()) return;
    const newParticipant = [username, friendName];
    saveFriendChat(newParticipant);
  }, [friendName, username, saveFriendChat]);

  // Update your image change handler
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview immediately using blob URL
      const previewUrl = URL.createObjectURL(file);
      setChatImagePreview(previewUrl);
      setChatImage(file);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Toast message={toastMessage} show={showToast} onHide={handleHideToast} />
      <div className="flex items-center p-2">
        <h1 className="text-3xl font-bold text-yellow-300">VaikroChat</h1>
        <div className="flex justify-end w-full">
          <DropdownMenu
            onProfile={() => router.push('/profile/' + username)}
            onAddChat={() => setChatModalOpen(true)}
            onAddFriend={() => setFriendModalOpen(true)}
            onLogout={() => {
              logout();
              setAuth(false);
              router.push('/login');
            }}
          />
          <ChatModal isOpen={isChatModalOpen} onClose={() => setChatModalOpen(false)}>
            <form onSubmit={handleChatSubmit} className="flex flex-col">
              <div>
                <label className="block text-base font-bold mb-2">Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Chat Name"
                  minLength={3}
                  maxLength={20}
                  required
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                />
                <label className="block text-base font-bold mb-1 mt-1">Participants</label>
                <ParticipantSelect
                  chatBoxes={chatBoxes}
                  username={username}
                  onSelectionChange={(selectedParticipants) => {
                    setParticipants(selectedParticipants);
                  }}
                />
                <label className="block text-base font-bold mb-1 mt-1">Chat Image</label>
                <input
                  className="w-1/2 mb-2 text-white file:text-white/50 file:border file:border-yellow-300 file:rounded-lg hover:file:bg-yellow-300 hover:file:text-black file:p-2 file:mr-2"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <img className="items-center justify-center w-50 h-50 p-2 border border-yellow-300 rounded-full" src={chatImagePreview} alt="Preview" />
                <button
                  className={`${styles.button} mt-4`}
                  type="submit">
                  Create Chat
                </button>
              </div>
            </form>
          </ChatModal>
          <FriendModal isOpen={isFriendModalOpen} onClose={() => setFriendModalOpen(false)}>
            <form className="flex flex-col" onSubmit={handleFriendSubmit}>
              <div>
                <label className="block text-base font-bold">Insert Friend's Username</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Friend's Username"
                  minLength={3}
                  maxLength={20}
                  required
                  value={friendName}
                  onChange={handleFriendNameChange}
                />
                <button
                  className={`${styles.button}`}
                  type="submit">
                  Confirm
                </button>
              </div>
            </form>
          </FriendModal>
        </div>
      </div>
        
      
      <div className="flex h-[calc(100vh-73px)] border-2">
        <ChatList chatBoxes={memoizedChatBoxes} onChatSelect={handleChatSelect} />
        
        <div className={`flex flex-col mt-2 mr-2 mb-2 w-full ${chatId == null ? 'hidden' : ''}`}>
          <MessageList messages={messages}/>
          
          <form className='flex items-center p-2 w-full' onSubmit={handleMessageSubmit}>
            <input 
              className={`${styles.input} w-full`}
              type="text"
              value={messageText}
              onChange={handleMessageChange}
              placeholder="Type a message..."
            />
            <button className={`font-bold text-yellow-300 hover:bg-yellow-300 hover:text-black border-1 border-yellow-300 p-2 m-1 rounded-full`} type="submit" disabled={chatId == null}>&#x2191;
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}