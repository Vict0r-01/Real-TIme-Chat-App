'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import ChatList from './components/chatList';
import MessageList from './components/messageList';
import { useAuth } from './context/authContext';
import { useWebSocket } from './utility/chatService';
import ChatModal from './components/chatModal';
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
  const [messages, setMessages] = useState(new Map());
  const {username, setUsername, logout} = useAuth();
  const [messageText, setMessageText] = useState('');
  const [chatName, setChatName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [chatImage, setChatImage] = useState(null);
  const [chatImagePreview, setChatImagePreview] = useState('https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y');
  const [friendName, setFriendName] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const memoizedChatBoxes = useMemo(() => chatBoxes, [chatBoxes]);
  const [messageImages, setMessageImages] = useState([]);
  const [messageImagePreviews, setMessageImagePreviews] = useState([]);
  const [chatId, setChatId] = useState(null);
  
  //Add ChatBox
  const addChatBox = useCallback((chat) => {
    console.log('------------------Adding chat box--------------------');
    setChatBoxes(prev => [...prev, {
      name: chat.type === 'PRIVATE' 
            ? chat.participants.find(p => p.username !== username).username || chat.name 
            : chat.name,
      type: chat.type,
      image: chat.type === 'PRIVATE' 
            ? chat.participants.find(p => p.username !== username).profileImageUrl || chat.imageUrl 
            : chat.imageUrl
    }]);
  }, [username]);

  //Add Message
  const addMessageRef = useRef();
addMessageRef.current = (message) => {
  setMessages(prevMap => {
      const newMap = new Map(prevMap);
      const currentMessages = newMap.get(chatId) || [];
      const newMessages = [...currentMessages, {
          sender: message.sender,
          content: message.text,
          imageUrls: message.imageUrls || [],
          timestamp: message.timestamp || new Date().toISOString(),
          profilePicture: message.profilePictureUrl
      }];
      newMap.set(chatId, newMessages);
      return newMap;
  });
};

const stableAddMessage = useCallback((msg) => addMessageRef.current(msg), []);
const { connected, sendMessage } = useWebSocket(username, stableAddMessage);

  useEffect(() => {
    loadChats();
  }, [username]);

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
      
      if (response.ok) {
        const data = await response.json();
        if(!data) {
          setToastMessage('No chats found');
          setShowToast(true);
          return;
        }
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

      } else {
        //Error handling
        const errorData = await response.json();
        if(response.status === 401 && errorData.message === "Token Expired") {
          setToastMessage('Session expired. Please log in again.');
          setShowToast(true);
          logout();
          router.push('/login');
        }
        if(response.status === 401) {
          setToastMessage('Unauthorized access. Please log in again.');
          setShowToast(true);
          logout();
          router.push('/login');
        }
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

  // Load messages for a specific chat
  const loadMessages = async (chat_Id) => {

    console.log('Loading messages for chat:', chat_Id);
    try{
      const response = await fetch(`http://localhost:8080/chat/${chat_Id}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Debug raw response
      const rawData = await response.text();
      // Parse the response
      const data = JSON.parse(rawData);
      if (response.ok && data) {
        const formattedMessages = data.map(message => ({
          id: message.id,
          sender: message.sender || 'Unknown',
          content: message.text,
          imageUrls: message.imageUrls || [],
          timestamp: message.timestamp,
          profilePicture: message.profilePictureUrl
        }));
        console.log('Parsed message data:', formattedMessages);
        setMessages(prev => new Map(prev).set(chat_Id, formattedMessages));
      }
    }catch (error) {
      setToastMessage('Error fetching messages');
      setShowToast(true);
    }
  };
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
    setChatId(selectedChatId);
    setMessageImagePreviews([]);
    setMessageImages([]);
    setMessageText('');
    if(selectedChatId === chatId || messages.has(selectedChatId)) return;
    loadMessages(selectedChatId);
}, [chatId, messages]);

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
    if (!messageText.trim() && messageImages.length === 0) return;

    const formData = new FormData();
    if(messageText.trim()) formData.append('text', messageText);
    else formData.append('text', '');
    if(messageImages) {
      console.log('Appending single image');
      messageImages.forEach((image) => formData.append('images', image));}

    sendMessage(chatId, formData);
    setMessageText('');
    setMessageImages([]);
    setMessageImagePreviews(prev => {
        // Clean up old preview URLs
        prev.forEach(url => URL.revokeObjectURL(url));
        return [];
    });
    e.target.querySelector('input[type="file"]').value = '';
  }, [messageText, sendMessage, messageImages, messageImagePreviews]);

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
    if (!file || !file.type.startsWith('image/')) {
      setToastMessage('Please select a valid image file');
      setShowToast(true);
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setToastMessage('Image size exceeds 2MB limit');
      setShowToast(true);
      return;
    }
    if (file) {
      // Show preview immediately using blob URL
      const previewUrl = URL.createObjectURL(file);
      setChatImagePreview(previewUrl);
      setChatImage(file);
    }
  };

  const handleMessageImageChange = useCallback((e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) {
        setToastMessage('Please select valid image files');
        setShowToast(true);
        return;
    }
    if (files.some(file => file.size > 2 * 1024 * 1024)) { // 2MB limit
        setToastMessage('One or more images exceed the 2MB size limit');
        setShowToast(true);
        return;
    }
    if (files.length > 0) {
        // Add new files to existing ones
        setMessageImages(prevImages => [...prevImages, ...files]);
        
        // Create and add new preview URLs
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setMessageImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  }, [messageImagePreviews]);

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
              // setAuth(false);
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
          <MessageList key={chatId} messages={messages.get(chatId) || []}/>
          
          {messageImagePreviews.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-2'>
                {messageImagePreviews.map((preview, index) => (
                  <img 
                    key={index} 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    className='w-20 h-20 object-cover rounded-lg border border-yellow-300'
                  />
                ))}
              </div>
            )}
          <form className='flex items-center p-2 w-full' onSubmit={handleMessageSubmit}>
            
            <input 
              className={`${styles.input} w-full`}
              type="text"
              value={messageText}
              onChange={handleMessageChange}
              placeholder="Type a message..."
            />
            <input className={`font-bold text-yellow-300 hover:bg-yellow-300 hover:text-black border-1 border-yellow-300 p-2 m-1 rounded-full`} 
            type="file"
            accept="image/*"
            multiple
            onChange={handleMessageImageChange}
            disabled={chatId == null}
            />
            <button className={`font-bold text-yellow-300 hover:bg-yellow-300 hover:text-black border-1 border-yellow-300 p-2 m-1 rounded-full`} type="submit" disabled={chatId == null}>&#x2191;
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}